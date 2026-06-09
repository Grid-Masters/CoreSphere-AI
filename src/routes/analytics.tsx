import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, BookOpen, Award } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, StatCard } from "@/components/ui-bits/Card";
import { qaScores } from "@/lib/mock-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — UBA CoreSphere" },
      { name: "description", content: "Operational analytics and performance insights across UBA Customer Fulfillment on CoreSphere AI." },
      { property: "og:title", content: "Analytics — UBA CoreSphere" },
      { property: "og:description", content: "Operational analytics and performance insights across UBA Customer Fulfillment on CoreSphere AI." },
      { property: "og:url", content: "https://ubacoresphere-pulse.lovable.app/analytics" },
    ],
    links: [{ rel: "canonical", href: "https://ubacoresphere-pulse.lovable.app/analytics" }],
  }),
  component: Analytics,
});

const completion = [
  { dept: "FHD", value: 92 },
  { dept: "Inbound", value: 84 },
  { dept: "Multimedia", value: 78 },
  { dept: "Social Media", value: 70 },
  { dept: "L&D", value: 96 },
  { dept: "QA", value: 88 },
];

function Analytics() {
  const max = Math.max(...qaScores.map((s) => s.score));
  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Insights</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cross-department learning, QA, and engagement insights.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active Users" value="1,284" icon={Users} tone="primary" delta="+4.1% MoM" />
        <StatCard label="SOP Coverage" value="87%" icon={BookOpen} tone="success" />
        <StatCard label="Avg QA Score" value="89%" icon={Award} tone="success" />
        <StatCard label="Engagement Index" value="74" icon={TrendingUp} tone="warning" delta="+6 vs Apr" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <PanelCard title="Department SOP Completion">
          <ul className="space-y-3">
            {completion.map((c) => (
              <li key={c.dept}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{c.dept}</span>
                  <span className="tabular-nums font-medium">{c.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${c.value}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Enterprise QA Trend">
          <div className="flex items-end gap-3 h-48">
            {qaScores.map((s) => (
              <div key={s.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-full">
                  <div
                    className="w-full rounded-t-md bg-primary/70 hover:bg-primary"
                    style={{ height: `${(s.score / max) * 100}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground">{s.month}</div>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>
    </AppShell>
  );
}