export type RiskFactor = {
  label: string;
  weight: number;
};

export type AtRiskStaffEntry = {
  id: string;
  name: string;
  initials: string;
  department: string;
  unit: string;
  riskScore: number; // 0-100
  band: "Critical" | "High" | "Watch";
  factors: RiskFactor[];
  recommendation: string;
  trend: "up" | "down" | "flat";
};

export const atRiskStaff: AtRiskStaffEntry[] = [
  {
    id: "ar1",
    name: "Musa Bello",
    initials: "MB",
    department: "Inbound",
    unit: "Inbound Voice",
    riskScore: 82,
    band: "Critical",
    factors: [
      { label: "SOP completion 46%", weight: 30 },
      { label: "QA declined −9pts (3 mo)", weight: 25 },
      { label: "2 missed acknowledgements", weight: 15 },
      { label: "Assessment failed twice", weight: 12 },
    ],
    recommendation: "Schedule 1:1 coaching this week + assign KYC Refresher path. Pair with mentor on Inbound Voice.",
    trend: "up",
  },
  {
    id: "ar2",
    name: "Tunde Aina",
    initials: "TA",
    department: "Social Media",
    unit: "Reputation",
    riskScore: 71,
    band: "High",
    factors: [
      { label: "QA below department avg", weight: 22 },
      { label: "3 escalations involved", weight: 20 },
      { label: "1 overdue training", weight: 15 },
    ],
    recommendation: "Refresher on tone & de-escalation. Shadow a senior agent for 3 shifts.",
    trend: "up",
  },
  {
    id: "ar3",
    name: "Esther James",
    initials: "EJ",
    department: "Multimedia",
    unit: "Live Chat",
    riskScore: 58,
    band: "Watch",
    factors: [
      { label: "Completion trending down", weight: 18 },
      { label: "1 missed acknowledgement", weight: 10 },
    ],
    recommendation: "Light-touch nudge: complete pending Live Chat Tone module by Friday.",
    trend: "flat",
  },
  {
    id: "ar4",
    name: "Adaeze Okafor",
    initials: "AO",
    department: "FHD",
    unit: "FHD Core",
    riskScore: 41,
    band: "Watch",
    factors: [
      { label: "Overdue ack on fraud advisory", weight: 14 },
    ],
    recommendation: "Reminder to acknowledge fraud advisory; no further intervention needed.",
    trend: "down",
  },
];

export function bandColor(band: AtRiskStaffEntry["band"]) {
  if (band === "Critical") return "text-[color:var(--destructive)] bg-[color:var(--destructive)]/10 border-[color:var(--destructive)]/30";
  if (band === "High") return "text-[color:var(--warning)] bg-[color:var(--warning)]/15 border-[color:var(--warning)]/30";
  return "text-primary bg-primary/10 border-primary/20";
}