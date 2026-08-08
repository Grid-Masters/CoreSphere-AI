import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, StatCard, StatusBadge } from "@/components/ui-bits/Card";
import { Users, ShieldCheck, FileCheck2, Building2, CheckCircle2, XCircle } from "lucide-react";
import { departments } from "@/lib/mock-data";
import { RoleGuard } from "@/components/auth/RoleGuard";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Admin Panel — UBA CoreSphere" },
      { name: "description", content: "CoreSphere admin panel for reviewing SOP updates, approvals and operational governance tasks." },
      { property: "og:title", content: "Admin Panel — UBA CoreSphere" },
      { property: "og:description", content: "CoreSphere admin panel for reviewing SOP updates, approvals and operational governance tasks." },
    ],
  }),
  component: GuardedAdmin,
});

function GuardedAdmin() {
  return (
    <RoleGuard allow={["LD_TEAM_LEAD", "LD_UNIT_HEAD", "HEAD_CFC_OPERATIONS", "GROUP_HEAD"]}>
      <Admin />
    </RoleGuard>
  );
}

const pendingApprovals = [
  { id: 1, title: "SOP-005 — Live Chat Escalation Matrix", submittedBy: "L&D Staff: O. Akande", type: "SOP Update" },
  { id: 2, title: "Q2 Compliance Assessment", submittedBy: "L&D Staff: T. Ojo", type: "Assessment" },
  { id: 3, title: "Block Card Decision Tree v2", submittedBy: "L&D Staff: M. Yakubu", type: "Policy" },
];

function Admin() {
  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Administration</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage users, roles, departments, and approvals across CoreSphere.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active Users" value="1,284" icon={Users} tone="primary" />
        <StatCard label="Departments" value={departments.length} icon={Building2} />
        <StatCard label="Roles" value={10} icon={ShieldCheck} />
        <StatCard label="Pending Approvals" value={pendingApprovals.length} icon={FileCheck2} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <PanelCard className="lg:col-span-2" title="L&D Approval Queue">
          <ul className="divide-y -my-2">
            {pendingApprovals.map((p) => (
              <li key={p.id} className="py-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.title}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {p.type} • {p.submittedBy}
                  </div>
                </div>
                <StatusBadge status="Pending Approval" />
                <div className="flex gap-1">
                  <button className="h-8 w-8 rounded-md border bg-card hover:bg-[color:var(--success)]/10 text-[color:var(--success)] flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button className="h-8 w-8 rounded-md border bg-card hover:bg-destructive/10 text-destructive flex items-center justify-center">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Department Structure">
          <ul className="space-y-3 text-sm">
            {departments.map((d) => (
              <li key={d.name}>
                <div className="font-medium">{d.name}</div>
                {d.units.length > 0 && (
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {d.units.join(" • ")}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>
    </AppShell>
  );
}