import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { useActiveUser } from "@/lib/active-user";
import {
  StaffDashboard,
  QADashboard,
  LDDashboard,
  TeamLeadDashboard,
  GroupHeadDashboard,
} from "@/components/dashboards/RoleDashboards";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — UBA CoreSphere" }] }),
  component: Dashboard,
});

function Dashboard() {
  const user = useActiveUser();
  return (
    <AppShell>
      {user.role === "staff" && <StaffDashboard user={user} />}
      {user.role === "qa" && <QADashboard user={user} />}
      {user.role === "ld" && <LDDashboard user={user} />}
      {user.role === "team_lead" && <TeamLeadDashboard user={user} />}
      {user.role === "group_head" && <GroupHeadDashboard user={user} />}
    </AppShell>
  );
}
