# Server-side Premium validation

Premium used to be decided on the device: the app set `premiumUnlocked` itself and
wrote it into its own `profiles.premium_unlocked` column, which it then read back as
truth. A patched build could therefore grant itself Premium permanently, and the
server would happily store it.

Entitlement is now decided by RevenueCat's webhook and stored in
`premium_entitlements`, a table the client can read (own row only) but never write.

## Deploy — three steps

**1. Apply the migration** (creates the table + RLS, and revokes the client's ability
to write `profiles.premium_unlocked`):

```bash
supabase db push
```

**2. Set the shared secret and deploy the function.** Use a long random string —
`openssl rand -hex 32` is fine:

```bash
supabase secrets set REVENUECAT_WEBHOOK_SECRET=<random-string>
supabase functions deploy revenuecat-webhook --no-verify-jwt
```

`--no-verify-jwt` is required: RevenueCat calls this with its own auth header, not a
Supabase user JWT. The function does its own shared-secret check instead.

**3. Point RevenueCat at it.** Dashboard → Project → Integrations → Webhooks:

- **URL:** `https://<project-ref>.supabase.co/functions/v1/revenuecat-webhook`
- **Authorization header:** `Bearer <the same random string>`

## Verify it works

```bash
# Should be 401 — no secret.
curl -i -X POST https://<project-ref>.supabase.co/functions/v1/revenuecat-webhook \
  -H "Content-Type: application/json" -d '{"event":{"type":"TEST"}}'

# Should be 200 with {"ok":true,...}
curl -i -X POST https://<project-ref>.supabase.co/functions/v1/revenuecat-webhook \
  -H "Authorization: Bearer <random-string>" \
  -H "Content-Type: application/json" \
  -d '{"event":{"type":"INITIAL_PURCHASE","app_user_id":"<a-real-supabase-uid>","expiration_at_ms":4102444800000}}'
```

RevenueCat's dashboard also has a "Send test event" button once the webhook is saved.

Then confirm the client cannot cheat — signed in as a normal user:

```sql
-- expect: permission denied / 0 rows updated
update premium_entitlements set is_active = true where user_id = auth.uid();
update profiles set premium_unlocked = true where id = auth.uid();
```

## How the app decides

`refreshEntitlement()` in `App.js`:

1. Read `premium_entitlements` for the signed-in user → that answer wins.
2. **No row yet** (purchase just made, webhook still in flight) → fall back to the
   store receipt via `Purchases.getCustomerInfo()`.
3. **Fetch failed** (offline) → same store-receipt fallback.

The fallback matters: a real subscriber must never be locked out by a slow webhook.
It's still Apple/Google-signed, it's just not something the *server* takes the app's
word on.

`Purchases.logIn(user.id)` runs after sign-in so `app_user_id` is the Supabase user
id — that's what lets the webhook attribute an event to an account. `Purchases.logOut()`
runs on sign-out so the next account on the device doesn't inherit entitlement.

## What this does and doesn't fix

**Fixed:** a tampered client can no longer persist a fake entitlement, can't write
either table, and anything server-side can now trust `premium_entitlements`.

**Not fixed:** a patched binary running on a jailbroken device can still flip its own
in-memory `premiumUnlocked` and render paid screens locally. That's unavoidable for
client-rendered content — the defence is that it survives neither a restart nor a
reinstall, and never reaches the server. If some Premium feature ever needs stronger
protection, move that feature's data or computation behind an edge function that
checks `premium_entitlements` itself.
