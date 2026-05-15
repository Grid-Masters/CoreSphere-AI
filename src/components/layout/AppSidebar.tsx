import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Award,
  Megaphone,
  StickyNote,
  Video,
  Bell,
  BarChart3,
  Settings,
  ShieldCheck,
  MessagesSquare,
  GraduationCap,
} from "lucide-react";
const groups: { label: string; items: { to: string; icon: any; label: string }[] }[] = [
  {
    label: "Operations",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/knowledge-hub", icon: BookOpen, label: "Knowledge Hub" },
      { to: "/assessments", icon: GraduationCap, label: "Assessments" },
    ],
  },
  {
    label: "Performance",
    items: [
      { to: "/score-buddy", icon: Award, label: "Score Buddy" },
      { to: "/qa-coaching", icon: MessagesSquare, label: "QA Coaching Hub" },
    ],
  },
  {
    label: "Communication",
    items: [
      { to: "/leadership", icon: Megaphone, label: "Leadership Board" },
      { to: "/memos", icon: StickyNote, label: "Operations Memos" },
      { to: "/townhall", icon: Video, label: "Townhall Hub" },
      { to: "/notifications", icon: Bell, label: "Notifications" },
    ],
  },
  {
    label: "Administration",
    items: [
      { to: "/analytics", icon: BarChart3, label: "Analytics" },
      { to: "/admin", icon: ShieldCheck, label: "Admin Panel" },
      { to: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center overflow-hidden">
          <img src="/assets/uba-logo.png" alt="UBA CoreSphere" className="h-9 w-9 object-contain" width={36} height={36} />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-wide">UBA CoreSphere</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60">Workforce OS</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">
              {g.label}
            </div>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        active
                          ? "bg-sidebar-accent text-sidebar-foreground border-l-2 border-primary"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-[11px] text-sidebar-foreground/60">
          <ClipboardCheck className="h-3.5 w-3.5" />
          Internal Banking Use Only
        </div>
      </div>
    </aside>
  );
}