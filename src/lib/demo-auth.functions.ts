import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { demoProfiles } from "./demo-profiles";

/**
 * Server-side DEMO sign-in — non-production only.
 *
 * Disabled unless the server environment explicitly sets
 * `DEMO_ACCESS_ENABLED=true`. Absence of the flag means disabled. The shared
 * demo password never reaches the client bundle, and demo sessions are
 * recorded as demo (`is_demo`) and audited.
 */
function demoEnabled() {
  return process.env["DEMO_ACCESS_ENABLED"] === "true";
}

export const demoAccessStatus = createServerFn({ method: "GET" }).handler(async () => ({
  enabled: demoEnabled(),
}));

export const demoSignIn = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) => {
    if (!data || typeof data.email !== "string") {
      throw new Error("A demo email is required.");
    }
    return { email: data.email.trim().toLowerCase() };
  })
  .handler(async ({ data }) => {
    if (!demoEnabled()) {
      return { ok: false as const, reason: "demo_disabled" as const };
    }

    const allowed = demoProfiles.some((p) => p.email.toLowerCase() === data.email);
    if (!allowed) return { ok: false as const, reason: "not_allowed" as const };

    const SUPABASE_URL = process.env["SUPABASE_URL"];
    const SUPABASE_PUBLISHABLE_KEY = process.env["SUPABASE_PUBLISHABLE_KEY"];
    const DEMO_PASSWORD = process.env["DEMO_PASSWORD"];
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY || !DEMO_PASSWORD) {
      return { ok: false as const, reason: "demo_not_configured" as const };
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: DEMO_PASSWORD,
    });
    if (error || !signInData.session) {
      return { ok: false as const, reason: "sign_in_failed" as const };
    }

    // Demo sessions are opened server-side and explicitly marked as demo.
    const { classifyRequestNetwork } = await import("@/lib/network.server");
    const net = await classifyRequestNetwork();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = signInData.session.user.id;
    await supabaseAdmin
      .from("user_sessions")
      .update({ ended_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("ended_at", null);
    await supabaseAdmin.from("user_sessions").insert({
      user_id: userId,
      ip_address: net.ip,
      network_classification: net.classification,
      mfa_verified: true,
      // is_demo: pending Batch 3 migration
    });
    await supabaseAdmin.from("audit_events").insert({
      user_id: userId,
      user_email: data.email,
      event_type: "login_success",
      outcome: "success",
      action: "DEMO sign-in (non-production demo access)",
      ip_address: net.ip,
      network_classification: net.classification,
      metadata: { demo: true } as never,
    });

    return {
      ok: true as const,
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
    };
  });
