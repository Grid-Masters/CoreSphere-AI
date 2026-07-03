// ============================================================================
// Phase D — Hall of Excellence recognition logic
// Champions and departmental recognition computed from engagement metrics.
// Recognition-only (Pulse Points) — never used for HR/promotion/pay decisions.
// ============================================================================

import { leaderboard } from "./leaderboards";
import { OPERATIONAL_DEPARTMENTS, DEPARTMENTS } from "./org-structure";
import type { DirectoryEntry } from "./directory";

export type ChampionCategory = "Learning Excellence" | "Operational Readiness" | "Continuous Improvement";

export type Champion = {
  category: ChampionCategory;
  user: DirectoryEntry;
  metricLabel: string;
  points: number;
  readiness: number;
};

export function champions(): Champion[] {
  const byPoints = leaderboard({}, "points");
  const byReadiness = leaderboard({}, "readiness");
  const byBadges = leaderboard({}, "badges");

  const pick = (rows: typeof byPoints, i = 0) => rows[i];

  const learning = pick(byPoints);
  const readinessTop = pick(byReadiness);
  // Continuous Improvement: strongest badge collector who isn't already the points champion.
  const improvement = byBadges.find((r) => r.user.email !== learning?.user.email) ?? byBadges[0];

  const out: Champion[] = [];
  if (learning) out.push({ category: "Learning Excellence", user: learning.user, metricLabel: `${learning.points.toLocaleString()} Pulse Points`, points: learning.points, readiness: learning.readiness });
  if (readinessTop) out.push({ category: "Operational Readiness", user: readinessTop.user, metricLabel: `${readinessTop.readiness}% readiness`, points: readinessTop.points, readiness: readinessTop.readiness });
  if (improvement) out.push({ category: "Continuous Improvement", user: improvement.user, metricLabel: `${improvement.badges} badges earned`, points: improvement.points, readiness: improvement.readiness });
  return out;
}

export type DeptChampion = {
  department: string;
  isSubUnit: boolean;
  parent?: string;
  user: DirectoryEntry | null;
  points: number;
};

// Top performer per operational department and per named sub-unit.
export function departmentalRecognition(): DeptChampion[] {
  const out: DeptChampion[] = [];
  for (const code of OPERATIONAL_DEPARTMENTS) {
    const rows = leaderboard({ department: code }, "points");
    out.push({ department: code, isSubUnit: false, user: rows[0]?.user ?? null, points: rows[0]?.points ?? 0 });
    const dept = DEPARTMENTS.find((d) => d.code === code);
    for (const unit of dept?.units ?? []) {
      const unitRows = rows.filter((r) => r.user.unit === unit);
      if (unitRows.length) {
        out.push({ department: unit, isSubUnit: true, parent: code, user: unitRows[0].user, points: unitRows[0].points });
      }
    }
  }
  return out;
}

// Deterministic recognition-only spotlight narrative (no HR language).
export function spotlightStory(c: Champion): string {
  const first = c.user.name.split(" ")[0];
  const map: Record<ChampionCategory, string> = {
    "Learning Excellence": `${first} led the group in learning engagement this cycle, turning consistent daily missions into ${c.points.toLocaleString()} Pulse Points and setting the pace for ${c.user.department}.`,
    "Operational Readiness": `${first} sustained an outstanding ${c.readiness}% operational readiness — staying current on SOPs and assessments and modelling shift-ready excellence for ${c.user.department}.`,
    "Continuous Improvement": `${first} kept growing week over week, collecting new badges and lifting the ${c.user.department} team through steady, visible improvement.`,
  };
  return map[c.category];
}
