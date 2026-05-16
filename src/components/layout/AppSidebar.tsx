import { useEffect } from "react";
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
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

type Props = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
};

export function AppSidebar({ collapsed, mobileOpen, onCloseMobile, onToggleCollapsed }: Props) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseMobile();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, onCloseMobile]);

  const isActive = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));

  const NavBody = ({ compact, onItemClick }: { compact: boolean; onItemClick?: () => void }) => (
    <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
      {groups.map((g) => (
        <div key={g.label}>
          {!compact && (
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">
              {g.label}
            </div>
          )}
          {compact && <div className="mx-2 my-2 h-px bg-sidebar-border/60" />}
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const active = isActive(item.to);
              const Icon = item.icon;
              const link = (
                <Link
                  to={item.to}
                  onClick={onItemClick}
                  className={`flex items-center ${compact ? "justify-center px-0" : "gap-3 px-3"} py-2 mx-1 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-foreground border-l-2 border-primary"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!compact && <span>{item.label}</span>}
                </Link>
              );
              return (
                <li key={item.to}>
                  {compact ? (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    link
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const Brand = ({ compact }: { compact: boolean }) => (
    <div className={`h-16 flex items-center ${compact ? "justify-center px-0" : "gap-3 px-5"} border-b border-sidebar-border`}>
      <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center overflow-hidden shrink-0">
        <img src="/assets/uba-logo.png" alt="UBA CoreSphere" className="h-9 w-9 object-contain" width={36} height={36} />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-wide">UBA CoreSphere</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60">Workforce OS</div>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-[width] duration-200 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <Brand compact={collapsed} />
        <NavBody compact={collapsed} />
        <div className={`p-3 border-t border-sidebar-border flex ${collapsed ? "justify-center" : "items-center justify-between"} gap-2`}>
          {!collapsed && (
            <div className="flex items-center gap-2 text-[11px] text-sidebar-foreground/60">
              <ClipboardCheck className="h-3.5 w-3.5" />
              Internal Banking Use Only
            </div>
          )}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleCollapsed}
                className="h-8 w-8 rounded-md hover:bg-sidebar-accent/60 flex items-center justify-center text-sidebar-foreground/70"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{collapsed ? "Expand" : "Collapse"}</TooltipContent>
          </Tooltip>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={onCloseMobile}
          className={`absolute inset-0 bg-black/50 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-72 max-w-[85%] bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col shadow-2xl transition-transform duration-200 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-label="Navigation"
        >
          <div className="relative">
            <Brand compact={false} />
            <button
              onClick={onCloseMobile}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md hover:bg-sidebar-accent/60 flex items-center justify-center text-sidebar-foreground/70"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <NavBody compact={false} onItemClick={onCloseMobile} />
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-2 text-[11px] text-sidebar-foreground/60">
              <ClipboardCheck className="h-3.5 w-3.5" />
              Internal Banking Use Only
            </div>
          </div>
        </aside>
      </div>
    </TooltipProvider>
  );
}
