import {
  Award, BadgeCheck, Bot, BookOpen, CalendarCheck, Clock, Crown, Flame,
  GraduationCap, LineChart, Lock, PenLine, Search, ShieldAlert, ShieldCheck,
  Star, Sunrise, Trophy, Users, Video, Zap, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BadgeTier, UserBadge } from "@/lib/badges";

const ICONS: Record<string, LucideIcon> = {
  flame: Flame, sunrise: Sunrise, "calendar-check": CalendarCheck, "book-open": BookOpen,
  "graduation-cap": GraduationCap, search: Search, bot: Bot, "pen-line": PenLine,
  star: Star, "badge-check": BadgeCheck, award: Award, "line-chart": LineChart,
  zap: Zap, video: Video, "shield-check": ShieldCheck, "shield-alert": ShieldAlert,
  users: Users, clock: Clock, trophy: Trophy, crown: Crown,
};

const TIER_STYLE: Record<BadgeTier, string> = {
  Bronze: "from-amber-700/20 to-amber-600/10 text-amber-700 dark:text-amber-500",
  Silver: "from-slate-400/20 to-slate-300/10 text-slate-500 dark:text-slate-300",
  Gold: "from-yellow-500/25 to-yellow-400/10 text-yellow-600 dark:text-yellow-400",
  Platinum: "from-primary/25 to-primary/10 text-primary",
};

export function BadgeGrid({ badges }: { badges: UserBadge[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {badges.map(({ badge, earned, earnedOn }) => {
        const Icon = ICONS[badge.icon] ?? Award;
        return (
          <div
            key={badge.id}
            className={cn(
              "relative rounded-xl border p-4 transition-all",
              earned ? "bg-card shadow-sm hover:shadow-md" : "bg-muted/40 opacity-70",
            )}
          >
            <div
              className={cn(
                "h-11 w-11 rounded-lg flex items-center justify-center bg-gradient-to-br",
                earned ? TIER_STYLE[badge.tier] : "from-muted to-muted text-muted-foreground",
              )}
            >
              {earned ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
            </div>
            <div className="mt-3 text-sm font-semibold leading-tight">{badge.name}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
              {badge.tier} • {badge.category}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">{badge.description}</p>
            {earned && earnedOn && (
              <div className="mt-2 text-[10px] text-[color:var(--success)] font-medium">Earned {earnedOn}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}