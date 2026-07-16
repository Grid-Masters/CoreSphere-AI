import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { ActivityTicker } from "./ActivityTicker";
import { OperationalStatusBanner } from "./OperationalStatusBanner";
import { CoreSphereAI } from "@/components/CoreSphereAI";
import { EnterpriseSearch } from "@/components/search/EnterpriseSearch";
import { useActiveUser } from "@/lib/active-user";
import { useAuthGate } from "@/lib/auth-gate";
import { recordRecent } from "@/lib/workspace-prefs";

const STORAGE_KEY = "coresphere.sidebar.collapsed";

export function AppShell({ children }: { children: React.ReactNode }) {
  useAuthGate();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const user = useActiveUser();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    }
  }, [collapsed]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  // Record recently-visited routes for the Favorites & Recent widget.
  useEffect(() => {
    if (!path) return;
    const label = path === "/"
      ? "Dashboard"
      : path.split("/").filter(Boolean)[0].replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    recordRecent(path, label);
  }, [path]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopBar
        onOpenMobile={() => setMobileOpen(true)}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        collapsed={collapsed}
      />
      <div className="flex flex-1 min-h-0">
        <AppSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <OperationalStatusBanner />
          <ActivityTicker />
          <main key={user.email} className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-8 max-w-[1500px] mx-auto w-full">{children}</div>
          </main>
        </div>
      </div>
      <CoreSphereAI />
      <EnterpriseSearch />
    </div>
  );
}
