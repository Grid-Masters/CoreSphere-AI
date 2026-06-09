import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard } from "@/components/ui-bits/Card";
import { Bell, Lock, User, Monitor, ShieldCheck } from "lucide-react";
import { useTheme, type ThemeMode } from "@/lib/theme";
import { useActiveUser } from "@/lib/active-user";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — UBA CoreSphere" },
      { name: "description", content: "Manage your CoreSphere profile, preferences and account settings." },
      { property: "og:title", content: "Settings — UBA CoreSphere" },
      { property: "og:description", content: "Manage your CoreSphere profile, preferences and account settings." },
      { property: "og:url", content: "https://ubacoresphere-pulse.lovable.app/settings" },
    ],
    links: [{ rel: "canonical", href: "https://ubacoresphere-pulse.lovable.app/settings" }],
  }),
  component: Settings,
});

function Settings() {
  const user = useActiveUser();
  const [theme, setTheme] = useTheme();
  const isGroupHead = user.role === "group_head";
  const lockedNotifs = ["Leadership announcements", "Compliance alerts", "Mandatory enterprise notifications"];
  const editableNotifs = ["QA scorecards", "SOP updates", "Coaching messages"];
  const themes: { id: ThemeMode; label: string }[] = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
    { id: "auto", label: "Auto" },
  ];
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
              {user.initials}
            </div>
            <div>
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
              <div className="text-xs text-muted-foreground">{user.roleLabel}</div>
              <div className="text-xs text-muted-foreground">{user.department} • {user.unit}</div>
            </div>
          </div>
        </PanelCard>
        <PanelCard title="Notifications" action={<Bell className="h-4 w-4 text-muted-foreground" />}>
          <ul className="text-sm divide-y -my-2">
            {lockedNotifs.map((l) => (
              <li key={l} className="flex items-center justify-between py-3">
                <span className="inline-flex items-center gap-2">
                  {l}
                  {!isGroupHead && (
                    <Lock className="h-3 w-3 text-muted-foreground" aria-label="Managed by Group Head" />
                  )}
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  disabled={!isGroupHead}
                  className="h-4 w-4 accent-[color:var(--primary)] disabled:opacity-40"
                />
              </li>
            ))}
            {editableNotifs.map((l) => (
              <li key={l} className="flex items-center justify-between py-3">
                <span>{l}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[color:var(--primary)]" />
              </li>
            ))}
          </ul>
          {!isGroupHead && (
            <p className="mt-3 text-[11px] text-muted-foreground">
              Critical operational notices are managed by the Group Head per UBA InfoSec policy.
            </p>
          )}
        </PanelCard>
        <PanelCard title="Security" action={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}>
          <ul className="text-sm space-y-3">
            <li className="flex items-center justify-between"><span>Two-factor authentication</span><span className="text-[color:var(--success)] text-xs">Enabled</span></li>
            <li className="flex items-center justify-between"><span>Active sessions</span><span className="text-xs text-muted-foreground">2 devices</span></li>
          </ul>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Authentication is managed via your UBA enterprise email credentials. Password changes are handled by IT Identity.
          </p>
        </PanelCard>
        <PanelCard title="Display" action={<Monitor className="h-4 w-4 text-muted-foreground" />}>
          <div className="text-sm space-y-3">
            <div className="flex items-center justify-between">
              <span>Theme</span>
              <div className="flex gap-2">
                {themes.map((t) => {
                  const active = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`h-8 px-3 rounded-md border text-xs transition-colors ${
                        active ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Density</span>
              <span className="text-xs text-muted-foreground">Comfortable</span>
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">
              Your theme preference is remembered across sessions and applied platform-wide.
            </p>
          </div>
        </PanelCard>
      </div>
    </AppShell>
  );
}