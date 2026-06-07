import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
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
  const navigate = useNavigate();
  useEffect(() => {
    if (user.role === "sysadmin") navigate({ to: "/administration", replace: true });
  }, [user.role, navigate]);
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
