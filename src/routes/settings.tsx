import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard } from "@/components/ui-bits/Card";
import { currentUser } from "@/lib/mock-data";
import { Bell, Lock, User, Monitor } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — UBA CoreSphere" }] }),
  component: Settings,
});

function Settings() {
  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Settings</h1>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <PanelCard title="Profile" action={<User className="h-4 w-4 text-muted-foreground" />}>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              {currentUser.initials}
            </div>
            <div>
              <div className="text-sm font-medium">{currentUser.name}</div>
              <div className="text-xs text-muted-foreground">{currentUser.email}</div>
              <div className="text-xs text-muted-foreground">
                {currentUser.role} • {currentUser.department}
              </div>
            </div>
          </div>
        </PanelCard>
        <PanelCard title="Notifications" action={<Bell className="h-4 w-4 text-muted-foreground" />}>
          <ul className="text-sm divide-y -my-2">
            {["Leadership announcements", "QA scorecards", "SOP updates", "Coaching messages"].map((l) => (
              <li key={l} className="flex items-center justify-between py-3">
                <span>{l}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[color:var(--primary)]" />
              </li>
            ))}
          </ul>
        </PanelCard>
        <PanelCard title="Security" action={<Lock className="h-4 w-4 text-muted-foreground" />}>
          <ul className="text-sm space-y-3">
            <li className="flex items-center justify-between"><span>Two-factor authentication</span><span className="text-[color:var(--success)] text-xs">Enabled</span></li>
            <li className="flex items-center justify-between"><span>Active sessions</span><span className="text-xs text-muted-foreground">2 devices</span></li>
            <li className="flex items-center justify-between"><span>Password</span><button className="text-xs text-primary">Change</button></li>
          </ul>
        </PanelCard>
        <PanelCard title="Display" action={<Monitor className="h-4 w-4 text-muted-foreground" />}>
          <div className="text-sm space-y-3">
            <div className="flex items-center justify-between">
              <span>Theme</span>
              <div className="flex gap-2">
                <button className="h-8 px-3 rounded-md border bg-card text-xs">Light</button>
                <button className="h-8 px-3 rounded-md border bg-card text-xs">Dark</button>
                <button className="h-8 px-3 rounded-md border bg-primary text-primary-foreground text-xs">Auto</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Density</span>
              <span className="text-xs text-muted-foreground">Comfortable</span>
            </div>
          </div>
        </PanelCard>
      </div>
    </AppShell>
  );
}