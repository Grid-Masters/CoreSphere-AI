import { Bell, Search, Menu, PanelLeftClose, PanelLeftOpen, Sparkles, ListChecks, LogOut, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UbaLogo } from "@/components/brand/UbaLogo";
import { OPEN_SEARCH_EVENT } from "@/components/search/EnterpriseSearch";
import { OPEN_AI_EVENT } from "@/components/CoreSphereAI";
import { useActiveUser } from "@/lib/active-user";
import { clearAuth } from "@/lib/auth-gate";

function fire(name: string) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(name));
}

type Props = {
  onOpenMobile: () => void;
  onToggleCollapsed: () => void;
  collapsed: boolean;
};

function IconButton({
  label,
  onClick,
  badge,
  children,
}: {
  label: string;
  onClick?: () => void;
  badge?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="relative h-10 w-10 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
    >
      {children}
      {badge && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />}
    </button>
  );
}

export function TopBar({ onOpenMobile, onToggleCollapsed, collapsed }: Props) {
  const user = useActiveUser();
  const navigate = useNavigate();

  const signOut = () => {
    clearAuth();
    navigate({ to: "/login", replace: true });
  };

  return (
    <header className="h-16 w-full border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-3 lg:px-6 flex items-center gap-3">
      {/* Left: brand + sidebar controls */}
      <button
        onClick={onOpenMobile}
        className="lg:hidden h-10 w-10 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Link to="/" className="flex items-center gap-2.5 shrink-0">
        <UbaLogo variant="mark" size={32} />
        <div className="hidden md:block leading-tight">
          <div className="text-sm font-semibold tracking-wide">CoreSphere AI</div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Operations Intelligence
          </div>
        </div>
      </Link>
      <button
        onClick={onToggleCollapsed}
        className="hidden lg:flex h-10 w-10 rounded-md hover:bg-muted items-center justify-center text-muted-foreground"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </button>

      <div className="flex-1" />

      {/* Right: enterprise control cluster */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => fire(OPEN_SEARCH_EVENT)}
          className="hidden md:flex h-10 w-64 px-3 rounded-md border border-input bg-background text-sm text-muted-foreground items-center gap-2 hover:border-primary/40 transition-colors"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate">Search SOPs, policies, memos…</span>
          <kbd className="ml-auto hidden lg:inline-flex items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
            ⌘K
          </kbd>
        </button>
        <IconButton label="Search" onClick={() => fire(OPEN_SEARCH_EVENT)}>
          <span className="md:hidden"><Search className="h-4 w-4" /></span>
        </IconButton>

        <IconButton label="CoreSphere AI" onClick={() => fire(OPEN_AI_EVENT)}>
          <Sparkles className="h-4 w-4 text-primary" />
        </IconButton>

        <Link to="/">
          <IconButton label="My tasks" badge>
            <ListChecks className="h-4 w-4" />
          </IconButton>
        </Link>

        <Link to="/notifications">
          <IconButton label="Notifications" badge>
            <Bell className="h-4 w-4" />
          </IconButton>
        </Link>

        <div className="pl-2 ml-1 border-l">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 sm:gap-3 h-11 pl-2 sm:pl-3 pr-2 rounded-md hover:bg-muted transition-colors">
                <div className="hidden sm:block text-right leading-tight">
                  <div className="text-sm font-medium truncate max-w-[180px]">{user.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                    {user.roleLabel} • {user.department}
                  </div>
                </div>
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                  {user.initials}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="leading-tight">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-[11px] text-muted-foreground font-normal">{user.roleLabel}</div>
                <div className="text-[11px] text-muted-foreground font-normal">{user.department} • {user.unit}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={signOut} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
