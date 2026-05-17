import { Bell, Search, HelpCircle, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { RoleSwitcher } from "@/components/RoleSwitcher";

type Props = {
  onOpenMobile: () => void;
  onToggleCollapsed: () => void;
  collapsed: boolean;
};

export function TopBar({ onOpenMobile, onToggleCollapsed, collapsed }: Props) {
  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-3 lg:px-6 flex items-center gap-2 lg:gap-4">
      <button
        onClick={onOpenMobile}
        className="lg:hidden h-10 w-10 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <button
        onClick={onToggleCollapsed}
        className="hidden lg:flex h-10 w-10 rounded-md hover:bg-muted items-center justify-center text-muted-foreground"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </button>
      <div className="flex-1 max-w-xl relative">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search SOPs, policies, memos, people…"
          className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="hidden sm:flex h-10 w-10 rounded-md hover:bg-muted items-center justify-center text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
        </button>
        <button className="h-10 w-10 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
        </button>
        <div className="pl-2 ml-1 border-l">
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
}
