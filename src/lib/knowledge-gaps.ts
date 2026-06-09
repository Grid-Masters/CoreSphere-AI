// AI Knowledge Gap Engine. Surfaces weak SOP adoption, low assessment scores
// and missing content as insight cards for Team Lead / L&D / Group Head.
// Trends & development only — no HR/promotion output.

import { sops, overallProgress, assessments } from "./mock-data";
import { failedSearches } from "./faq";

export type GapSeverity = "Critical" | "High" | "Watch";

export type KnowledgeGap = {
  id: string;
  title: string;
  detail: string;
  type: "SOP Adoption" | "Assessment" | "Missing Content";
  severity: GapSeverity;
  metric: string;
  recommendation: string;
  department?: string;
};

function sevForProgress(p: number): GapSeverity {
  if (p < 40) return "Critical";
  if (p < 65) return "High";
  return "Watch";
}

export function knowledgeGaps(department?: string): KnowledgeGap[] {
  const gaps: KnowledgeGap[] = [];

  // 1. Weak SOP adoption
  const sopPool = department ? sops.filter((s) => s.department === department) : sops;
  sopPool
    .map((s) => ({ s, p: overallProgress(s) }))
    .filter((x) => x.p < 70)
    .sort((a, b) => a.p - b.p)
    .slice(0, 4)
    .forEach(({ s, p }) =>
      gaps.push({
        id: `gap-sop-${s.id}`,
        title: `Low adoption: ${s.title}`,
        detail: `Only ${p}% average completion across ${s.department}. Theory ${s.theoryProgress}% • Video ${s.videoProgress}%.`,
        type: "SOP Adoption",
        severity: sevForProgress(p),
        metric: `${p}% adoption`,
        recommendation: `Assign as a daily mission and schedule a ${s.department} refresher.`,
        department: s.department,
      }),
    );

  // 2. Low assessment scores
  assessments
    .filter((a) => a.status === "Failed" || (a.score !== null && (a.score as number) < 70))
    .forEach((a) =>
      gaps.push({
        id: `gap-asm-${a.id}`,
        title: `Assessment weakness: ${a.title}`,
        detail: `${a.status}${a.score !== null ? ` at ${a.score}%` : ""} after ${a.attempts} attempt(s).`,
        type: "Assessment",
        severity: a.status === "Failed" ? "Critical" : "High",
        metric: a.score !== null ? `${a.score}%` : a.status,
        recommendation: "Trigger remedial micro-learning and a make-up assessment via L&D.",
      }),
    );

  // 3. Missing content (from failed searches)
  failedSearches
    .filter((f) => !department || !f.department || f.department === department)
    .slice(0, 3)
    .forEach((f) =>
      gaps.push({
        id: `gap-miss-${f.id}`,
        title: `Missing content: "${f.query}"`,
        detail: `${f.count} searches returned no confident answer${f.department ? ` in ${f.department}` : ""}.`,
        type: "Missing Content",
        severity: f.count > 100 ? "Critical" : f.count > 60 ? "High" : "Watch",
        metric: `${f.count} searches`,
        recommendation: f.recommendation,
        department: f.department,
      }),
    );

  const order: Record<GapSeverity, number> = { Critical: 0, High: 1, Watch: 2 };
  return gaps.sort((a, b) => order[a.severity] - order[b.severity]);
}

export type LearningHealth = {
  index: number; // 0–100
  label: string;
  departmentReadiness: { department: string; value: number }[];
  sopAdoption: number;
  assessmentPerformance: number;
  compliance: number;
  engagement: number;
  riskAreas: string[];
};

export function learningHealth(): LearningHealth {
  const sopAdoption = Math.round(sops.reduce((acc, s) => acc + overallProgress(s), 0) / sops.length);
  const departmentReadiness = ["FHD", "Inbound", "Multimedia", "Social Media"].map((d) => {
    const ds = sops.filter((s) => s.department === d);
    const value = ds.length ? Math.round(ds.reduce((a, s) => a + overallProgress(s), 0) / ds.length) : 70;
    return { department: d, value };
  });
  const assessmentPerformance = 81;
  const compliance = 96;
  const engagement = 78;
  const index = Math.round(sopAdoption * 0.3 + assessmentPerformance * 0.25 + compliance * 0.25 + engagement * 0.2);
  const label = index >= 85 ? "Healthy" : index >= 70 ? "Stable" : "At Risk";
  const riskAreas = knowledgeGaps()
    .filter((g) => g.severity === "Critical")
    .slice(0, 3)
    .map((g) => g.title);
  return { index, label, departmentReadiness, sopAdoption, assessmentPerformance, compliance, engagement, riskAreas };
}