import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------------- Network classification ----------------
// CIDR lookup happens server-side only (privileged client). The browser
// receives the classification, never the trusted-network list.
export const classifyNetwork = createServerFn({ method: "GET" }).handler(async () => {
  const { classifyRequestNetwork } = await import("@/lib/network.server");
  const { classification } = await classifyRequestNetwork();
  return { classification };
});

// ---------------- Audit logging ----------------
/**
 * Authenticated audit event. Identity is taken from the verified bearer
 * token — never from client-supplied email/role — and inserted as the caller
 * so the `user_id = auth.uid()` RLS check applies.
 */
export const logAuditEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    event_type: string;
    outcome: "success" | "failure";
    action?: string;
    device?: string;
    browser?: string;
    metadata?: Record<string, unknown>;
  }) => data)
  .handler(async ({ data, context }) => {
    const { classifyRequestNetwork } = await import("@/lib/network.server");
    const net = await classifyRequestNetwork();
    const email = typeof context.claims.email === "string" ? context.claims.email : null;
    await context.supabase.from("audit_events").insert({
      user_id: context.userId,
      user_email: email,
      event_type: data.event_type,
      outcome: data.outcome,
      action: data.action ?? null,
      device: data.device ?? null,
      browser: data.browser ?? null,
      ip_address: net.ip,
      network_classification: net.classification,
      metadata: (data.metadata ?? {}) as never,
    });
    return { ok: true as const };
  });

/**
 * Unauthenticated authentication-failure audit. There is no verified identity
 * yet, so the row is written by server-only privileged code with
 * `user_id = null`, retaining only the attempted email.
 */
export const logAuthFailure = createServerFn({ method: "POST" })
  .inputValidator((data: { attempted_email?: string; action?: string }) => data)
  .handler(async ({ data }) => {
    const { classifyRequestNetwork } = await import("@/lib/network.server");
    const net = await classifyRequestNetwork();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("audit_events").insert({
      user_id: null,
      user_email: data.attempted_email?.slice(0, 320) ?? null,
      event_type: "login_failed",
      outcome: "failure",
      action: data.action ?? "Sign-in rejected",
      ip_address: net.ip,
      network_classification: net.classification,
      metadata: {} as never,
    });
    return { ok: true as const };
  });

// ---------------- Session lifecycle ----------------
/**
 * Opens an application session for the authenticated caller. Network
 * classification and MFA state are decided server-side; the client cannot
 * assert that it is MFA-verified.
 */
export const createSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { device?: string; browser?: string }) => data ?? {})
  .handler(async ({ data, context }) => {
    const { classifyRequestNetwork } = await import("@/lib/network.server");
    const net = await classifyRequestNetwork();
    // External networks require hard-token verification, which cannot be
    // performed until a genuine verifier is integrated → fail closed.
    const mfa_verified = net.classification === "internal";
    const { data: row, error } = await context.supabase
      .from("user_sessions")
      .insert({
        user_id: context.userId,
        device: data.device?.slice(0, 120) ?? null,
        browser: data.browser?.slice(0, 200) ?? null,
        ip_address: net.ip,
        network_classification: net.classification,
        mfa_verified,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return {
      session_id: row.id,
      classification: net.classification,
      mfa_verified,
    };
  });

// ---------------- MFA verification (hard-token secure-pass) ----------------
/**
 * FAIL-CLOSED. UBA hard tokens emit an 8-digit rolling code that can only be
 * validated by the bank's token-verification service. No such integration
 * exists in this project, so no code — however well-formed — may be treated
 * as proof of possession. This function never returns success.
 */
export const verifyHardToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { code: string }) => data)
  .handler(async () => {
    return {
      ok: false as const,
      reason: "verifier_not_configured" as const,
    };
  });
