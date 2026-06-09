// Deterministic per-user badge ecosystem. Earned/locked state is seeded by the
// user's email so it is stable across renders and SSR. Engagement & development
// recognition only — never used for HR/promotion/pay/disciplinary decisions.

import type { DirectoryEntry } from "./directory";
import { pulsePoints, readinessScore, streakFor } from "./gamification";

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export type BadgeCategory =
  | "Attendance"
  | "Knowledge"
  | "AI"
  | "Assessments"
  | "QA"
  | "Learning"
  | "Compliance"
  | "Department"
  | "Recognition";

export type BadgeTier = "Bronze" | "Silver" | "Gold" | "Platinum";

export type Badge = {
  id: string;
  name: string;
  category: BadgeCategory;
  tier: BadgeTier;
  description: string;
  /** lucide icon key resolved in the component */
  icon: string;
};

export const BADGES: Badge[] = [
  // Attendance
  { id: "att-streak", name: "Streak Keeper", category: "Attendance", tier: "Silver", description: "Logged in and learned 7 days in a row.", icon: "flame" },
  { id: "att-early", name: "Early Bird", category: "Attendance", tier: "Bronze", description: "Completed a mission before 9:00 AM.", icon: "sunrise" },
  { id: "att-month", name: "Perfect Month", category: "Attendance", tier: "Gold", description: "Active every working day this month.", icon: "calendar-check" },
  // Knowledge
  { id: "kno-explorer", name: "Knowledge Explorer", category: "Knowledge", tier: "Bronze", description: "Read 10 SOPs end-to-end.", icon: "book-open" },
  { id: "kno-master", name: "SOP Master", category: "Knowledge", tier: "Gold", description: "100% completion across assigned SOPs.", icon: "graduation-cap" },
  { id: "kno-curious", name: "Curious Mind", category: "Knowledge", tier: "Bronze", description: "Asked CoreSphere AI 25 operational questions.", icon: "search" },
  // AI
  { id: "ai-solver", name: "AI Problem Solver", category: "AI", tier: "Silver", description: "Resolved 10 scenarios with CoreSphere AI.", icon: "bot" },
  { id: "ai-writer", name: "Sharp Communicator", category: "AI", tier: "Silver", description: "Used the AI Writing Assistant 20 times.", icon: "pen-line" },
  // Assessments
  { id: "asm-star", name: "Assessment Star", category: "Assessments", tier: "Gold", description: "Scored 90%+ on a monthly assessment.", icon: "star" },
  { id: "asm-perfect", name: "Flawless", category: "Assessments", tier: "Platinum", description: "100% on any certification.", icon: "badge-check" },
  // QA
  { id: "qa-excellence", name: "Quality Excellence", category: "QA", tier: "Gold", description: "QA scorecard above 95% for the month.", icon: "award" },
  { id: "qa-consistent", name: "Consistency Pro", category: "QA", tier: "Silver", description: "QA above 85% for 3 consecutive months.", icon: "line-chart" },
  // Learning
  { id: "lrn-fast", name: "Fast Learner", category: "Learning", tier: "Bronze", description: "Completed 5 learning missions in a week.", icon: "zap" },
  { id: "lrn-video", name: "Video Champion", category: "Learning", tier: "Silver", description: "Watched every assigned training video.", icon: "video" },
  // Compliance
  { id: "cmp-guardian", name: "Policy Guardian", category: "Compliance", tier: "Gold", description: "Acknowledged all critical memos on time.", icon: "shield-check" },
  { id: "cmp-aml", name: "AML Sentinel", category: "Compliance", tier: "Silver", description: "Passed the AML refresher certification.", icon: "shield-alert" },
  // Department
  { id: "dept-champion", name: "Department Champion", category: "Department", tier: "Gold", description: "Top contributor in your department this month.", icon: "users" },
  { id: "dept-shift", name: "Shift Hero", category: "Department", tier: "Bronze", description: "Awarded to scheduled staff for full shift coverage.", icon: "clock" },
  // Recognition
  { id: "rec-week", name: "Champion of the Week", category: "Recognition", tier: "Gold", description: "Recognised by leadership this week.", icon: "trophy" },
  { id: "rec-legend", name: "CoreSphere Legend", category: "Recognition", tier: "Platinum", description: "Reached the highest knowledge level (Legend).", icon: "crown" },
];

export type UserBadge = { badge: Badge; earned: boolean; earnedOn?: string };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export function badgesForUser(user: DirectoryEntry): UserBadge[] {
  const seed = hash(user.email);
  const points = pulsePoints(user);
  const readiness = readinessScore(user);
  const streak = streakFor(user);

  return BADGES.map((badge, i) => {
    // Deterministic earn rule: combine seed with badge index + signal thresholds.
    let earned = ((seed >> (i % 24)) & 1) === 1;
    if (badge.id === "rec-legend") earned = points >= 7500;
    if (badge.id === "att-streak") earned = streak >= 7;
    if (badge.id === "qa-excellence") earned = readiness >= 90;
    const day = 1 + ((seed + i * 7) % 27);
    const month = MONTHS[(seed + i) % MONTHS.length];
    return {
      badge,
      earned,
      earnedOn: earned ? `${day} ${month} 2026` : undefined,
    };
  });
}

export function badgeStats(user: DirectoryEntry): { earned: number; total: number } {
  const list = badgesForUser(user);
  return { earned: list.filter((b) => b.earned).length, total: list.length };
}

export const TIER_ORDER: BadgeTier[] = ["Bronze", "Silver", "Gold", "Platinum"];