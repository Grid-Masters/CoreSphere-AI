export const currentUser = {
  name: "Adaeze Okafor",
  role: "Customer Experience Executive",
  department: "FHD",
  unit: "FHD Core",
  initials: "AO",
  email: "a.okafor@ubagroup.com",
};

export const departments = [
  { name: "FHD", units: ["FHD Core", "Containment", "Block Card"] },
  { name: "Inbound", units: [] },
  { name: "Multimedia", units: ["Email", "Live Chat"] },
  { name: "Social Media", units: [] },
  { name: "L&D", units: [] },
  { name: "QA", units: [] },
];

export type SOP = {
  id: string;
  title: string;
  category: string;
  theoryProgress: number;
  videoProgress: number;
  updated: string;
  status: "Approved" | "Pending Approval" | "Archived";
  department: string;
  summary: string;
};

export const sops: SOP[] = [
  { id: "sop-001", title: "Card Block & Unblock Process", category: "Cards Operations", theoryProgress: 80, videoProgress: 60, updated: "2026-05-02", status: "Approved", department: "FHD", summary: "End-to-end SOP for blocking and unblocking debit/credit cards including verification and audit trail." },
  { id: "sop-002", title: "Fraud Containment First Response", category: "Containment", theoryProgress: 55, videoProgress: 25, updated: "2026-04-21", status: "Approved", department: "FHD", summary: "First-response actions when suspicious activity is detected on a customer account." },
  { id: "sop-003", title: "Inbound Call Handling Standards", category: "Customer Service", theoryProgress: 100, videoProgress: 100, updated: "2026-03-18", status: "Approved", department: "Inbound", summary: "Quality and compliance standards for inbound voice interactions." },
  { id: "sop-004", title: "Email Response Quality Framework", category: "Multimedia", theoryProgress: 70, videoProgress: 40, updated: "2026-04-29", status: "Approved", department: "Multimedia", summary: "Tone, structure, SLA and compliance requirements for customer email responses." },
  { id: "sop-005", title: "Live Chat Escalation Matrix", category: "Multimedia", theoryProgress: 35, videoProgress: 15, updated: "2026-05-08", status: "Pending Approval", department: "Multimedia", summary: "Tiered escalation paths for live chat interactions across complaint categories." },
  { id: "sop-006", title: "Social Media Crisis Protocol", category: "Reputation", theoryProgress: 0, videoProgress: 0, updated: "2026-05-10", status: "Approved", department: "Social Media", summary: "Coordinated response protocol for reputational events on social channels." },
  { id: "sop-007", title: "AML Red Flag Identification", category: "Compliance", theoryProgress: 90, videoProgress: 80, updated: "2026-02-14", status: "Approved", department: "FHD", summary: "Indicators of money laundering, escalation procedure and regulatory reporting." },
  { id: "sop-008", title: "Dispute Resolution SLA Guide", category: "Operations", theoryProgress: 75, videoProgress: 45, updated: "2026-04-04", status: "Approved", department: "Inbound", summary: "Timelines, ownership and customer communication standards for transaction disputes." },
];

export function overallProgress(sop: Pick<SOP, "theoryProgress" | "videoProgress">) {
  return Math.round((sop.theoryProgress + sop.videoProgress) / 2);
}

export const announcements = [
  { id: 1, author: "Group Head, Customer Fulfilment", title: "FY2026 Service Excellence Charter", time: "2h ago", body: "Effective Monday, all customer-facing units will operate under the revised Service Excellence Charter. Team Leads to brief their teams before close of business Friday.", pinned: true },
  { id: 2, author: "Group Head, Operations", title: "Quarterly Operations Townhall", time: "1d ago", body: "Join the Q2 operations townhall this Thursday at 10:00 WAT. Mandatory for all supervisors and unit heads.", pinned: true },
  { id: 3, author: "Group Head, Risk", title: "Updated Fraud Containment Thresholds", time: "3d ago", body: "Containment thresholds have been recalibrated. Refer to SOP-002 for the updated decision matrix.", pinned: false },
];

export const memos = [
  { id: 1, title: "Mandatory AML Refresher — Cohort 7", category: "Compliance", expires: "2026-05-30", acknowledged: false },
  { id: 2, title: "System Maintenance: Core Banking", category: "IT Notice", expires: "2026-05-18", acknowledged: true },
  { id: 3, title: "Updated Block Card Decision Tree", category: "Operations", expires: "2026-06-15", acknowledged: false },
  { id: 4, title: "Quarterly Branch KPI Review", category: "Performance", expires: "2026-05-25", acknowledged: true },
];

export const teamLeadsOnDuty = [
  { name: "Chinedu Eze", department: "FHD Core", shift: "Morning (07:00–15:00)", status: "On Duty" },
  { name: "Bisola Ade", department: "Containment", shift: "Mid (11:00–19:00)", status: "On Break" },
  { name: "Tunde Bello", department: "Block Card", shift: "Evening (15:00–23:00)", status: "On Duty" },
];

export const qaScores = [
  { month: "Dec", score: 82 },
  { month: "Jan", score: 85 },
  { month: "Feb", score: 87 },
  { month: "Mar", score: 84 },
  { month: "Apr", score: 91 },
  { month: "May", score: 93 },
];

export const assessments = [
  { id: "as-1", title: "Weekly SOP Quiz — Card Operations", type: "Weekly", status: "Completed", score: 92, attempts: 1 },
  { id: "as-2", title: "Monthly L&D Assessment — Compliance", type: "Monthly", status: "Pending", score: null, attempts: 0 },
  { id: "as-3", title: "Weekly SOP Quiz — Containment", type: "Weekly", status: "Failed", score: 48, attempts: 2 },
  { id: "as-4", title: "Fraud Awareness Certification", type: "Monthly", status: "Locked", score: null, attempts: 2 },
  { id: "as-5", title: "Live Chat Tone & QA Standards", type: "Weekly", status: "Pending", score: null, attempts: 0 },
];

export const champions = [
  { label: "Champion of the Week", name: "Adaeze Okafor", detail: "FHD Core • 98% QA average" },
  { label: "Best QA Performer", name: "Ifeanyi Obi", detail: "Inbound • 96.4% scorecard" },
  { label: "Most Improved Staff", name: "Halima Yusuf", detail: "Multimedia • +14 pts this month" },
  { label: "SOP Compliance Champion", name: "Kelechi Nwosu", detail: "Containment • 100% completion" },
];

export const townhallSessions = [
  { id: 1, title: "FY2026 Strategy Townhall", category: "Strategy", duration: "48 min", date: "2026-04-12" },
  { id: 2, title: "Customer Experience Quarterly", category: "CX", duration: "32 min", date: "2026-03-22" },
  { id: 3, title: "Risk & Compliance Briefing", category: "Risk", duration: "26 min", date: "2026-03-05" },
  { id: 4, title: "Operations Excellence Awards", category: "Recognition", duration: "55 min", date: "2026-02-18" },
];

export const coachingThreads = [
  { id: "c1", coach: "Ngozi Umeh", role: "QA Officer", lastMessage: "Reviewed your call from yesterday — strong opening, work on hold etiquette.", time: "10:42", unread: 2 },
  { id: "c2", coach: "Femi Adebayo", role: "QA Officer", lastMessage: "Coaching session scheduled for Friday 14:00.", time: "Yesterday", unread: 0 },
  { id: "c3", coach: "Aisha Bello", role: "Senior QA", lastMessage: "Please acknowledge your April scorecard.", time: "Mon", unread: 1 },
];

export type BankPromotion = {
  id: string;
  category: "Product" | "News" | "Campaign";
  title: string;
  tagline: string;
  cta: string;
};

export const bankPromotions: BankPromotion[] = [
  { id: "p1", category: "Product", title: "UBA LEO — Your AI Banker", tagline: "Bank by chat 24/7 on WhatsApp, Facebook & Apple Business Chat.", cta: "Discover LEO" },
  { id: "p2", category: "News", title: "UBA Wins Best Digital Bank — Africa 2026", tagline: "Recognised at the Global Finance Awards for digital innovation.", cta: "Read story" },
  { id: "p3", category: "Product", title: "NextGen Account", tagline: "Zero-balance account built for students & first jobbers across Africa.", cta: "Open account" },
  { id: "p4", category: "Campaign", title: "Wise Savers Promo", tagline: "Save ₦50k monthly for 6 months and win up to ₦5M in cash prizes.", cta: "Join promo" },
  { id: "p5", category: "Product", title: "U-Mobile 4.0", tagline: "Faster transfers, biometric login and instant card controls.", cta: "Update app" },
  { id: "p6", category: "News", title: "UBA Expands to Saudi Arabia", tagline: "New representative office opens in Riyadh — strengthening trade corridors.", cta: "Press release" },
];

export type TickerItem = {
  id: string;
  kind: "deadline" | "assessment" | "memo" | "announcement";
  text: string;
  from: string;
  due?: string;
  href: "/assessments" | "/memos" | "/leadership" | "/knowledge-hub";
};

export const tickerItems: TickerItem[] = [
  { id: "t1", kind: "assessment", text: "Monthly L&D Assessment — Compliance is pending", from: "L&D", due: "Today", href: "/assessments" },
  { id: "t2", kind: "deadline", text: "Live Chat Tone & QA Standards quiz due", from: "QA", due: "Fri", href: "/assessments" },
  { id: "t3", kind: "memo", text: "Acknowledge: Mandatory AML Refresher — Cohort 7", from: "Compliance", due: "May 30", href: "/memos" },
  { id: "t4", kind: "announcement", text: "FY2026 Service Excellence Charter is live", from: "Group Head, Customer Fulfilment", href: "/leadership" },
  { id: "t5", kind: "memo", text: "Acknowledge: Updated Block Card Decision Tree", from: "Operations", due: "Jun 15", href: "/memos" },
  { id: "t6", kind: "announcement", text: "Q2 Operations Townhall — Thursday 10:00 WAT", from: "Group Head, Operations", href: "/leadership" },
];