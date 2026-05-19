import { createFileRoute } from "@tanstack/react-router";
import { Award, TrendingUp, ThumbsUp, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, StatCard } from "@/components/ui-bits/Card";
import { qaScores } from "@/lib/mock-data";

export const Route = createFileRoute("/performance-intelligence")({
  head: () => ({ meta: [{ title: "Performance Intelligence — UBA CoreSphere" }] }),
  component: PerformanceIntelligence,
});

const recent = [
  { id: 1, period: "May 2026", score: 94, evaluator: "Ngozi Umeh", status: "Acknowledged" },
  { id: 2, period: "April 2026", score: 91, evaluator: "Femi Adebayo", status: "Pending" },
  { id: 3, period: "March 2026", score: 88, evaluator: "Ngozi Umeh", status: "Acknowledged" },
  { id: 4, period: "February 2026", score: 85, evaluator: "Aisha Bello", status: "Acknowledged" },
];

function PerformanceIntelligence() {
  const max = Math.max(...qaScores.map((s) => s.score));
  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-primary" /> AI-Powered • Monthly Performance Intelligence
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Performance Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enterprise performance insights — monthly scorecards, trends, and AI-assisted coaching notes.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Current Score" value="93%" icon={Award} tone="primary" delta="+2 vs last" />
        <StatCard label="6-Month Avg" value="87%" icon={TrendingUp} tone="success" />
        <StatCard label="Strengths" value={4} icon={ThumbsUp} tone="success" />
        <StatCard label="Focus Areas" value={2} icon={AlertCircle} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <PanelCard className="lg:col-span-2" title="Monthly Trend">
          <div className="flex items-end gap-3 h-48">
            {qaScores.map((s) => (
              <div key={s.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-full">
                  <div
                    className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-colors relative"
                    style={{ height: `${(s.score / max) * 100}%` }}
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] tabular-nums text-muted-foreground">
                      {s.score}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-muted-foreground">{s.month}</div>
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard title="Coaching Notes">
          <ul className="space-y-3 text-sm">
            <li className="p-3 rounded-md border-l-2 border-[color:var(--success)] bg-muted/40">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Strength</div>
              Strong empathy on complaint calls — keep it up.
            </li>
            <li className="p-3 rounded-md border-l-2 border-[color:var(--warning)] bg-muted/40">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Focus</div>
              Reduce hold times during verification.
            </li>
            <li className="p-3 rounded-md border-l-2 border-primary bg-muted/40">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Action</div>
              Complete "Live Chat Tone" assessment by Friday.
            </li>
          </ul>
        </PanelCard>
      </div>

      <PanelCard className="mt-4" title="Recent Scorecards">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground border-b">
              <th className="text-left py-2 font-medium">Period</th>
              <th className="text-left py-2 font-medium">Evaluator</th>
              <th className="text-left py-2 font-medium">Score</th>
              <th className="text-left py-2 font-medium">Status</th>
              <th className="text-right py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-3">{r.period}</td>
                <td className="py-3 text-muted-foreground">{r.evaluator}</td>
                <td className="py-3 font-semibold tabular-nums">{r.score}%</td>
                <td className="py-3">
                  {r.status === "Acknowledged" ? (
                    <span className="inline-flex items-center gap-1 text-xs text-[color:var(--success)]">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {r.status}
                    </span>
                  ) : (
                    <span className="text-xs text-[color:var(--warning)]">{r.status}</span>
                  )}
                </td>
                <td className="py-3 text-right">
                  <button className="text-xs text-primary hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelCard>
    </AppShell>
  );
}