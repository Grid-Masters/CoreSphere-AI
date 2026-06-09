import { useState } from "react";
import { Crown, Medal, Trophy } from "lucide-react";
import { PanelCard } from "@/components/ui-bits/Card";
import { leaderboard, type LeaderMetric } from "@/lib/leaderboards";

const METRICS: { key: LeaderMetric; label: string }[] = [
  { key: "points", label: "Pulse Points" },
  { key: "readiness", label: "Readiness" },
  { key: "badges", label: "Badges" },
];

function rankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-4 w-4 text-[color:var(--warning)]" />;
  if (rank === 2) return <Medal className="h-4 w-4 text-muted-foreground" />;
  if (rank === 3) return <Medal className="h-4 w-4 text-[color:var(--warning)]/70" />;
  return <span className="text-xs tabular-nums text-muted-foreground w-4 text-center">{rank}</span>;
}

export function Leaderboards({ department, title }: { department?: string; title?: string }) {
  const [metric, setMetric] = useState<LeaderMetric>("points");
  const rows = leaderboard({ department }, metric).slice(0, 8);

  return (
    <PanelCard
      title={title ?? (department ? `${department} Leaderboard` : "Department Leaderboard")}
      description="Monthly engagement & development ranking — recognition only"
      action={
        <Trophy className="h-4 w-4 text-muted-foreground" />
      }
    >
      <div className="flex gap-1 mb-3">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
              metric === m.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground hover:bg-muted border-border"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <ul className="divide-y -my-2">
        {rows.map((r) => (
          <li key={r.user.email} className="py-2.5 flex items-center gap-3">
            <div className="w-5 flex justify-center">{rankIcon(r.rank)}</div>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold">
              {r.user.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{r.user.name}</div>
              <div className="text-[11px] text-muted-foreground truncate">
                {r.user.department} • Lv{r.level} {r.levelName}
              </div>
            </div>
            <div className="text-sm font-semibold tabular-nums">
              {metric === "points" && r.points.toLocaleString()}
              {metric === "readiness" && `${r.readiness}%`}
              {metric === "badges" && r.badges}
            </div>
          </li>
        ))}
      </ul>
    </PanelCard>
  );
}