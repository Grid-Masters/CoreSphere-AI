export type ComplianceMetric = {
  label: string;
  value: number; // 0-100
  tone: "success" | "warning" | "danger";
};

export type ComplianceHealthSnapshot = {
  score: number; // 0-100
  delta: number; // pts vs last month
  band: "Strong" | "Healthy" | "Watch" | "At Risk";
  metrics: ComplianceMetric[];
};

export function getComplianceHealth(department?: string): ComplianceHealthSnapshot {
  // Deterministic mock — slight variance by department for realism.
  const seed = (department ?? "ENT").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const jitter = (seed % 7) - 3;
  const score = Math.min(98, Math.max(70, 92 + jitter));
  const delta = ((seed % 5) - 2);

  const band: ComplianceHealthSnapshot["band"] =
    score >= 93 ? "Strong" : score >= 85 ? "Healthy" : score >= 75 ? "Watch" : "At Risk";

  return {
    score,
    delta,
    band,
    metrics: [
      { label: "SOP Completion", value: Math.min(100, 78 + jitter), tone: "success" },
      { label: "Assessment Completion", value: Math.min(100, 74 + jitter), tone: "success" },
      { label: "Acknowledgement Rate", value: Math.min(100, 88 + jitter), tone: "success" },
      { label: "Open Compliance Flags", value: Math.max(0, 6 - jitter), tone: "warning" },
      { label: "Overdue Training", value: Math.max(0, 12 - jitter), tone: "warning" },
      { label: "Pending Reviews", value: Math.max(0, 5 + jitter), tone: "warning" },
    ],
  };
}

export function bandColor(band: ComplianceHealthSnapshot["band"]) {
  if (band === "Strong") return "text-[color:var(--success)]";
  if (band === "Healthy") return "text-primary";
  if (band === "Watch") return "text-[color:var(--warning)]";
  return "text-[color:var(--destructive)]";
}