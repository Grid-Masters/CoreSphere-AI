import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { directory, roleLabels, type Role } from "@/lib/directory";
import { departments } from "@/lib/mock-data";
import { RoleGuard } from "@/components/auth/RoleGuard";

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
    <RoleGuard allow={["sysadmin"]}>
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
  { id: "roles", label: "Role Management", icon: ShieldCheck, desc: "Roles & permission sets" },
  { id: "departments", label: "Department Management", icon: Building2, desc: "Org units & structure" },
  { id: "security", label: "Security Center", icon: Lock, desc: "Policies & threat posture" },
  { id: "audit", label: "Audit Center", icon: ScrollText, desc: "System & user activity trail" },
  { id: "ai", label: "AI Governance Center", icon: Bot, desc: "Model usage & guardrails" },
  { id: "logins", label: "Login Monitoring", icon: LogIn, desc: "Sessions & anomalies" },
  { id: "reporting", label: "Reporting Structure", icon: Network, desc: "Reporting lines & hierarchy" },
  { id: "config", label: "Enterprise Configuration", icon: SlidersHorizontal, desc: "Platform-wide settings" },
];

const ROLE_ORDER: Role[] = ["staff", "qa", "ld", "team_lead", "group_head", "sysadmin"];

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

const permissionMatrix: Record<Role, string[]> = {
  staff: ["Knowledge Hub", "Assessments", "Memos", "AI Assistant"],
  qa: ["QA Coaching", "Scorecards", "Analytics", "Knowledge Hub"],
  ld: ["Content Authoring", "Approvals", "Analytics", "Assessments"],
  team_lead: ["Team Oversight", "Acknowledgements", "Analytics", "Memos"],
  group_head: ["Executive Command", "All Analytics", "Broadcasts", "Approvals"],
  sysadmin: ["Full Platform Control", "User & Role Mgmt", "Security & Audit", "Configuration"],
};

function AdministrationCenter() {
  const [active, setActive] = useState<ModuleId>("users");
  const [query, setQuery] = useState("");

  const users = directory.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.email.toLowerCase().includes(query.toLowerCase()) ||
      d.department.toLowerCase().includes(query.toLowerCase()),
  );

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
        <StatCard label="Active Users" value={directory.length} icon={Users} tone="primary" />
        <StatCard label="Departments" value={departments.length} icon={Building2} />
        <StatCard label="Roles" value={ROLE_ORDER.length} icon={ShieldCheck} />
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
              <div className="divide-y -my-2">
                {users.map((u) => (
                  <div key={u.email} className="py-3 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold shrink-0">
                      {u.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{u.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {roleLabels[u.role]} • {u.department} • {u.email}
                      </div>
                    </div>
                    <StatusBadge status="On Duty" />
                  </div>
                ))}
              </div>
            </PanelCard>
          )}

          {active === "roles" && (
            <PanelCard title="Role Management">
              <div className="grid sm:grid-cols-2 gap-3">
                {ROLE_ORDER.map((r) => (
                  <div key={r} className="rounded-md border bg-card p-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <div className="text-sm font-medium">{roleLabels[r]}</div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {permissionMatrix[r].map((p) => (
                        <span key={p} className="text-[11px] px-1.5 py-0.5 rounded border bg-background">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </PanelCard>
          )}

          {active === "departments" && (
            <PanelCard title="Department Management">
              <ul className="space-y-3">
                {departments.map((d) => (
                  <li key={d.name} className="rounded-md border bg-card p-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm font-medium">{d.name}</div>
                    </div>
                    {d.units.length > 0 && (
                      <div className="text-[11px] text-muted-foreground mt-1">{d.units.join(" • ")}</div>
                    )}
                  </li>
                ))}
              </ul>
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
              <ul className="space-y-2">
                {directory
                  .filter((d) => d.reportsTo)
                  .map((d) => {
                    const mgr = directory.find((m) => m.email === d.reportsTo);
                    return (
                      <li key={d.email} className="flex items-center gap-2 text-sm rounded-md border bg-card px-3 py-2">
                        <span className="font-medium">{d.name}</span>
                        <Network className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">reports to</span>
                        <span className="font-medium">{mgr?.name ?? "—"}</span>
                      </li>
                    );
                  })}
              </ul>
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
