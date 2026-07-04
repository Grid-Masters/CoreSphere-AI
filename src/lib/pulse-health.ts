// Pulse Health Index — single composite executive KPI blending learning health,
// compliance and engagement into one 0-100 signal. Strategic/operational only.
import { learningHealth } from "./knowledge-gaps";
import { getComplianceHealth } from "./compliance-health";

export type PulseHealth = {
  index: number;
  band: "Excellent" | "Healthy" | "Watch" | "At Risk";
  drivers: { label: string; value: number }[];
};

export function pulseHealthIndex(): PulseHealth {
  const h = learningHealth();
  const c = getComplianceHealth();
  const engagement = h.engagement;
  const index = Math.round(h.index * 0.4 + c.score * 0.35 + engagement * 0.25);
  const band: PulseHealth["band"] =
    index >= 88 ? "Excellent" : index >= 78 ? "Healthy" : index >= 68 ? "Watch" : "At Risk";
  return {
    index,
    band,
    drivers: [
      { label: "Learning Health", value: h.index },
      { label: "Compliance", value: c.score },
      { label: "Engagement", value: engagement },
    ],
  };
}

export type OperationalWin = {
  title: string;
  detail: string;
  metric: string;
  department: string;
};

export function operationalWins(): OperationalWin[] {
  return [
    { title: "Card dispute SLA improved", detail: "Faster provisional credit turnaround after refresher training.", metric: "-22% aging", department: "FHD" },
    { title: "First contact resolution up", detail: "Inbound team lifted FCR via new SOP talking points.", metric: "+6 pts", department: "Inbound" },
    { title: "KYC accuracy record month", detail: "Video Validation hit highest verification accuracy this cycle.", metric: "98.4%", department: "Video Validation" },
    { title: "Social response time halved", detail: "Faster triage on card-block mentions across channels.", metric: "-51% TTR", department: "Social Media" },
  ];
}