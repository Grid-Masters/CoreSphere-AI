import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  ShieldCheck,
  Building2,
  Lock,
  ScrollText,
  Bot,
  LogIn,
  Network,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Search,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, StatCard, StatusBadge } from "@/components/ui-bits/Card";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  loadAdministrationRegistry,
  type AdministrationRegistry,
  type AdminOrgUnit,
} from "@/lib/administration-registry";

export const Route = createFileRoute("/administration")({
  head: () => ({
    meta: [
      { title: "Administration Center — UBA CoreSphere" },
      { name: "description", content: "CoreSphere Administration Center for user, role, department, security and AI governance management." },
      { property: "og:title", content: "Administration Center — UBA CoreSphere" },
      { property: "og:description", content: "CoreSphere Administration Center for user, role, department, security and AI governance management." },
      { property: "og:url", content: "https://ubacoresphere-pulse.lovable.app/administration" },
    ],
    links: [{ rel: "canonical", href: "https://ubacoresphere-pulse.lovable.app/administration" }],
  }),
  component: GuardedAdministrationCenter,
});

function GuardedAdministrationCenter() {
  return (
    <RoleGuard allow={["PLATFORM_ADMINISTRATOR"]}>
      <AdministrationCenter />
    </RoleGuard>
  );
}

type ModuleId =
  | "users"
  | "roles"
  | "departments"
  | "security"
  | "audit"
  | "ai"
  | "logins"
  | "reporting"
  | "config";

const modules: { id: ModuleId; label: string; icon: any; desc: string }[] = [
  { id: "users", label: "User Management", icon: Users, desc: "Accounts, provisioning & access" },
  { id: "roles", label: "Position Management", icon: ShieldCheck, desc: "Enterprise positions & capabilities" },
  { id: "departments", label: "Organisation Management", icon: Building2, desc: "Organisation units & structure" },
  { id: "security", label: "Security Center", icon: Lock, desc: "Policies & threat posture" },
  { id: "audit", label: "Audit Center", icon: ScrollText, desc: "System & user activity trail" },
  { id: "ai", label: "AI Governance Center", icon: Bot, desc: "Model usage & guardrails" },
  { id: "logins", label: "Login Monitoring", icon: LogIn, desc: "Sessions & anomalies" },
  { id: "reporting", label: "Reporting Structure", icon: Network, desc: "Reporting lines & hierarchy" },
  { id: "config", label: "Enterprise Configuration", icon: SlidersHorizontal, desc: "Platform-wide settings" },
];

const auditTrail = [
  { who: "Daniel Obi", action: "Updated QA scorecard weighting", at: "2 min ago", tone: "info" },
  { who: "Chioma Paul", action: "Published SOP-012 — Card Dispute Flow", at: "26 min ago", tone: "info" },
  { who: "Platform", action: "Failed login threshold exceeded (m.audit@…)", at: "1 hr ago", tone: "warn" },
  { who: "Aliyu Yusuf", action: "Approved townhall broadcast", at: "3 hrs ago", tone: "info" },
  { who: "Ibrahim Sadiq", action: "Rotated platform API credentials", at: "Yesterday", tone: "info" },
];

const loginEvents = [
  { user: "a.okafor@ubagroup.com", ip: "197.210.x.x", device: "Chrome • Windows", status: "Success", at: "08:42" },
  { user: "d.obi@ubagroup.com", ip: "102.89.x.x", device: "Edge • Windows", status: "Success", at: "08:31" },
  { user: "unknown@ext.com", ip: "45.227.x.x", device: "Unknown", status: "Blocked", at: "07:58" },
  { user: "s.eze@ubagroup.com", ip: "197.210.x.x", device: "Safari • macOS", status: "Success", at: "07:44" },
];

function AdministrationCenter() {
  const [active, setActive] = useState<ModuleId>("users");
  const [query, setQuery] = useState("");
  const [registry, setRegistry] = useState<AdministrationRegistry | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadAdministrationRegistry()
      .then((data) => {
        if (!cancelled) setRegistry(data);
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setLoadError(error instanceof Error ? error.message : "Failed to load identity data");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const users = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = registry?.users ?? [];
    if (!q) return all;
    return all.filter((u) =>
      [u.name, u.email, u.positionTitle ?? "", u.orgUnit ?? ""].some((v) =>
        v.toLowerCase().includes(q),
      ),
    );
  }, [registry, query]);

  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Platform Governance
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" /> CoreSphere Administration Center
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Centralized command for users, roles, security, governance and enterprise configuration.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Profiles" value={registry?.users.length ?? "—"} icon={Users} tone="primary" />
        <StatCard label="Organisation Units" value={countUnits(registry?.orgTree ?? []) || "—"} icon={Building2} />
        <StatCard label="Positions" value={registry?.positions.length ?? "—"} icon={ShieldCheck} />
        <StatCard label="Security Alerts" value={1} icon={AlertTriangle} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-4">
        {/* Module rail */}
        <nav className="space-y-1.5">
          {modules.map((m) => {
            const Icon = m.icon;
            const on = active === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className={`w-full flex items-start gap-3 rounded-md border px-3 py-2.5 text-left transition-colors ${
                  on ? "bg-primary/10 border-primary/40" : "bg-card hover:bg-muted border-border"
                }`}
              >
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${on ? "text-primary" : "text-muted-foreground"}`} />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{m.label}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{m.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Module content */}
        <div className="min-w-0">
          {active === "users" && (
            <PanelCard title="User Management">
              <div className="relative mb-4">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, email or department…"
                  className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
              <ModuleState
                error={loadError}
                loading={!registry}
                empty={users.length === 0}
                emptyLabel="No active profiles match this search."
              >
                <div className="text-[11px] text-muted-foreground mb-2">
                  {registry?.users.length} active profiles • {registry?.activeAssignments} current primary
                  assignments
                </div>
                <div className="divide-y -my-2">
                  {users.map((u) => (
                    <div key={u.userId} className="py-3 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold shrink-0">
                        {u.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{u.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {u.positionTitle ?? "No active assignment"}
                          {u.positionCode ? ` (${u.positionCode})` : ""} • {u.orgUnit ?? "Unassigned"} •{" "}
                          {u.email}
                        </div>
                      </div>
                      <StatusBadge status={u.assignmentId ? "On Duty" : "Failed"} />
                    </div>
                  ))}
                </div>
              </ModuleState>
            </PanelCard>
          )}

          {active === "roles" && (
            <PanelCard title="Position Management">
              <ModuleState
                error={loadError}
                loading={!registry}
                empty={(registry?.positions.length ?? 0) === 0}
                emptyLabel="No positions are configured."
              >
                <div className="grid sm:grid-cols-2 gap-3">
                  {registry?.positions.map((p) => (
                    <div key={p.id} className="rounded-md border bg-card p-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <div className="text-sm font-medium">{p.title}</div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="text-[11px] px-1.5 py-0.5 rounded border bg-background font-mono">
                          {p.code}
                        </span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded border bg-background">
                          {p.family}
                        </span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded border bg-background">
                          {p.capabilityCount} capabilities
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ModuleState>
            </PanelCard>
          )}

          {active === "departments" && (
            <PanelCard title="Organisation Management">
              <ModuleState
                error={loadError}
                loading={!registry}
                empty={(registry?.orgTree.length ?? 0) === 0}
                emptyLabel="No organisation units are configured."
              >
                <ul className="space-y-2">
                  {registry?.orgTree.map((u) => (
                    <OrgNode key={u.id} node={u} depth={0} />
                  ))}
                </ul>
              </ModuleState>
            </PanelCard>
          )}

          {active === "security" && (
            <PanelCard title="Security Center">
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { k: "MFA Enforcement", v: "Enabled for all roles", ok: true },
                  { k: "Password Policy", v: "12+ chars, 90-day rotation", ok: true },
                  { k: "Session Timeout", v: "15 minutes idle", ok: true },
                  { k: "Threat Posture", v: "1 blocked intrusion today", ok: false },
                  { k: "Data Encryption", v: "At rest & in transit", ok: true },
                  { k: "Access Reviews", v: "Quarterly — due in 12 days", ok: true },
                ].map((s) => (
                  <div key={s.k} className="rounded-md border bg-card p-3 flex items-start gap-2">
                    {s.ok ? (
                      <CheckCircle2 className="h-4 w-4 text-[color:var(--success)] mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-[color:var(--warning)] mt-0.5" />
                    )}
                    <div>
                      <div className="text-sm font-medium">{s.k}</div>
                      <div className="text-[11px] text-muted-foreground">{s.v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </PanelCard>
          )}

          {active === "audit" && (
            <PanelCard title="Audit Center">
              <ul className="divide-y -my-2">
                {auditTrail.map((a, i) => (
                  <li key={i} className="py-3 flex items-center gap-3">
                    <ScrollText
                      className={`h-4 w-4 shrink-0 ${a.tone === "warn" ? "text-[color:var(--warning)]" : "text-muted-foreground"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">
                        <span className="font-medium">{a.who}</span> — {a.action}
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0">{a.at}</span>
                  </li>
                ))}
              </ul>
            </PanelCard>
          )}

          {active === "ai" && (
            <PanelCard title="AI Governance Center">
              <div className="grid sm:grid-cols-3 gap-3 mb-4">
                <StatCard label="AI Queries (30d)" value="4,820" icon={Bot} tone="primary" />
                <StatCard label="Guardrail Blocks" value="37" icon={ShieldCheck} />
                <StatCard label="Avg Response" value="1.4s" icon={Bot} />
              </div>
              <ul className="space-y-2 text-sm">
                {[
                  "Responses grounded in approved SOP & policy corpus only.",
                  "PII redaction enforced on all prompts and logs.",
                  "Human-in-the-loop required for customer-facing drafts.",
                  "Model usage audited and attributed per department.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[color:var(--success)] mt-0.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </PanelCard>
          )}

          {active === "logins" && (
            <PanelCard title="Login Monitoring">
              <div className="divide-y -my-2">
                {loginEvents.map((l, i) => (
                  <div key={i} className="py-3 flex items-center gap-3">
                    <LogIn className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{l.user}</div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {l.device} • {l.ip} • {l.at}
                      </div>
                    </div>
                    <StatusBadge status={l.status === "Success" ? "On Duty" : "Failed"} />
                  </div>
                ))}
              </div>
            </PanelCard>
          )}

          {active === "reporting" && (
            <PanelCard title="Reporting Structure Management">
              <ModuleState
                error={loadError}
                loading={!registry}
                empty={(registry?.reporting.length ?? 0) === 0}
                emptyLabel="Reporting lines are not configured yet. No reports-to relationships exist on current primary assignments."
              >
                <ul className="space-y-2">
                  {registry?.reporting.map((r) => (
                    <li
                      key={r.id}
                      className="flex flex-wrap items-center gap-2 text-sm rounded-md border bg-card px-3 py-2"
                    >
                      <span className="font-medium">{r.personName}</span>
                      <span className="text-[11px] text-muted-foreground">{r.personPosition}</span>
                      <Network className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">reports to</span>
                      <span className="font-medium">{r.managerName ?? "—"}</span>
                      <span className="text-[11px] text-muted-foreground">{r.managerPosition}</span>
                    </li>
                  ))}
                </ul>
              </ModuleState>
            </PanelCard>
          )}

          {active === "config" && (
            <PanelCard title="Enterprise Configuration">
              <div className="space-y-3">
                {[
                  { k: "Organization", v: "United Bank for Africa" },
                  { k: "Default Timezone", v: "West Africa Time (WAT)" },
                  { k: "Branding", v: "UBA Enterprise Theme" },
                  { k: "Data Retention", v: "7 years (regulatory)" },
                  { k: "Maintenance Window", v: "Sundays 01:00–03:00 WAT" },
                ].map((c) => (
                  <div key={c.k} className="flex items-center justify-between rounded-md border bg-card px-3 py-2.5">
                    <div className="text-sm font-medium">{c.k}</div>
                    <div className="text-sm text-muted-foreground">{c.v}</div>
                  </div>
                ))}
              </div>
            </PanelCard>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function countUnits(nodes: AdminOrgUnit[]): number {
  return nodes.reduce((sum, n) => sum + 1 + countUnits(n.children), 0);
}

function OrgNode({ node, depth }: { node: AdminOrgUnit; depth: number }) {
  return (
    <li>
      <div
        className="rounded-md border bg-card p-3"
        style={{ marginLeft: depth * 16 }}
      >
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="text-sm font-medium">{node.displayName}</div>
          <span className="text-[11px] px-1.5 py-0.5 rounded border bg-background font-mono">
            {node.code}
          </span>
          <span className="text-[11px] text-muted-foreground">{node.unitType}</span>
        </div>
      </div>
      {node.children.length > 0 && (
        <ul className="space-y-2 mt-2">
          {node.children.map((c) => (
            <OrgNode key={c.id} node={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function ModuleState({
  loading,
  error,
  empty,
  emptyLabel,
  children,
}: {
  loading: boolean;
  error: string | null;
  empty: boolean;
  emptyLabel: string;
  children: React.ReactNode;
}) {
  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
        <div>
          <div className="font-medium">Unable to load identity data</div>
          <div className="text-[11px] text-muted-foreground">{error}</div>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="space-y-2" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-12 rounded-md border bg-muted/40 animate-pulse" />
        ))}
      </div>
    );
  }
  if (empty) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }
  return <>{children}</>;
}
