import { createFileRoute } from "@tanstack/react-router";
import { Award, Flame, Sparkles, Trophy, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, ProgressBar, StatCard } from "@/components/ui-bits/Card";
import { BadgeGrid } from "@/components/mission/BadgeGrid";
import { useActiveUser } from "@/lib/active-user";
import { badgesForUser, badgeStats, type BadgeCategory } from "@/lib/badges";
import { levelFor, pulsePoints, readinessScore, streakFor, LEVELS } from "@/lib/gamification";

export const Route = createFileRoute("/achievements")({
  head: () => ({ meta: [{ title: "Achievements — UBA CoreSphere" }] }),
  component: Achievements,
});

const CATEGORIES: BadgeCategory[] = [
  "Recognition", "Knowledge", "Assessments", "QA", "Learning", "Compliance", "AI", "Attendance", "Department",
];

function Achievements() {
  const user = useActiveUser();
  const badges = badgesForUser(user);
  const stats = badgeStats(user);
  const points = pulsePoints(user);
  const { current, next, progress } = levelFor(points);
  const readiness = readinessScore(user);
  const streak = streakFor(user);

  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workforce Engagement</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Achievements & Recognition</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your badges, level progress and Pulse Points. Engagement & development only — never used for HR decisions.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="Pulse Points" value={points.toLocaleString()} delta={next ? `${next.min - points} to ${next.name}` : "Max level"} icon={Zap} tone="primary" />
        <StatCard label="Knowledge Level" value={`Lv ${current.level}`} delta={current.name} icon={Sparkles} tone="success" />
        <StatCard label="Badges Earned" value={`${stats.earned}/${stats.total}`} delta="Across 9 categories" icon={Award} tone="warning" />
        <StatCard label="Learning Streak" value={`${streak} days`} delta="Keep it going" icon={Flame} tone="primary" />
      </div>

      <PanelCard className="mb-4" title="Level Progress" description={`Readiness ${readiness}% • ${current.name} → ${next ? next.name : "Legend (max)"}`} action={<Trophy className="h-4 w-4 text-muted-foreground" />}>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-medium">Lv {current.level} {current.name}</span>
          {next && <span className="text-muted-foreground tabular-nums">{progress}% to Lv {next.level}</span>}
        </div>
        <ProgressBar value={progress} tone="success" />
        <div className="mt-4 flex flex-wrap gap-1.5">
          {LEVELS.map((l) => (
            <span
              key={l.level}
              className={`text-[10px] px-2 py-0.5 rounded-full border ${
                points >= l.min ? "bg-primary/10 text-primary border-primary/30" : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {l.level}. {l.name}
            </span>
          ))}
        </div>
      </PanelCard>

      {CATEGORIES.map((cat) => {
        const inCat = badges.filter((b) => b.badge.category === cat);
        if (!inCat.length) return null;
        return (
          <PanelCard key={cat} className="mb-4" title={`${cat} Badges`} description={`${inCat.filter((b) => b.earned).length}/${inCat.length} earned`}>
            <BadgeGrid badges={inCat} />
          </PanelCard>
        );
      })}
    </AppShell>
  );
}