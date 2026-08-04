import { supabase } from "@/integrations/supabase/client";
import type { Role } from "./directory";
import type { CountryCode } from "./org-structure";

/**
 * Database-backed identity model (Batch 2B).
 *
 * The signed-in Supabase user is resolved to exactly one ACTIVE profile and
 * one current ACTIVE primary position assignment. There is NO fallback to a
 * static directory record, an email-derived persona, or a "first demo user".
 * All reads go through the signed-in user's Supabase client, so RLS applies.
 */

export const POSITION_CODES = [
  "CEE",
  "TEAM_LEAD",
  "UNIT_HEAD",
  "QA_OFFICER",
  "QA_TEAM_LEAD",
  "QA_UNIT_HEAD",
  "LD_OFFICER",
  "LD_TEAM_LEAD",
  "LD_UNIT_HEAD",
  "HEAD_CFC_OPERATIONS",
  "GROUP_HEAD",
  "PLATFORM_ADMINISTRATOR",
  "DELEGATED_APPROVER",
] as const;

export type PositionCode = (typeof POSITION_CODES)[number];

export type OrgUnitRef = {
  id: string;
  code: string;
  name: string;
  displayName: string;
  unitType: string;
};

/**
 * Presentation-only compatibility shim. The six-value `Role` union predates
 * the 13-position model and is retained ONLY so existing copy/rendering keeps
 * working. Access decisions must use `positionCode` or `capabilities`.
 */
const LEGACY_ROLE_BY_POSITION: Record<PositionCode, Role> = {
  CEE: "staff",
  DELEGATED_APPROVER: "staff",
  TEAM_LEAD: "team_lead",
  UNIT_HEAD: "team_lead",
  QA_OFFICER: "qa",
  QA_TEAM_LEAD: "qa",
  QA_UNIT_HEAD: "qa",
  LD_OFFICER: "ld",
  LD_TEAM_LEAD: "ld",
  LD_UNIT_HEAD: "ld",
  HEAD_CFC_OPERATIONS: "group_head",
  GROUP_HEAD: "group_head",
  PLATFORM_ADMINISTRATOR: "sysadmin",
};

export type ActiveUser = {
  // Database identity
  userId: string;
  profileId: string;
  positionCode: PositionCode;
  positionTitle: string;
  orgUnit: OrgUnitRef;
  orgUnitAncestors: OrgUnitRef[];
  capabilities: string[];
  assignmentId: string;
  effectiveFrom: string;
  effectiveTo: string | null;

  // Display fields (shape kept compatible with existing UI consumers)
  email: string;
  name: string;
  initials: string;
  roleLabel: string;
  department: string;
  unit: string;
  reportsTo?: string;
  assignedQAOfficer?: string;
  country?: CountryCode;
  /** @deprecated presentation-only legacy grouping; use positionCode */
  role: Role;
};

export type IdentityState =
  | { status: "loading"; user: null }
  | { status: "resolved"; user: ActiveUser }
  | { status: "access_not_provisioned"; user: null; reason: string }
  | { status: "error"; user: null; reason: string };

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function toRef(row: any): OrgUnitRef {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    displayName: row.display_name,
    unitType: row.unit_type,
  };
}

/** Best-effort audit trail. Never blocks the resolved identity state. */
async function auditProvisioningFailure(userId: string | null, email: string | null, reason: string) {
  try {
    await supabase.from("audit_events").insert({
      user_id: userId,
      user_email: email,
      event_type: "IDENTITY_PROVISIONING",
      outcome: "DENIED",
      action: reason,
      metadata: { source: "identity-provider" },
    });
  } catch {
    /* audit failures must not affect the access state */
  }
}

const DENIED = (reason: string): IdentityState => ({
  status: "access_not_provisioned",
  user: null,
  reason,
});

export async function resolveIdentity(): Promise<IdentityState> {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return { status: "error", user: null, reason: "No verified session" };
  }
  const authUser = authData.user;
  const email = authUser.email ?? null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, user_id, full_name, preferred_name, corporate_email, profile_status, employment_status, country_code",
    )
    .eq("user_id", authUser.id)
    .maybeSingle();

  if (profileError) {
    return { status: "error", user: null, reason: profileError.message };
  }
  if (!profile) {
    void auditProvisioningFailure(authUser.id, email, "No profile record");
    return DENIED("no_profile");
  }
  if (profile.profile_status !== "ACTIVE" || profile.employment_status !== "ACTIVE") {
    void auditProvisioningFailure(authUser.id, email, "Profile inactive");
    return DENIED("inactive_profile");
  }

  const today = new Date().toISOString().slice(0, 10);
  const { data: assignments, error: assignmentError } = await supabase
    .from("position_assignments")
    .select(
      "id, position_id, organisation_unit_id, effective_from, effective_to, status, is_primary, positions(code, title), organisation_units(id, code, name, display_name, unit_type, parent_unit_id)",
    )
    .eq("user_id", authUser.id)
    .eq("is_primary", true)
    .eq("status", "ACTIVE")
    .lte("effective_from", today);

  if (assignmentError) {
    return { status: "error", user: null, reason: assignmentError.message };
  }

  const assignment = (assignments ?? []).find(
    (a: any) => a.effective_to === null || a.effective_to >= today,
  ) as any;

  if (!assignment || !assignment.positions || !assignment.organisation_units) {
    void auditProvisioningFailure(authUser.id, email, "No current active primary assignment");
    return DENIED("no_active_assignment");
  }

  const positionCode = assignment.positions.code as PositionCode;
  if (!POSITION_CODES.includes(positionCode)) {
    void auditProvisioningFailure(authUser.id, email, `Unrecognised position ${positionCode}`);
    return DENIED("unknown_position");
  }

  // Organisation ancestry (org units are readable by authenticated users).
  const { data: unitRows } = await supabase
    .from("organisation_units")
    .select("id, code, name, display_name, unit_type, parent_unit_id");
  const byId = new Map<string, any>((unitRows ?? []).map((u: any) => [u.id, u]));

  const orgUnit = toRef(assignment.organisation_units);
  const ancestors: OrgUnitRef[] = [];
  let cursor = byId.get(assignment.organisation_units.id) ?? assignment.organisation_units;
  const seen = new Set<string>([orgUnit.id]);
  while (cursor?.parent_unit_id && !seen.has(cursor.parent_unit_id)) {
    seen.add(cursor.parent_unit_id);
    const parent = byId.get(cursor.parent_unit_id);
    if (!parent) break;
    ancestors.push(toRef(parent));
    cursor = parent;
  }

  const departmentRef =
    (orgUnit.unitType === "DEPARTMENT" ? orgUnit : undefined) ??
    ancestors.find((a) => a.unitType === "DEPARTMENT") ??
    ancestors[ancestors.length - 1] ??
    orgUnit;

  // Effective capabilities: position capabilities + personal grants + accepted delegations.
  const caps = new Set<string>();
  const [posCaps, grants, delegations] = await Promise.all([
    supabase
      .from("position_capabilities")
      .select("capabilities(code, is_active)")
      .eq("position_id", assignment.position_id),
    supabase
      .from("user_capability_grants")
      .select("status, effective_from, effective_to, capabilities(code, is_active)")
      .eq("user_id", authUser.id)
      .eq("status", "ACTIVE"),
    supabase
      .from("delegations")
      .select("status, effective_from, effective_to, capabilities(code, is_active)")
      .eq("delegate_user_id", authUser.id)
      .eq("status", "ACTIVE"),
  ]);

  for (const row of (posCaps.data ?? []) as any[]) {
    if (row.capabilities?.is_active) caps.add(row.capabilities.code);
  }
  for (const row of [...((grants.data ?? []) as any[]), ...((delegations.data ?? []) as any[])]) {
    const withinDates =
      row.effective_from <= today && (row.effective_to === null || row.effective_to >= today);
    if (withinDates && row.capabilities?.is_active) caps.add(row.capabilities.code);
  }

  const name = profile.full_name || profile.preferred_name || profile.corporate_email || "Colleague";

  const user: ActiveUser = {
    userId: authUser.id,
    profileId: profile.id,
    positionCode,
    positionTitle: assignment.positions.title,
    orgUnit,
    orgUnitAncestors: ancestors,
    capabilities: [...caps].sort(),
    assignmentId: assignment.id,
    effectiveFrom: assignment.effective_from,
    effectiveTo: assignment.effective_to,

    email: profile.corporate_email || email || "",
    name,
    initials: initials(name),
    roleLabel: assignment.positions.title,
    department: departmentRef.displayName,
    unit: orgUnit.displayName,
    country: (profile.country_code as CountryCode | null) ?? undefined,
    role: LEGACY_ROLE_BY_POSITION[positionCode],
  };

  return { status: "resolved", user };
}

export function hasCapability(user: ActiveUser | null, code: string) {
  return Boolean(user?.capabilities.includes(code));
}

export function hasPosition(user: ActiveUser | null, codes: readonly PositionCode[]) {
  return Boolean(user && codes.includes(user.positionCode));
}
