import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useActiveUser, type ActiveUser } from "@/lib/active-user";
import type { PositionCode } from "@/lib/identity";
import {
  StaffDashboard,
  QADashboard,
  LDDashboard,
  TeamLeadDashboard,
  GroupHeadDashboard,
} from "@/components/dashboards/RoleDashboards";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Dashboard — UBA CoreSphere" },
      { name: "description", content: "Your CoreSphere operational dashboard — daily missions, readiness, SOP progress and performance intelligence for UBA." },
      { property: "og:title", content: "Dashboard — UBA CoreSphere" },
      { property: "og:description", content: "Your CoreSphere operational dashboard — daily missions, readiness, SOP progress and performance intelligence for UBA." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const user = useActiveUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.positionCode === "PLATFORM_ADMINISTRATOR") {
      navigate({ to: "/administration", replace: true });
    }
  }, [user?.positionCode, navigate]);
  if (!user) return <AppShell>{null}</AppShell>;
  return <DashboardBody user={user} />;
}

// Dashboard surface is selected from the database position code — never from
// an email pattern or a static directory record.
const CEE_POSITIONS: PositionCode[] = ["CEE", "DELEGATED_APPROVER"];
const QA_POSITIONS: PositionCode[] = ["QA_OFFICER", "QA_TEAM_LEAD", "QA_UNIT_HEAD"];
const LD_POSITIONS: PositionCode[] = ["LD_OFFICER", "LD_TEAM_LEAD", "LD_UNIT_HEAD"];
const LEAD_POSITIONS: PositionCode[] = ["TEAM_LEAD", "UNIT_HEAD"];
const EXEC_POSITIONS: PositionCode[] = ["GROUP_HEAD", "HEAD_CFC_OPERATIONS"];

function DashboardBody({ user }: { user: ActiveUser }) {
  const position = user.positionCode;
  return (
    <AppShell>
      {CEE_POSITIONS.includes(position) && <StaffDashboard user={user} />}
      {QA_POSITIONS.includes(position) && <QADashboard user={user} />}
      {LD_POSITIONS.includes(position) && <LDDashboard user={user} />}
      {LEAD_POSITIONS.includes(position) && <TeamLeadDashboard user={user} />}
      {EXEC_POSITIONS.includes(position) && <GroupHeadDashboard user={user} />}
    </AppShell>
  );
}
