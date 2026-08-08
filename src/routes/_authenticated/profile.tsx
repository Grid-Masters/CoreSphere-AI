import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard } from "@/components/ui-bits/Card";
import { useActiveUser, type ActiveUser } from "@/lib/active-user";
import { User, Mail, Building2, Users, Briefcase, Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "My Profile — UBA CoreSphere" },
      { name: "description", content: "Your CoreSphere profile: name, role, department, team and reporting line." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const user = useActiveUser();
  if (!user) return <AppShell>{null}</AppShell>;
  return <ProfilePageBody user={user} />;
}

function ProfilePageBody({ user }: { user: ActiveUser }) {
  const hierarchy = [...user.orgUnitAncestors]
    .reverse()
    .map((u) => u.displayName)
    .concat(user.orgUnit.displayName)
    .join(" › ");
  const items = [
    { icon: User, label: "Full name", value: user.name },
    { icon: Mail, label: "Enterprise email", value: user.email },
    { icon: Briefcase, label: "Position", value: `${user.positionTitle} (${user.positionCode})` },
    { icon: Building2, label: "Department", value: user.department },
    { icon: Users, label: "Organisation unit", value: user.orgUnit.displayName },
    { icon: Shield, label: "Reporting hierarchy", value: hierarchy },
  ];
  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">My Profile</h1>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <PanelCard title="Identity">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              {user.initials}
            </div>
            <div>
              <div className="text-base font-semibold">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.roleLabel}</div>
            </div>
          </div>
          <dl className="divide-y">
            {items.map(({ icon: Icon, label, value }) => (
              <div key={label} className="py-2.5 flex items-start gap-3">
                <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
                  <dd className="text-sm truncate">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </PanelCard>
        <PanelCard title="Governance" description="Role management is centrally administered">
          <p className="text-sm text-muted-foreground">
            Role, permissions and reporting lines are administered by Platform Governance
            through the Administration Center. Reach out to your Team Lead for changes.
          </p>
        </PanelCard>
      </div>
    </AppShell>
  );
}