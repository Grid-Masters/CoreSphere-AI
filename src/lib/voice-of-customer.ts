// Voice of Customer — derived, deterministic executive view of complaint themes,
// escalation drivers and sentiment. Trends only; no individual attribution.
import { getComplianceHealth } from "./compliance-health";
import { learningHealth } from "./knowledge-gaps";

export type VocTheme = {
  theme: string;
  volume: number; // share of contacts, %
  trend: number; // pts vs last month
  sentiment: "Positive" | "Neutral" | "Negative";
};

export type VocSnapshot = {
  csat: number; // %
  csatDelta: number;
  fcr: number; // first contact resolution %
  escalationRate: number; // %
  themes: VocTheme[];
  painPoints: string[];
};

export function voiceOfCustomer(): VocSnapshot {
  const h = learningHealth();
  const c = getComplianceHealth();
  // CSAT loosely tracks readiness + compliance so exec view stays coherent.
  const csat = Math.min(96, Math.max(72, Math.round((h.index + c.score) / 2)));

  return {
    csat,
    csatDelta: 2,
    fcr: Math.min(92, Math.max(64, csat - 6)),
    escalationRate: Math.max(4, 18 - Math.round(h.index / 10)),
    themes: [
      { theme: "Card blocks & disputes", volume: 24, trend: -3, sentiment: "Negative" },
      { theme: "Transfer / NIBSS delays", volume: 19, trend: 2, sentiment: "Negative" },
      { theme: "Mobile & Internet Banking access", volume: 16, trend: -1, sentiment: "Neutral" },
      { theme: "Account reactivation & KYC", volume: 14, trend: -4, sentiment: "Neutral" },
      { theme: "Leo & digital self-service", volume: 11, trend: 5, sentiment: "Positive" },
      { theme: "Fees & charges clarity", volume: 9, trend: 0, sentiment: "Neutral" },
    ],
    painPoints: [
      "Repeat contacts on failed transfers before reversal SLA.",
      "Customers unsure how to self-unblock cards via Leo.",
      "KYC document re-submission friction during reactivation.",
    ],
  };
}