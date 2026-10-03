import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    // Get the user's token from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Admin client with the service-role key (server-side only secret)
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SERVICE_ROLE_KEY") ?? ""
    );
    // Verify who is making the request using their token
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await adminClient.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid or expired session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;
    // Journal photos live at journal-photos/<user id>/<timestamp>.<ext> and are
    // served from public URLs. Deleting the profile row and the auth user left
    // every one of them in the bucket, still reachable, after the account that
    // owned them was gone. Storage trouble is logged but never blocks the
    // deletion — a half-deleted account is worse than an orphaned file.
    try {
      for (;;) {
        const { data: files, error: listError } = await adminClient.storage
          .from("journal-photos")
          .list(userId, { limit: 100 });
        if (listError) {
          console.error("photo cleanup list failed", listError.message);
          break;
        }
        if (!files || files.length === 0) break;
        const paths = files.map((f: { name: string }) => `${userId}/${f.name}`);
        const { error: removeError } = await adminClient.storage
          .from("journal-photos")
          .remove(paths);
        if (removeError) {
          console.error("photo cleanup remove failed", removeError.message);
          break;
        }
        // Removed files drop out of the listing, so the next page is page one.
        if (files.length < 100) break;
      }
    } catch (storageErr) {
      console.error("photo cleanup skipped", String(storageErr));
    }

    // Rows the app writes under this user besides the profile. profile_snapshots
    // is a daily copy of the whole profile row — email, name, photo, journal,
    // garden — and nothing here deleted it, so a deleted account left a copy of
    // itself for every day it was used. Neither table's schema is in this repo,
    // so whether a foreign key would cascade is unknown; deleting explicitly is
    // a no-op if it does. Like the photos, trouble here is logged, not fatal.
    for (const table of ["profile_snapshots", "zone_activity"]) {
      const { error: rowsError } = await adminClient.from(table).delete().eq("user_id", userId);
      if (rowsError) console.error(`${table} cleanup failed`, rowsError.message);
    }

    // The profile row is the account's data. If it cannot be deleted, stop before
    // the auth user goes: once that is gone the gardener can no longer sign in to
    // try again, and the row would outlive the account with no way to remove it.
    const { error: profileError } = await adminClient.from("profiles").delete().eq("id", userId);
    if (profileError) {
      console.error("profile delete failed", profileError.message);
      return new Response(JSON.stringify({ error: "Could not delete your data. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Then delete the auth user
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});