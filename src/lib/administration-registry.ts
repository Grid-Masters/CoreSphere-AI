import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Read-only, database-backed registry powering the Platform Administration
 * identity/organisation modules.
 *
 * This module is a pure builder: it receives an already-authorised Supabase
 * client. The security boundary is the server function in
 * `administration.functions.ts`, which verifies the bearer-token caller and
 * their `platform.identity.manage` capability before calling in. RLS applies
 * on top of that.
 */

export type AdminSupabase = SupabaseClient<Database>;

export type AdminUserRow = {
  userId: string;
  name: string;
  email: string;
  initials: string;
  positionTitle: string | null;
  positionCode: string | null;
  orgUnit: string | null;
  assignmentId: string | null;
};

export type AdminPositionRow = {
  id: string;
  code: string;
  title: string;
  family: string;
  capabilityCount: number;
};

export type AdminOrgUnit = {
  id: string;
  code: string;
  name: string;
  displayName: string;
  unitType: string;
  parentUnitId: string | null;
  children: AdminOrgUnit[];
};

export type AdminReportingRow = {
  id: string;
  personName: string;
  personPosition: string | null;
  managerName: string | null;
  managerPosition: string | null;
};

export type AdministrationRegistry = {
  users: AdminUserRow[];
  positions: AdminPositionRow[];
  orgTree: AdminOrgUnit[];
  reporting: AdminReportingRow[];
  activeAssignments: number;
};

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export async function buildAdministrationRegistry(
  supabase: AdminSupabase,
): Promise<AdministrationRegistry> {
  const today = new Date().toISOString().slice(0, 10);

  const [profilesRes, assignmentsRes, positionsRes, posCapsRes, unitsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("user_id, full_name, preferred_name, corporate_email, profile_status, employment_status")
      .eq("profile_status", "ACTIVE")
      .eq("employment_status", "ACTIVE"),
    supabase
      .from("position_assignments")
      .select(
        "id, user_id, position_id, organisation_unit_id, reports_to_assignment_id, effective_from, effective_to, is_primary, status",
      )
      .eq("is_primary", true)
      .eq("status", "ACTIVE")
      .lte("effective_from", today),
    supabase.from("positions").select("id, code, title, position_family, is_active"),
    supabase.from("position_capabilities").select("position_id"),
    supabase
      .from("organisation_units")
      .select("id, code, name, display_name, unit_type, parent_unit_id, is_active"),
  ]);

  const firstError =
    profilesRes.error || assignmentsRes.error || positionsRes.error || posCapsRes.error || unitsRes.error;
  if (firstError) throw new Error(firstError.message);

  const units = unitsRes.data ?? [];
  const unitById = new Map(units.map((u) => [u.id, u]));
  const positionsById = new Map((positionsRes.data ?? []).map((p) => [p.id, p]));

  const currentAssignments = (assignmentsRes.data ?? []).filter(
    (a) => a.effective_to === null || a.effective_to >= today,
  );
  const assignmentByUser = new Map(currentAssignments.map((a) => [a.user_id, a]));
  const assignmentById = new Map(currentAssignments.map((a) => [a.id, a]));

  const profiles = profilesRes.data ?? [];
  const profileByUser = new Map(profiles.map((p) => [p.user_id, p]));

  const users: AdminUserRow[] = profiles
    .map((p) => {
      const name = p.full_name || p.preferred_name || p.corporate_email || "Unnamed";
      const a = assignmentByUser.get(p.user_id);
      const pos = a ? positionsById.get(a.position_id) : undefined;
      const unit = a ? unitById.get(a.organisation_unit_id) : undefined;
      return {
        userId: p.user_id,
        name,
        email: p.corporate_email ?? "",
        initials: initialsOf(name),
        positionTitle: pos?.title ?? null,
        positionCode: pos?.code ?? null,
        orgUnit: unit?.display_name ?? null,
        assignmentId: a?.id ?? null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const capCountByPosition = new Map<string, number>();
  for (const row of posCapsRes.data ?? []) {
    capCountByPosition.set(row.position_id, (capCountByPosition.get(row.position_id) ?? 0) + 1);
  }

  const positions: AdminPositionRow[] = (positionsRes.data ?? [])
    .map((p) => ({
      id: p.id,
      code: p.code,
      title: p.title,
      family: p.position_family,
      capabilityCount: capCountByPosition.get(p.id) ?? 0,
    }))
    .sort((a, b) => a.family.localeCompare(b.family) || a.title.localeCompare(b.title));

  // Organisation hierarchy
  const nodes = new Map<string, AdminOrgUnit>(
    units.map((u) => [
      u.id,
      {
        id: u.id,
        code: u.code,
        name: u.name,
        displayName: u.display_name,
        unitType: u.unit_type,
        parentUnitId: u.parent_unit_id,
        children: [],
      },
    ]),
  );
  const orgTree: AdminOrgUnit[] = [];
  for (const node of nodes.values()) {
    const parent = node.parentUnitId ? nodes.get(node.parentUnitId) : undefined;
    if (parent) parent.children.push(node);
    else orgTree.push(node);
  }
  const sortTree = (list: AdminOrgUnit[]) => {
    list.sort((a, b) => a.displayName.localeCompare(b.displayName));
    list.forEach((n) => sortTree(n.children));
  };
  sortTree(orgTree);

  const reporting: AdminReportingRow[] = currentAssignments
    .filter((a) => a.reports_to_assignment_id)
    .map((a) => {
      const mgr = a.reports_to_assignment_id ? assignmentById.get(a.reports_to_assignment_id) : undefined;
      const mgrProfile = mgr ? profileByUser.get(mgr.user_id) : undefined;
      const self = profileByUser.get(a.user_id);
      return {
        id: a.id,
        personName: self?.full_name || self?.corporate_email || "Unknown",
        personPosition: positionsById.get(a.position_id)?.title ?? null,
        managerName: mgrProfile?.full_name || mgrProfile?.corporate_email || null,
        managerPosition: mgr ? (positionsById.get(mgr.position_id)?.title ?? null) : null,
      };
    })
    .sort((a, b) => a.personName.localeCompare(b.personName));

  return { users, positions, orgTree, reporting, activeAssignments: currentAssignments.length };
}
