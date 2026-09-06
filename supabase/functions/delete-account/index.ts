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

    // Delete the user's profile row first
    await adminClient.from("profiles").delete().eq("id", userId);
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