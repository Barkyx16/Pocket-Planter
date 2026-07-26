// Bridges the JS widget snapshot (buildWidgetSnapshot in core.js) to the native
// side. On iOS the snapshot is written to a shared App Group (UserDefaults
// suite) that the WidgetKit extension / Live Activity reads; on Android to the
// equivalent shared prefs for a Glance/AppWidget.
//
// This is written to be SHIPPABLE TODAY: it talks to an optional native module
// via NativeModules, which is simply `undefined` when the module isn't built in
// yet (not a bundling error). So it no-ops safely until the native target is
// added — see docs/widgets-setup.md for the extension + config-plugin steps.
import { NativeModules, Platform } from "react-native";

export const WIDGET_APP_GROUP = "group.green.pocketplanter.widgets";
export const WIDGET_KEY = "gardenSnapshot";

// Present only once the native module is compiled into the app (via prebuild).
const Native = NativeModules.PocketPlanterWidgets || null;

let lastPayload = null;

/**
 * Persist the latest garden snapshot for the widgets, refresh their timelines,
 * and keep the frost Live Activity in sync. Cheap and idempotent.
 */
export function syncWidgets(snapshot) {
  if (!snapshot) return;
  // The Live Activity has its own dedup, so drive it before the payload check.
  updateFrostActivity(snapshot);

  let payload;
  try { payload = JSON.stringify(snapshot); } catch (e) { return; }
  if (payload === lastPayload) return; // unchanged since last sync — skip
  lastPayload = payload;

  if (!Native || typeof Native.setSnapshot !== "function") return; // native target not wired yet
  try {
    Native.setSnapshot(WIDGET_APP_GROUP, WIDGET_KEY, payload);
    if (Platform.OS === "ios" && typeof Native.reloadAllTimelines === "function") {
      Native.reloadAllTimelines();
    }
  } catch (e) {
    // Best-effort: a widget write must never crash or block the app.
  }
}

// ── Frost Live Activity (Dynamic Island / lock screen countdown) ─────────────
// Runs a live countdown to the next frost on frost nights, and ends it once the
// risk passes. iOS 16.1+ / ActivityKit only; no-ops elsewhere and until the
// native module + Live Activity target are wired in.
let frostKey = null; // `${date}|${minTempF}` currently showing, or null

export function updateFrostActivity(snapshot) {
  if (Platform.OS !== "ios") return;
  if (!Native || typeof Native.startFrostActivity !== "function") return;

  const f = snapshot && snapshot.frost;
  const shouldShow = !!(f && typeof f.daysOut === "number" && f.daysOut <= 1 && f.date);

  if (shouldShow) {
    const key = `${f.date}|${f.minTempF}`;
    if (key === frostKey) return; // already showing this exact frost — nothing to do
    frostKey = key;
    try { Native.startFrostActivity(f.date, f.minTempF, snapshot.zone || ""); } catch (e) {}
  } else if (frostKey !== null) {
    frostKey = null;
    try { if (typeof Native.endFrostActivity === "function") Native.endFrostActivity(); } catch (e) {}
  }
}

export function widgetsAvailable() {
  return !!(Native && typeof Native.setSnapshot === "function");
}
