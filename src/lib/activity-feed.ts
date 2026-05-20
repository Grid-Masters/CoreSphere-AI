export type ActivityKind =
  | "sop"
  | "fraud"
  | "product"
  | "assessment"
  | "compliance"
  | "coaching"
  | "audit"
  | "broadcast";

export type ActivityEvent = {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  actor: string;
  timeAgo: string;
  emphasis?: boolean;
};

export const seedActivity: ActivityEvent[] = [
  { id: "a1", kind: "fraud", title: "Fraud advisory issued", detail: "SIM-swap voice impersonation — all channels", actor: "Risk Ops", timeAgo: "2 min ago", emphasis: true },
  { id: "a2", kind: "sop", title: "SOP Updated — Card Block v3.2", detail: "Approved by Unit Head • Published by L&D", actor: "Chioma Paul", timeAgo: "12 min ago" },
  { id: "a3", kind: "assessment", title: "Team completed monthly assessment", detail: "FHD — 92% pass rate", actor: "Sani Eze", timeAgo: "28 min ago" },
  { id: "a4", kind: "coaching", title: "QA coaching completed", detail: "Adaeze Okafor — score 94%", actor: "Daniel Obi", timeAgo: "44 min ago" },
  { id: "a5", kind: "product", title: "Product update released", detail: "UBA Prestige Visa — fee changes", actor: "Product Ops", timeAgo: "1 hr ago" },
  { id: "a6", kind: "compliance", title: "Compliance deadline reminder", detail: "KYC Refresher due May 31 — 18 staff outstanding", actor: "Compliance", timeAgo: "1 hr ago" },
  { id: "a7", kind: "audit", title: "Monthly audit closed", detail: "Inbound — 112 audits, 4 flags raised", actor: "Rita Adeyemi", timeAgo: "2 hr ago" },
  { id: "a8", kind: "broadcast", title: "Group Head broadcast", detail: "Q2 service standards reminder", actor: "Aliyu Yusuf", timeAgo: "3 hr ago" },
];

// Pool used to simulate new live events.
export const liveEventPool: Omit<ActivityEvent, "id" | "timeAgo">[] = [
  { kind: "fraud", title: "New fraud pattern flagged", detail: "USSD reversal fraud — 4 cases this morning", actor: "Risk Ops", emphasis: true },
  { kind: "compliance", title: "Acknowledgement reminder", detail: "6 staff have not acknowledged fraud advisory", actor: "Compliance" },
  { kind: "sop", title: "SOP scheduled for review", detail: "Account Reactivation — review due Friday", actor: "L&D" },
  { kind: "coaching", title: "Coaching session scheduled", detail: "Tunde Aina • 16:30 today", actor: "Rita Adeyemi" },
  { kind: "product", title: "Product memo published", detail: "Diaspora Account — KYC step updated", actor: "Product Ops" },
  { kind: "audit", title: "QA spot-check started", detail: "Multimedia — 8 chats sampled", actor: "Daniel Obi" },
  { kind: "assessment", title: "Assessment unlocked", detail: "Live Chat Tone — May edition", actor: "L&D" },
];