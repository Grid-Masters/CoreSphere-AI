// ============================================================================
// Phase C — Operational Alert Center + Knowledge intelligence
// Categorised operational alerts (static baseline) plus derived
// Knowledge Decay and Incident Learning views over existing SOP data.
// ============================================================================

import { scenarios, type OperationalScenario } from "./scenarios";
import { sops, overallProgress, type SOP } from "./mock-data";

export type AlertCategory =
  | "NIBSS / Transfers"
  | "Cards"
  | "Fraud"
  | "App / Channels"
  | "Downtime"
  | "Compliance";

export type OperationalAlert = OperationalScenario & { category: AlertCategory };

function categorize(s: OperationalScenario): AlertCategory {
  const t = `${s.title} ${s.detail}`.toLowerCase();
  if (t.includes("fraud") || t.includes("impersonation")) return "Fraud";
  if (t.includes("transfer") || t.includes("nip") || t.includes("nibss")) return "NIBSS / Transfers";
  if (t.includes("card")) return "Cards";
  if (t.includes("kyc") || t.includes("compliance") || t.includes("deadline")) return "Compliance";
  if (t.includes("ussd") || t.includes("app") || t.includes("outage") || t.includes("*919")) return "App / Channels";
  if (t.includes("sla") || t.includes("complaint") || t.includes("downtime")) return "Downtime";
  return "App / Channels";
}

export const operationalAlerts: OperationalAlert[] = scenarios.map((s) => ({
  ...s,
  category: categorize(s),
}));

export const ALERT_CATEGORIES: AlertCategory[] = [
  "NIBSS / Transfers", "Cards", "Fraud", "App / Channels", "Downtime", "Compliance",
];

// --- Knowledge Decay Detection ------------------------------------------------
// Flags SOPs that are ageing or under-adopted so L&D / Team Leads can refresh.
export type DecaySeverity = "Stale" | "Ageing" | "Fresh";

export type KnowledgeDecay = {
  sop: SOP;
  ageDays: number;
  adoption: number;
  severity: DecaySeverity;
  recommendation: string;
};

const NOW = new Date("2026-05-15");

export function knowledgeDecay(department?: string): KnowledgeDecay[] {
  const pool = department ? sops.filter((s) => s.department === department) : sops;
  return pool
    .map((sop) => {
      const ageDays = Math.max(0, Math.round((NOW.getTime() - new Date(sop.updated).getTime()) / 86_400_000));
      const adoption = overallProgress(sop);
      const stale = ageDays > 60 || adoption < 50;
      const ageing = ageDays > 30 || adoption < 75;
      const severity: DecaySeverity = stale ? "Stale" : ageing ? "Ageing" : "Fresh";
      const recommendation = stale
        ? "Review content and re-publish; assign a refresher mission."
        : ageing
          ? "Schedule a review and nudge outstanding staff."
          : "Healthy — monitor at next cycle.";
      return { sop, ageDays, adoption, severity, recommendation };
    })
    .sort((a, b) => {
      const order: Record<DecaySeverity, number> = { Stale: 0, Ageing: 1, Fresh: 2 };
      return order[a.severity] - order[b.severity] || b.ageDays - a.ageDays;
    });
}

// --- Incident Learning Center -------------------------------------------------
// Turns resolved operational incidents into reusable learning cards.
export type IncidentLesson = {
  id: string;
  title: string;
  category: AlertCategory;
  whatHappened: string;
  lesson: string;
  linkedSop?: string;
};

export const incidentLessons: IncidentLesson[] = [
  {
    id: "il1",
    title: "NIP Timeout Surge — Switch Partner",
    category: "NIBSS / Transfers",
    whatHappened: "A partner switch timeout caused a spike in failed transfers and duplicate complaints.",
    lesson: "Activate the failed-transfer SOP early and push a proactive holding message to reduce repeat contacts.",
    linkedSop: "Dispute Resolution SLA Guide",
  },
  {
    id: "il2",
    title: "Voice Impersonation Cluster",
    category: "Fraud",
    whatHappened: "Coordinated SIM-swap impersonation attempts targeted high-value accounts.",
    lesson: "Enforce SIM-swap verification fallback and re-authentication on flagged accounts before any sensitive action.",
    linkedSop: "AML Red Flag Identification",
  },
  {
    id: "il3",
    title: "USSD Regional Degradation",
    category: "App / Channels",
    whatHappened: "*919# degraded across three regions during peak hours.",
    lesson: "Use the approved outage talk-track and direct customers to the mobile app fallback to protect experience.",
    linkedSop: "Inbound Call Handling Standards",
  },
];
