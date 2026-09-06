import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";

// Owns every piece of App Store review-prompt logic. Nothing in here is allowed
// to throw into a calling screen — a storage failure or a rejected native
// promise is logged and swallowed.
//
// Native prompt only. Apple throttles requestReview() hard (a handful of prompts
// per user per year, silently ignored after that), so the gates below exist to
// spend those few prompts on a good moment rather than a random one.

const KEYS = {
  appOpens: "pp_reviewAppOpens",
  hasRequested: "pp_reviewRequested",
  lastRequestedAt: "pp_reviewLastRequestedAt",
  migrationV2: "pp_reviewMigrationV2",
};

const MIN_APP_OPENS = 5;
const MIN_DAYS_BETWEEN_REQUESTS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

// ── One-time migration ─────────────────────────────────────────────────────
// Before this module existed, pp_reviewRequested was set on the first prompt and
// never cleared, and prompts fired from three different moments (streak
// milestone, first harvest, 5th plant save). Those users are flagged forever and
// were asked at a poor moment. Clear the flag exactly once so they become
// eligible again on the harvest path.
//
// The pp_reviewMigrationV2 marker is what makes this once-per-install rather
// than once-per-launch. Blanket-clearing pp_reviewRequested on every launch
// would re-prompt the same user on every harvest, which is the abuse pattern
// Apple throttles.
//
// The in-flight promise is memoised so concurrent callers (incrementAppOpens on
// launch, maybeRequestReview from a screen) share a single run rather than
// racing each other.
let migrationPromise = null;

// Every gate below sits behind an await, so two calls starting close together
// (a double-tapped harvest submit) can both read hasRequested as null before
// either writes it, and both reach requestReview(). One call at a time.
let requestInFlight = false;

async function runMigration() {
  const done = await AsyncStorage.getItem(KEYS.migrationV2);
  if (done) return;

  await AsyncStorage.removeItem(KEYS.hasRequested);

  // These users have plainly opened the app more than five times; seed the
  // counter so the migration doesn't gate them behind a fresh count.
  const stored = Number(await AsyncStorage.getItem(KEYS.appOpens)) || 0;
  if (stored < MIN_APP_OPENS) {
    await AsyncStorage.setItem(KEYS.appOpens, String(MIN_APP_OPENS));
  }

  await AsyncStorage.setItem(KEYS.migrationV2, "true");
}

function ensureMigrated() {
  if (!migrationPromise) {
    migrationPromise = runMigration().catch((error) => {
      console.log("Review migration skipped:", error);
      // Leave the marker unwritten so a later launch can retry, but clear the
      // memo so this launch doesn't keep replaying a failing write.
      migrationPromise = null;
    });
  }
  return migrationPromise;
}

// ── Public API ─────────────────────────────────────────────────────────────

// Call once per app launch, from the root component.
export async function incrementAppOpens() {
  try {
    await ensureMigrated();
    const stored = Number(await AsyncStorage.getItem(KEYS.appOpens)) || 0;
    await AsyncStorage.setItem(KEYS.appOpens, String(stored + 1));
  } catch (error) {
    console.log("App open count skipped:", error);
  }
}

// The gated trigger. Returns early and does nothing unless every gate passes.
// Safe to call from anywhere; never throws, never returns a rejected promise.
export async function maybeRequestReview() {
  if (requestInFlight) {
    if (__DEV__) console.log("[reviewPrompt] blocked: a request is already in flight");
    return;
  }
  requestInFlight = true;
  try {
    await ensureMigrated();

    const available = await StoreReview.isAvailableAsync();
    if (!available) {
      if (__DEV__) console.log("[reviewPrompt] blocked: StoreReview not available");
      return;
    }

    const opens = Number(await AsyncStorage.getItem(KEYS.appOpens)) || 0;
    if (opens < MIN_APP_OPENS) {
      if (__DEV__) console.log(`[reviewPrompt] blocked: app opens ${opens} < ${MIN_APP_OPENS}`);
      return;
    }

    const hasRequested = await AsyncStorage.getItem(KEYS.hasRequested);
    if (hasRequested) {
      if (__DEV__) console.log("[reviewPrompt] blocked: already requested");
      return;
    }

    // Belt-and-braces: hasRequested alone should cover this, but if the flag is
    // ever cleared again (a future migration, a dev reset on a real install)
    // this keeps us off the 90-day floor.
    const lastRequestedAt = await AsyncStorage.getItem(KEYS.lastRequestedAt);
    if (lastRequestedAt) {
      const elapsed = Date.now() - new Date(lastRequestedAt).getTime();
      if (!Number.isNaN(elapsed) && elapsed < MIN_DAYS_BETWEEN_REQUESTS * DAY_MS) {
        if (__DEV__) {
          const days = Math.floor(elapsed / DAY_MS);
          console.log(`[reviewPrompt] blocked: ${days}d since last request < ${MIN_DAYS_BETWEEN_REQUESTS}d`);
        }
        return;
      }
    }

    // Reaching here means every gate passed. iOS will not tell us whether the
    // dialog actually rendered, so this log is the last observable point.
    if (__DEV__) console.log("[reviewPrompt] all gates passed — calling requestReview()");

    try {
      await StoreReview.requestReview();
    } finally {
      // Set the flag after the native call settles, not before — but set it even
      // when the call rejects, so a persistent failure can't spin into a
      // prompt-on-every-harvest retry loop.
      await AsyncStorage.setItem(KEYS.hasRequested, "true");
      await AsyncStorage.setItem(KEYS.lastRequestedAt, new Date().toISOString());
    }
  } catch (error) {
    console.log("Review request skipped:", error);
  } finally {
    requestInFlight = false;
  }
}

// ── Dev-only reset ─────────────────────────────────────────────────────────
// Clears every persisted key and the migration memo so the next call replays
// from a clean install's state. Not wired to any UI — call it from a debug
// context. The __DEV__ check guards the body, not just the export, so this is
// inert in a production build even if something reaches it.
export async function __resetReviewStateForTesting() {
  if (!__DEV__) return;
  try {
    const before = await AsyncStorage.multiGet(Object.values(KEYS));
    await AsyncStorage.multiRemove(Object.values(KEYS));
    migrationPromise = null;
    console.log(
      "[reviewPrompt] reset — cleared:",
      Object.fromEntries(before.map(([key, value]) => [key, value ?? "(unset)"])),
    );
    // Note: App.js keeps its own module-level appOpenCounted flag to make the
    // launch count idempotent. This cannot reach it — reload the bundle (press
    // r in the Metro terminal) before expecting incrementAppOpens to run again.
    console.log("[reviewPrompt] reload the bundle to re-arm the app-open counter");
  } catch (error) {
    console.log("Review reset skipped:", error);
  }
}
