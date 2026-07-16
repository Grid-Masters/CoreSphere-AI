import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard } from "@/components/ui-bits/Card";
import { useRecent } from "@/lib/workspace-prefs";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/my-activity")({
  head: () => ({
    meta: [
      { title: "My Activity — UBA CoreSphere" },
      { name: "description", content: "A history of your recent activity across CoreSphere." },
    ],
  }),
  component: MyActivityPage,
});

function MyActivityPage() {
  const recent = useRecent();
  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workspace</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">My Activity</h1>
      </div>
      <PanelCard title="Recently visited">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">Your visited pages will show up here as you use CoreSphere.</p>
        ) : (
          <ul className="divide-y -my-2">
            {recent.map((r) => (
              <li key={r.path} className="py-3 flex items-center gap-3">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <Link to={r.path} className="text-sm hover:text-primary flex-1 truncate">
                  {r.label}
                </Link>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(r.visitedAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </PanelCard>
    </AppShell>
  );
}