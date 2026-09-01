// FAQ governance data + AI-driven gap detection. AI may suggest, draft and
// detect gaps but CANNOT publish. Team Leads own department FAQs; L&D owns
// enterprise FAQs; Group Head views and requests.

import type { Role } from "./directory";

export type FaqScope = "Enterprise" | "Department";
export type FaqStatus = "Published" | "Draft" | "AI Suggested";

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  scope: FaqScope;
  department?: string;
  status: FaqStatus;
  owner: string;
  updated: string;
  views: number;
};

export const faqs: FaqEntry[] = [
  { id: "f1", question: "How do I block a customer's card immediately?", answer: "Verify identity per Customer Authentication Fallback, then follow the Card Block & Unblock SOP. Log the action and confirm via callback.", scope: "Enterprise", status: "Published", owner: "L&D", updated: "2026-05-02", views: 1204 },
  { id: "f2", question: "What is the SLA for dispute resolution?", answer: "Acknowledge within 24h, provisional credit assessment within 3 business days, full resolution within 10 business days per the Dispute Resolution SLA Guide.", scope: "Enterprise", status: "Published", owner: "L&D", updated: "2026-04-18", views: 870 },
  { id: "f3", question: "Card block escalation matrix (FHD)", answer: "Tier 1: Service Officer holds & verifies. Tier 2: Team Lead authorises permanent block. Tier 3: Fraud Risk for confirmed fraud.", scope: "Department", department: "FHD", status: "Published", owner: "Team Lead, FHD", updated: "2026-05-06", views: 412 },
  { id: "f4", question: "Live chat tone exceptions (Multimedia)", answer: "Approved exceptions to standard tone apply for bereavement and accessibility cases. Default to empathy-first scripting otherwise.", scope: "Department", department: "Multimedia", status: "Published", owner: "Team Lead, Multimedia", updated: "2026-04-30", views: 268 },
  { id: "f5", question: "How do I handle a failed NIP transfer dispute?", answer: "AI-drafted: confirm transaction status in core banking, apply the failed-transfer SOP, set customer expectation per SLA, and log for reconciliation.", scope: "Department", department: "FHD", status: "Draft", owner: "Team Lead, FHD", updated: "2026-05-11", views: 0 },
  { id: "f6", question: "What's the fallback when biometric auth fails?", answer: "AI-suggested from 137 failed searches — recommend documenting the Customer Authentication Fallback as an enterprise FAQ.", scope: "Enterprise", status: "AI Suggested", owner: "CoreSphere AI", updated: "2026-05-12", views: 0 },
];

export type FailedSearch = {
  id: string;
  query: string;
  count: number;
  department?: string;
  recommendation: string;
};

export const failedSearches: FailedSearch[] = [
  { id: "fs1", query: "biometric authentication fallback", count: 137, recommendation: "No FAQ exists. Recommend enterprise FAQ from Customer Authentication Fallback policy." },
  { id: "fs2", query: "reverse duplicate airtime purchase", count: 92, department: "Inbound", recommendation: "Frequent dept query with no SOP match. Recommend Inbound FAQ." },
  { id: "fs3", query: "social media impersonation report", count: 68, department: "Social Media", recommendation: "Link to Social Media Crisis Protocol and publish a quick-answer FAQ." },
  { id: "fs4", query: "chargeback timeline mastercard", count: 54, recommendation: "Partial SOP coverage. Recommend FAQ summarising dispute timelines." },
  { id: "fs5", query: "dormant account reactivation documents", count: 47, department: "FHD", recommendation: "Map to Account Reactivation SOP and publish a checklist FAQ." },
];

export type FaqPermissions = {
  canPublishEnterprise: boolean;
  canPublishDepartment: boolean;
  canRequest: boolean;
  canView: boolean;
  scopeNote: string;
};

export function faqPermissions(role: Role, department?: string): FaqPermissions {
  switch (role) {
    case "ld":
      return { canPublishEnterprise: true, canPublishDepartment: true, canRequest: true, canView: true, scopeNote: "L&D manages enterprise & department FAQs." };
    case "team_lead":
      return { canPublishEnterprise: false, canPublishDepartment: true, canRequest: true, canView: true, scopeNote: `You manage FAQs for ${department ?? "your department"}.` };
    case "group_head":
      return { canPublishEnterprise: false, canPublishDepartment: false, canRequest: true, canView: true, scopeNote: "You can view all FAQs and request new ones." };
    case "sysadmin":
      // Platform Administration is TECHNICAL-ONLY: no operational FAQ publishing
      // authority is granted by virtue of the technical role.
      return { canPublishEnterprise: false, canPublishDepartment: false, canRequest: true, canView: true, scopeNote: "Platform administration is technical-only — you can view FAQs and request answers, but not publish operational content." };
    default:
      return { canPublishEnterprise: false, canPublishDepartment: false, canRequest: true, canView: true, scopeNote: "You can view FAQs and request answers." };
  }
}