// Deterministic, per-user workforce-development engine. All values are seeded by
// the user's email so they are stable across renders and SSR. This powers the
// Readiness Score, Knowledge Levels, streaks, Pulse Points and daily missions.
// IMPORTANT: development & engagement only — never used for HR/promotion decisions.

import { sops, type SOP } from "./mock-data";
import type { DirectoryEntry } from "./directory";

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

// Deterministic value in [min, max] from a seed string.
function seeded(seed: string, min: number, max: number): number {
  const n = hash(seed) % 1000;
  return Math.round(min + (n / 999) * (max - min));
}

export type ReadinessBreakdown = {
  sopCompletion: number;
  videoCompletion: number;
  assessmentScore: number;
  qaScore: number;
  compliance: number;
  consistency: number;
};

export const READINESS_WEIGHTS = {
  sopCompletion: 0.2,
  videoCompletion: 0.15,
  assessmentScore: 0.2,
  qaScore: 0.25,
  compliance: 0.1,
  consistency: 0.1,
} as const;

export function readinessBreakdown(user: DirectoryEntry): ReadinessBreakdown {
  const e = user.email;
  return {
    sopCompletion: seeded(e + "sop", 55, 98),
    videoCompletion: seeded(e + "vid", 45, 96),
    assessmentScore: seeded(e + "asm", 60, 99),
    qaScore: seeded(e + "qa", 70, 98),
    compliance: seeded(e + "cmp", 60, 100),
    consistency: seeded(e + "con", 50, 100),
  };
}

export function readinessScore(user: DirectoryEntry): number {
  const b = readinessBreakdown(user);
  const score =
    b.sopCompletion * READINESS_WEIGHTS.sopCompletion +
    b.videoCompletion * READINESS_WEIGHTS.videoCompletion +
    b.assessmentScore * READINESS_WEIGHTS.assessmentScore +
    b.qaScore * READINESS_WEIGHTS.qaScore +
    b.compliance * READINESS_WEIGHTS.compliance +
    b.consistency * READINESS_WEIGHTS.consistency;
  return Math.round(score);
}

export function readinessLabel(score: number): { label: string; tone: "success" | "warning" | "primary" } {
  if (score >= 85) return { label: "Operationally Ready", tone: "success" };
  if (score >= 70) return { label: "On Track", tone: "primary" };
  return { label: "Needs Improvement", tone: "warning" };
}

// ── Knowledge Levels ────────────────────────────────────────────────────────
export type Level = { level: number; name: string; min: number };

export const LEVELS: Level[] = [
  { level: 1, name: "Explorer", min: 0 },
  { level: 2, name: "Operator", min: 500 },
  { level: 3, name: "Specialist", min: 1200 },
  { level: 4, name: "Expert", min: 2200 },
  { level: 5, name: "Champion", min: 3500 },
  { level: 6, name: "Master", min: 5200 },
  { level: 7, name: "Legend", min: 7500 },
];

export function pulsePoints(user: DirectoryEntry): number {
  return seeded(user.email + "pts", 350, 6800);
}

export function levelFor(points: number): { current: Level; next?: Level; progress: number } {
  let current = LEVELS[0];
  for (const l of LEVELS) if (points >= l.min) current = l;
  const next = LEVELS.find((l) => l.level === current.level + 1);
  const progress = next
    ? Math.round(((points - current.min) / (next.min - current.min)) * 100)
    : 100;
  return { current, next, progress };
}

export function streakFor(user: DirectoryEntry): number {
  return seeded(user.email + "streak", 2, 28);
}

// ── Daily Mission selection (rule-based, NOT random) ────────────────────────
export type MissionType =
  | "Read SOP"
  | "Watch Video"
  | "Review Policy"
  | "Complete Mini Quiz"
  | "Case Study"
  | "Scenario Challenge";

export type DailyMission = {
  type: MissionType;
  title: string;
  reason: string;
  sop?: SOP;
  minutes: number;
  points: number;
  badge: string;
};

const MISSION_ROTATION: MissionType[] = [
  "Read SOP",
  "Watch Video",
  "Complete Mini Quiz",
  "Scenario Challenge",
  "Review Policy",
  "Case Study",
];

function overall(s: SOP) {
  return Math.round((s.theoryProgress + s.videoProgress) / 2);
}

export function dailyMission(user: DirectoryEntry, now: Date = new Date()): DailyMission {
  // Prefer the user's department; fall back to all SOPs.
  const deptSops = sops.filter((s) => s.department === user.department);
  const pool = deptSops.length ? deptSops : sops;

  // Rule: target the weakest-adopted SOP, breaking ties toward most recently updated.
  const target = [...pool].sort((a, b) => {
    const byProgress = overall(a) - overall(b);
    if (byProgress !== 0) return byProgress;
    return b.updated.localeCompare(a.updated);
  })[0];

  const dayIndex = Math.floor(now.getTime() / (1000 * 60 * 60 * 24)) + hash(user.email);
  const type = MISSION_ROTATION[dayIndex % MISSION_ROTATION.length];

  const reasonByType: Record<MissionType, string> = {
    "Read SOP": `Low adoption detected on "${target.title}" in ${user.department}.`,
    "Watch Video": `Video completion lagging for "${target.title}".`,
    "Complete Mini Quiz": `Reinforce retention on "${target.title}" with a quick check.`,
    "Scenario Challenge": `Apply "${target.title}" to a real ${user.department} scenario.`,
    "Review Policy": `Recently updated guidance linked to "${target.title}".`,
    "Case Study": `Deepen judgement using a "${target.title}" case study.`,
  };

  const badgeByType: Record<MissionType, string> = {
    "Read SOP": "Knowledge Explorer",
    "Watch Video": "Video Learning Champion",
    "Complete Mini Quiz": "Assessment Star",
    "Scenario Challenge": "AI Problem Solver",
    "Review Policy": "Policy Guardian",
    "Case Study": "Fast Learner",
  };

  return {
    type,
    title: target.title,
    reason: reasonByType[type],
    sop: target,
    minutes: 3 + (dayIndex % 8), // 3–10 min
    points: 40 + (dayIndex % 6) * 10,
    badge: badgeByType[type],
  };
}