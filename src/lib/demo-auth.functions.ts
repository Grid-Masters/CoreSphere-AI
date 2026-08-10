import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { getRequestHeader } from "@tanstack/react-start/server";
import { demoProfiles } from "./demo-profiles";

/**
 * Server-side DEMO sign-in — non-production only.
 *
 * Enabled only when the request is positively identified as this project's
 * private preview/UAT environment, or when the server environment explicitly
 * sets `DEMO_ACCESS_ENABLED=true`. Host matching is EXACT — no wildcard
 * `*.lovable.app`, no published/production host, and any unknown or
 * unreadable host fails closed. The shared demo password never reaches the
 * client bundle, and demo sessions are recorded as demo (`is_demo`) and
 * audited.
 */
const PROJECT_ID = "22d92d5c-d31f-427f-9f00-5c9e88499e04";

/** Exact hosts that constitute the private preview/UAT environment. */
const UAT_HOSTS = new Set([
  `id-preview--${PROJECT_ID}.lovable.app`,
  `preview--${PROJECT_ID}.lovable.app`,
  `project--${PROJECT_ID}-dev.lovable.app`,
  "localhost:8080",
  "127.0.0.1:8080",
]);

function requestHost(): string | null {
  try {
    const host = getRequestHeader("host");
    return host ? host.trim().toLowerCase() : null;
  } catch {
    return null;
  }
}

function demoEnabled() {
  if (process.env["DEMO_ACCESS_ENABLED"] === "true") return true;
  const host = requestHost();
  // Fail closed: unknown / published / production hosts never enable demo.
  return host !== null && UAT_HOSTS.has(host);
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
      // Environment-isolated demo access only; never available unless the
      // server explicitly sets DEMO_ACCESS_ENABLED=true.
      is_demo: true,
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
