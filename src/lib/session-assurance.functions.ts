import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Server-derived session assurance (Batch 3).
 *
 * The authoritative session is derived from `user_sessions` for the
 * authenticated caller. A client-supplied session id is never trusted for
 * privilege or MFA state; it is at most a correlation hint.
 */
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const ABSOLUTE_MAX_MS = 12 * 60 * 60 * 1000; // 12 hours

export type SessionAssurance = {
  authenticated: boolean;
  session_valid: boolean;
  session_id: string | null;
  mfa_required: boolean;
  mfa_verified: boolean;
  reason: string | null;
};

export const getSessionAssurance = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SessionAssurance> => {
    const { classifyRequestNetwork } = await import("@/lib/network.server");
    const net = await classifyRequestNetwork();
    const mfa_required = net.classification === "external";

    const { data: rows } = await context.supabase
      .from("user_sessions")
      .select("id, login_at, last_activity_at, ended_at, mfa_verified")
      .eq("user_id", context.userId)
      .is("ended_at", null)
      .order("login_at", { ascending: false })
      .limit(1);

    const row = rows?.[0];
    if (!row) {
      return {
        authenticated: true,
        session_valid: false,
        session_id: null,
        mfa_required,
        mfa_verified: false,
        reason: "no_active_session",
      };
    }

    const now = Date.now();
    const idleExpired = now - new Date(row.last_activity_at).getTime() > IDLE_TIMEOUT_MS;
    const absoluteExpired = now - new Date(row.login_at).getTime() > ABSOLUTE_MAX_MS;

    if (idleExpired || absoluteExpired) {
      await context.supabase
        .from("user_sessions")
        .update({ ended_at: new Date().toISOString() })
        .eq("id", row.id)
        .eq("user_id", context.userId);
      return {
        authenticated: true,
        session_valid: false,
        session_id: row.id,
        mfa_required,
        mfa_verified: false,
        reason: idleExpired ? "idle_timeout" : "absolute_timeout",
      };
    }

    await context.supabase
      .from("user_sessions")
      .update({ last_activity_at: new Date().toISOString() })
      .eq("id", row.id)
      .eq("user_id", context.userId);

    return {
      authenticated: true,
      session_valid: true,
      session_id: row.id,
      mfa_required,
      mfa_verified: Boolean(row.mfa_verified),
      reason: null,
    };
  });

/** Ends the caller's own active session. No client-supplied id is accepted. */
export const endActiveSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase
      .from("user_sessions")
      .update({ ended_at: new Date().toISOString() })
      .eq("user_id", context.userId)
      .is("ended_at", null);
    return { ok: true as const };
  });
