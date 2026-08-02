// RevenueCat webhook -> server-authoritative entitlement.
//
// The app used to decide for itself whether Premium was unlocked and write that
// straight into its own profile row, so a patched client could grant itself
// Premium permanently. Entitlement is now decided here, from RevenueCat's own
// event, and written with the service-role key into a table the client cannot
// write to.
//
// Setup (see supabase/functions/revenuecat-webhook/README.md):
//   supabase secrets set REVENUECAT_WEBHOOK_SECRET=<a long random string>
//   supabase functions deploy revenuecat-webhook --no-verify-jwt
//   RevenueCat dashboard -> Integrations -> Webhooks:
//     URL:            https://<project-ref>.supabase.co/functions/v1/revenuecat-webhook
//     Authorization:  Bearer <the same random string>
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Event types that mean "this user should have access right now".
const GRANTING = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "UNCANCELLATION",
  "NON_RENEWING_PURCHASE",
  "SUBSCRIPTION_EXTENDED",
  "PRODUCT_CHANGE",
  "TRANSFER",
]);
// Event types that mean access is gone.
const REVOKING = new Set([
  "EXPIRATION",
  "REFUND",
  "SUBSCRIPTION_PAUSED",
]);
// CANCELLATION is deliberately absent: a cancelled subscription keeps access
// until it expires, and RevenueCat sends EXPIRATION when it actually lapses.

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Shared-secret check. Without this anyone could POST themselves Premium.
  const secret = Deno.env.get("REVENUECAT_WEBHOOK_SECRET");
  if (!secret) {
    console.error("REVENUECAT_WEBHOOK_SECRET is not set — refusing to process events.");
    return new Response(JSON.stringify({ error: "Server not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  const auth = req.headers.get("Authorization") ?? "";
  const provided = auth.replace(/^Bearer\s+/i, "");
  // Length-independent comparison to avoid leaking the secret via timing.
  const enc = new TextEncoder();
  const a = enc.encode(provided);
  const b = enc.encode(secret);
  let same = a.length === b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i % (a.length || 1)] !== b[i % (b.length || 1)]) same = false;
  }
  if (!same) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const event = body?.event ?? body;
    const type = String(event?.type ?? "");

    // app_user_id is the Supabase user id because the app calls
    // Purchases.logIn(user.id) after sign-in. Anonymous ids ($RCAnonymousID:...)
    // can't be mapped to an account, so they're acknowledged and ignored.
    const userId: string = event?.app_user_id ?? "";
    if (!userId || userId.startsWith("$RCAnonymousID")) {
      return new Response(JSON.stringify({ ok: true, skipped: "unmapped app_user_id" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    let isActive: boolean;
    if (GRANTING.has(type)) isActive = true;
    else if (REVOKING.has(type)) isActive = false;
    else {
      // Unknown/among them CANCELLATION and BILLING_ISSUE: fall back to the
      // expiry RevenueCat reports rather than guessing.
      const ms = Number(event?.expiration_at_ms ?? 0);
      isActive = ms > Date.now();
    }

    // TRANSFER moves entitlement away from the previous owner.
    if (type === "TRANSFER") {
      const from: string[] = event?.transferred_from ?? [];
      if (Array.isArray(from) && from.length) {
        const admin = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SERVICE_ROLE_KEY") ?? "",
        );
        await admin.from("premium_entitlements")
          .update({ is_active: false, event_type: "TRANSFER_OUT", updated_at: new Date().toISOString() })
          .in("user_id", from.filter((id) => id && !id.startsWith("$RCAnonymousID")));
      }
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SERVICE_ROLE_KEY") ?? "",
    );
    const expiresMs = Number(event?.expiration_at_ms ?? 0);
    const { error } = await admin.from("premium_entitlements").upsert({
      user_id: userId,
      is_active: isActive,
      product_id: event?.product_id ?? null,
      store: event?.store ?? null,
      expires_at: expiresMs ? new Date(expiresMs).toISOString() : null,
      event_type: type || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    if (error) {
      console.error("entitlement upsert failed", error);
      // 500 so RevenueCat retries rather than dropping the event.
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, user_id: userId, is_active: isActive }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("webhook error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
