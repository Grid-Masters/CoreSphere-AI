import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardList,
  Award,
  Users,
  Sparkles,
  MessagesSquare,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { PanelCard } from "@/components/ui-bits/Card";
import { useResolvedUser } from "@/components/identity/IdentityProvider";
import { useRecent } from "@/lib/workspace-prefs";
import type { Role } from "@/lib/directory";

type Action = {
  to: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Role[];
};

const BASE: Action[] = [
  { to: "/knowledge-hub", label: "View Latest SOP", hint: "Enterprise Knowledge Hub", icon: BookOpen },
  { to: "/assessments", label: "Resume Assessment", hint: "Monthly cycle", icon: ClipboardList },
  { to: "/performance-intelligence", label: "Open Monthly Scorecard", hint: "Your latest QA snapshot", icon: Award },
  { to: "/qa-coaching", label: "Continue Coaching", hint: "Latest coaching thread", icon: MessagesSquare, roles: ["staff", "qa", "team_lead", "group_head", "ld"] },
  { to: "/scenarios", label: "Practice a Scenario", hint: "AI-guided simulation", icon: Sparkles },
  { to: "/analytics", label: "Team Dashboard", hint: "Team performance", icon: Users, roles: ["qa", "ld", "team_lead", "group_head"] },
  { to: "/admin", label: "Review Pending Approvals", hint: "Maker-Checker queue", icon: ShieldCheck, roles: ["ld", "group_head"] },
  { to: "/knowledge-hub", label: "Continue Last Learning", hint: "Where you left off", icon: GraduationCap },
];

/**
 * BF-001B §7 Smart Quick Actions — role-aware shortcuts, biased toward the
 * user's recent activity when available.
 */
export function SmartQuickActions() {
  const user = useResolvedUser();
  const recent = useRecent();

  const allowed = BASE.filter((a) => !a.roles || a.roles.includes(user.role));
  const recentPaths = new Set(recent.map((r) => r.path));
  const prioritized = [
    ...allowed.filter((a) => recentPaths.has(a.to)),
    ...allowed.filter((a) => !recentPaths.has(a.to)),
  ].slice(0, 6);

  return (
    <PanelCard title="Smart Quick Actions" description="Role- and activity-aware shortcuts">
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {prioritized.map((a) => {
          const Icon = a.icon;
          return (
            <li key={`${a.to}-${a.label}`}>
              <Link
                to={a.to}
                className="group flex flex-col gap-1 rounded-md border bg-card p-3 hover:border-primary/40 hover:bg-muted/40 transition-colors h-full"
              >
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-md bg-primary/10 text-primary grid place-items-center shrink-0">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-medium truncate">{a.label}</span>
                </div>
                <span className="text-[11px] text-muted-foreground line-clamp-1">{a.hint}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </PanelCard>
  );
}