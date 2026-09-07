/**
 * Server-only governance authorisation helpers.
 *
 * Every check is derived from the verified bearer identity (`userId`) and the
 * database capability/scope model. A client-supplied actor, role, position or
 * scope is never trusted. Privileged writes still perform per-record checks
 * before touching the service-role client.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type AuthedContext = {
  supabase: SupabaseClient<Database>;
  userId: string;
  claims: Record<string, unknown>;
};

export class GovernanceError extends Error {
  constructor(
    message: string,
    readonly code: "forbidden" | "invalid_transition" | "conflict" | "not_found" | "invalid_input",
  ) {
    super(message);
  }
}

export function forbidden(reason = "Forbidden"): never {
  throw new GovernanceError(reason, "forbidden");
}

/** Capability possession, evaluated as the caller (RLS/invoker path). */
export async function hasCapability(ctx: AuthedContext, code: string): Promise<boolean> {
  const { data, error } = await ctx.supabase.rpc("has_capability", {
    _user_id: ctx.userId,
    _code: code,
  });
  if (error) throw new GovernanceError("Authorisation check failed", "forbidden");
  return data === true;
}

export async function requireCapability(ctx: AuthedContext, code: string): Promise<void> {
  if (!(await hasCapability(ctx, code))) forbidden(`Missing capability: ${code}`);
}

export async function requireAnyCapability(ctx: AuthedContext, codes: string[]): Promise<string> {
  for (const code of codes) {
    if (await hasCapability(ctx, code)) return code;
  }
  return forbidden(`Missing capability: one of ${codes.join(", ")}`);
}

/**
 * Capability possession AND organisational scope over the target unit.
 *
 * `orgUnitId` MUST be the target record's authoritative organisation unit,
 * read server-side — never a client-supplied value. A missing organisation is
 * not "unrestricted": the SQL function denies it unless the caller holds
 * explicit enterprise authority.
 */
export async function requireCapabilityInScope(
  ctx: AuthedContext,
  code: string,
  orgUnitId: string,
): Promise<void> {
  const { data, error } = await ctx.supabase.rpc("capability_in_scope", {
    _user: ctx.userId,
    _code: code,
    _org_unit: orgUnitId,
  });
  if (error) throw new GovernanceError("Authorisation check failed", "forbidden");
  if (data !== true) forbidden(`Out of scope for capability: ${code}`);
}


/** Maker–checker: the actor who produced a record may not approve it. */
export function requireSeparationOfDuties(actorId: string, makerId: string | null): void {
  if (makerId && actorId === makerId) {
    forbidden("Separation of duties: the author of this record cannot approve it");
  }
}

export function requireTransition<T extends string>(
  from: T,
  to: T,
  legal: Record<string, readonly string[]>,
): void {
  const allowed = legal[from] ?? [];
  if (!allowed.includes(to)) {
    throw new GovernanceError(`Illegal transition ${from} → ${to}`, "invalid_transition");
  }
}

/**
 * Governance audit. Always server-authored, never client-asserted.
 *
 * A failed audit write is a hard failure: the caller must abort (and roll back
 * its governed mutation) rather than silently proceed unaudited.
 */
export async function auditGovernance(
  ctx: AuthedContext,
  eventType: string,
  outcome: "success" | "failure",
  action: string,
  metadata: Record<string, unknown>,
): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const email = typeof ctx.claims["email"] === "string" ? (ctx.claims["email"] as string) : null;
  const { error } = await supabaseAdmin.from("audit_events").insert({
    user_id: ctx.userId,
    user_email: email,
    event_type: eventType,
    outcome,
    action,
    metadata: metadata as never,
  });
  if (error) {
    throw new GovernanceError(`Audit write failed: ${error.message}`, "conflict");
  }
}

