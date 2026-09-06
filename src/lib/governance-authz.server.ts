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

/** Capability possession AND organisational scope over the target unit. */
export async function requireCapabilityInScope(
  ctx: AuthedContext,
  code: string,
  orgUnitId: string | null,
): Promise<void> {
  // The generated types type `_org_unit` as non-nullable, but the SQL function
  // accepts NULL (meaning "no specific org unit").
  const { data, error } = await ctx.supabase.rpc("capability_in_scope", {
    _user: ctx.userId,
    _code: code,
    _org_unit: orgUnitId as unknown as string,
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

/** Governance audit. Always server-authored, never client-asserted. */
export async function auditGovernance(
  ctx: AuthedContext,
  eventType: string,
  outcome: "success" | "failure",
  action: string,
  metadata: Record<string, unknown>,
): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const email = typeof ctx.claims["email"] === "string" ? (ctx.claims["email"] as string) : null;
  await supabaseAdmin.from("audit_events").insert({
    user_id: ctx.userId,
    user_email: email,
    event_type: eventType,
    outcome,
    action,
    metadata: metadata as never,
  });
}
