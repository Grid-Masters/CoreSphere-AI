import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  buildAdministrationRegistry,
  type AdministrationRegistry,
} from "@/lib/administration-registry";

/**
 * Server-authorised Administration Center access (Batch 3).
 *
 * The security boundary is here, not in the UI: the caller is identified from
 * the verified bearer token and authorised with `public.has_capability`.
 * A client-supplied position/role string is never trusted.
 */
async function assertCapability(
  context: { supabase: any; userId: string },
  code: string,
): Promise<void> {
  const { data, error } = await context.supabase.rpc("has_capability", {
    _user_id: context.userId,
    _code: code,
  });
  if (error) throw new Error("Authorisation check failed");
  if (data !== true) throw new Error("Forbidden");
}

export const getAdministrationRegistry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdministrationRegistry> => {
    await assertCapability(context, "platform.identity.manage");
    return buildAdministrationRegistry(context.supabase);
  });

export type AuditRow = {
  id: string;
  at: string;
  who: string | null;
  eventType: string;
  outcome: string;
  action: string | null;
  network: string | null;
};

export type LoginRow = {
  id: string;
  at: string;
  device: string | null;
  browser: string | null;
  network: string;
  mfaVerified: boolean;
  isDemo: boolean;
  active: boolean;
};

/** Real audit records — requires the platform audit capability. */
export const getAuditTrail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AuditRow[]> => {
    await assertCapability(context, "platform.audit.view");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("audit_events")
      .select("id, created_at, user_email, event_type, outcome, action, network_classification")
      .order("created_at", { ascending: false })
      .limit(25);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: r.id,
      at: r.created_at,
      who: r.user_email,
      eventType: r.event_type,
      outcome: r.outcome,
      action: r.action,
      network: r.network_classification,
    }));
  });

/** Real application session records — requires the platform audit capability. */
export const getLoginActivity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LoginRow[]> => {
    await assertCapability(context, "platform.audit.view");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("user_sessions")
      .select("id, login_at, device, browser, network_classification, mfa_verified, is_demo, ended_at")
      .order("login_at", { ascending: false })
      .limit(25);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: r.id,
      at: r.login_at,
      device: r.device,
      browser: r.browser,
      network: r.network_classification,
      mfaVerified: r.mfa_verified,
      isDemo: r.is_demo,
      active: r.ended_at === null,
    }));
  });