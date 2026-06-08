import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Flame,
  Sparkles,
  Trophy,
  Clock,
  ArrowRight,
  BookOpen,
  Video,
  ClipboardCheck,
  Brain,
  ScrollText,
  Target,
  Zap,
} from "lucide-react";
import { pickQuote, greetingForHour } from "@/lib/quotes";
import {
  dailyMission,
  pulsePoints,
  levelFor,
  streakFor,
  type MissionType,
} from "@/lib/gamification";
import { ProgressBar } from "@/components/ui-bits/Card";
import type { DirectoryEntry } from "@/lib/directory";

const TYPE_ICON: Record<MissionType, any> = {
  "Read SOP": BookOpen,
  "Watch Video": Video,
  "Complete Mini Quiz": ClipboardCheck,
  "Scenario Challenge": Brain,
  "Review Policy": ScrollText,
  "Case Study": Target,
};

function Metric({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-lg bg-background/60 border border-border/50 px-3 py-2.5 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className={`h-3 w-3 ${accent ?? ""}`} /> {label}
      </div>
      <div className="text-lg font-semibold mt-0.5 tabular-nums">{value}</div>
    </div>
  );
}

export function MissionControl({ user }: { user: DirectoryEntry }) {
  const [quote, setQuote] = useState(() => pickQuote(new Date(0)));
  const [hello, setHello] = useState("Good morning");
  const [mission, setMission] = useState(() => dailyMission(user, new Date(0)));

  useEffect(() => {
    const now = new Date();
    setQuote(pickQuote(now));
    setHello(greetingForHour(now.getHours()));
    setMission(dailyMission(user, now));
  }, [user]);

  const points = pulsePoints(user);
  const { current, next, progress } = levelFor(points);
  const streak = streakFor(user);
  const MissionIcon = TYPE_ICON[mission.type];

  return (
    <section className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/10 via-card to-card shadow-sm mb-6">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" aria-hidden />
      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">
              <Sparkles className="h-3 w-3" /> Mission Control
            </div>
            <h1 className="text-2xl font-semibold tracking-tight mt-1.5">
              {hello}, {user.name.split(" ")[0]} <span aria-hidden>👋</span>
            </h1>
            <blockquote className="mt-1.5 text-sm italic text-muted-foreground border-l-2 border-primary/40 pl-3">
              “{quote}”
            </blockquote>
          </div>
          <div className="flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1.5 backdrop-blur-sm">
            <Trophy className="h-4 w-4 text-primary" />
            <div className="leading-tight">
              <div className="text-xs font-semibold">
                Level {current.level} · {current.name}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {next ? `${next.min - points} pts to ${next.name}` : "Max level reached"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid lg:grid-cols-[1.6fr_1fr] gap-4">
          {/* Daily mission */}
          <div className="rounded-lg border bg-background/70 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                <Zap className="h-3 w-3 text-primary" /> Today's Mission · {mission.type}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" /> {mission.minutes} min
              </span>
            </div>
            <div className="mt-2 flex items-start gap-3">
              <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MissionIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-tight">{mission.title}</div>
                <div className="text-[12px] text-muted-foreground mt-0.5">{mission.reason}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border bg-card">
                  <Zap className="h-3 w-3 text-primary" /> +{mission.points} Pulse Points
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border bg-card">
                  <Trophy className="h-3 w-3 text-primary" /> {mission.badge}
                </span>
              </div>
              {mission.sop ? (
                <Link
                  to="/knowledge-hub/$sopId"
                  params={{ sopId: mission.sop.id }}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
                >
                  Start Mission <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 content-start">
            <Metric icon={Flame} label="Current Streak" value={`${streak} days`} accent="text-[color:var(--warning)]" />
            <Metric icon={Zap} label="Pulse Points" value={points.toLocaleString()} accent="text-primary" />
            <div className="col-span-2 rounded-lg bg-background/60 border border-border/50 px-3 py-2.5 backdrop-blur-sm">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>Level Progress</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <div className="mt-2">
                <ProgressBar value={progress} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}