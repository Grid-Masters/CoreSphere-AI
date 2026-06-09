// Deterministic department leaderboards for engagement & development recognition.
// NOT for HR, promotion, pay or disciplinary decisions.

import { directory, type DirectoryEntry } from "./directory";
import { pulsePoints, readinessScore, levelFor } from "./gamification";
import { badgeStats } from "./badges";

export type LeaderRow = {
  user: DirectoryEntry;
  points: number;
  readiness: number;
  level: number;
  levelName: string;
  badges: number;
  rank: number;
};

export type LeaderMetric = "points" | "readiness" | "badges";

export function leaderboard(
  scope: { department?: string } = {},
  metric: LeaderMetric = "points",
): LeaderRow[] {
  const pool = scope.department
    ? directory.filter((d) => d.department === scope.department)
    : directory.filter((d) => d.role === "staff" || d.role === "team_lead" || d.role === "qa");

  const rows = pool.map((user) => {
    const points = pulsePoints(user);
    const lvl = levelFor(points);
    return {
      user,
      points,
      readiness: readinessScore(user),
      level: lvl.current.level,
      levelName: lvl.current.name,
      badges: badgeStats(user).earned,
    };
  });

  rows.sort((a, b) => {
    if (metric === "readiness") return b.readiness - a.readiness;
    if (metric === "badges") return b.badges - a.badges;
    return b.points - a.points;
  });

  return rows.map((r, i) => ({ ...r, rank: i + 1 }));
}

export const DEPARTMENTS_WITH_STAFF = ["FHD", "Inbound", "Multimedia", "Social Media"];