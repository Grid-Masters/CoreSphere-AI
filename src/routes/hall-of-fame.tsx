import { createFileRoute } from "@tanstack/react-router";
import { Award, Crown, Flame, Sparkles, Star, Trophy } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard } from "@/components/ui-bits/Card";
import { Leaderboards } from "@/components/mission/Leaderboards";
import { ShiftScheduler } from "@/components/mission/ShiftScheduler";
import { useActiveUser } from "@/lib/active-user";
import { DEPARTMENTS_WITH_STAFF } from "@/lib/leaderboards";

export const Route = createFileRoute("/hall-of-fame")({
  head: () => ({ meta: [{ title: "Hall of Fame — UBA CoreSphere" }] }),
  component: HallOfFame,
});

const RECOGNITION = [
  { icon: Crown, label: "Champion of the Month", name: "Adaeze Okafor", detail: "FHD Core • 98% QA • 6,800 pts", tone: "text-[color:var(--warning)]" },
  { icon: Star, label: "Best QA Performer", name: "Ifeanyi Obi", detail: "Inbound • 96.4% scorecard", tone: "text-primary" },
  { icon: Flame, label: "Most Improved", name: "Halima Yusuf", detail: "Multimedia • +14 pts this month", tone: "text-[color:var(--success)]" },
  { icon: Award, label: "Compliance Champion", name: "Kelechi Nwosu", detail: "Containment • 100% completion", tone: "text-primary" },
  { icon: Sparkles, label: "Top AI Learner", name: "Musa Bello", detail: "Inbound • 240 AI sessions", tone: "text-[color:var(--success)]" },
  { icon: Trophy, label: "CoreSphere Legend", name: "Sani Eze", detail: "FHD • Level 7 reached", tone: "text-[color:var(--warning)]" },
];

function HallOfFame() {
  const user = useActiveUser();
  const showShifts = user.role === "team_lead";
  const dept = user.role === "team_lead" ? user.department : undefined;

  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recognition</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Hall of Fame</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monthly recognition across Customer Fulfilment — celebrating learning, quality and engagement.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {RECOGNITION.map((r) => (
          <div key={r.label} className="relative bg-card border rounded-xl p-5 shadow-sm overflow-hidden">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5" />
            <r.icon className={`h-5 w-5 ${r.tone}`} />
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-3">{r.label}</div>
            <div className="text-base font-semibold mt-1">{r.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{r.detail}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Leaderboards title="Group Leaderboard" />
        {dept ? (
          <Leaderboards department={dept} />
        ) : (
          <Leaderboards department={DEPARTMENTS_WITH_STAFF[0]} />
        )}
      </div>

      {!dept && (
        <PanelCard className="mt-4" title="Top Department" description="Recognition standings by department">
          <ul className="divide-y -my-2">
            {[
              { dept: "FHD", pts: "Avg 5,120 pts", badge: "🥇" },
              { dept: "Inbound", pts: "Avg 4,680 pts", badge: "🥈" },
              { dept: "Multimedia", pts: "Avg 4,210 pts", badge: "🥉" },
              { dept: "Social Media", pts: "Avg 3,940 pts", badge: "" },
            ].map((d) => (
              <li key={d.dept} className="py-3 flex items-center gap-3">
                <span className="w-6 text-center">{d.badge}</span>
                <span className="flex-1 text-sm font-medium">{d.dept}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{d.pts}</span>
              </li>
            ))}
          </ul>
        </PanelCard>
      )}

      {showShifts && (
        <div className="mt-4">
          <ShiftScheduler user={user} />
        </div>
      )}
    </AppShell>
  );
}