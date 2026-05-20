import type { Role } from "@/lib/directory";

export type WorkflowPriority = "Critical" | "High" | "Normal";
export type WorkflowStatus = "Pending" | "In Progress" | "Overdue" | "Done";

export type WorkflowTask = {
  id: string;
  title: string;
  detail?: string;
  due: string;
  priority: WorkflowPriority;
  status: WorkflowStatus;
  cta: string;
  href?: string;
};

const staff: WorkflowTask[] = [
  { id: "s1", title: "Complete KYC Refresher SOP", detail: "Mandatory annual refresh — Compliance", due: "Today, 5:00 PM", priority: "Critical", status: "In Progress", cta: "Resume SOP", href: "/knowledge-hub" },
  { id: "s2", title: "Review Fraud Escalation Update", detail: "New typology: SIM-swap voice impersonation", due: "Today", priority: "Critical", status: "Pending", cta: "Read & Acknowledge", href: "/memos" },
  { id: "s3", title: "Acknowledge QA Coaching", detail: "Feedback from your QA Team Lead", due: "Tomorrow", priority: "High", status: "Pending", cta: "Open Coaching", href: "/qa-coaching" },
  { id: "s4", title: "Finish Monthly Assessment", detail: "May 2026 — Service Excellence", due: "Fri, May 22", priority: "High", status: "In Progress", cta: "Continue", href: "/assessments" },
  { id: "s5", title: "Review Product Update", detail: "UBA Prestige Visa — fee changes", due: "Next Mon", priority: "Normal", status: "Pending", cta: "View Update", href: "/memos" },
  { id: "s6", title: "Watch new training video", detail: "Live Chat Tone Mastery — 8 min", due: "This week", priority: "Normal", status: "Pending", cta: "Watch", href: "/knowledge-hub" },
];

const qa: WorkflowTask[] = [
  { id: "q1", title: "6 Pending Evaluations", detail: "Voice + Live Chat — backlog from yesterday's shift", due: "Today", priority: "Critical", status: "Overdue", cta: "Open Queue", href: "/qa-coaching" },
  { id: "q2", title: "3 Coaching Sessions Scheduled", detail: "11:30, 14:00, 16:30 — assigned staff", due: "Today", priority: "High", status: "Pending", cta: "View Calendar", href: "/qa-coaching" },
  { id: "q3", title: "2 Compliance Flags Raised", detail: "AML disclosure missing on 2 calls", due: "Today", priority: "Critical", status: "In Progress", cta: "Review Flags", href: "/qa-coaching" },
  { id: "q4", title: "4 Staff Awaiting Review", detail: "Monthly scorecard sign-off pending", due: "Wed", priority: "High", status: "Pending", cta: "Score Staff", href: "/qa-coaching" },
  { id: "q5", title: "Monthly Audit Progress", detail: "78 of 112 audits completed (70%)", due: "May 31", priority: "Normal", status: "In Progress", cta: "Continue Audit", href: "/qa-coaching" },
  { id: "q6", title: "Pending Coaching Acknowledgements", detail: "3 staff have not acknowledged last session", due: "Today", priority: "High", status: "Pending", cta: "Send Reminder" },
];

const teamLead: WorkflowTask[] = [
  { id: "t1", title: "4 Staff Pending SOP Completion", detail: "KYC Refresher — overdue cohort in your unit", due: "Today", priority: "Critical", status: "Overdue", cta: "View Cohort" },
  { id: "t2", title: "2 Escalated Complaints", detail: "Awaiting your routing decision", due: "Today, 2:00 PM", priority: "Critical", status: "Pending", cta: "Triage" },
  { id: "t3", title: "SLA Warning Detected", detail: "Avg handle time +18% above target this week", due: "This week", priority: "High", status: "In Progress", cta: "Open Insight" },
  { id: "t4", title: "Compliance Follow-Up Needed", detail: "Unresolved audit finding from QA", due: "Wed", priority: "High", status: "Pending", cta: "Resolve" },
  { id: "t5", title: "Team Assessment Performance Review", detail: "May scorecards ready to review", due: "Fri", priority: "Normal", status: "Pending", cta: "Open Scorecards", href: "/performance-intelligence" },
  { id: "t6", title: "Staff Completion Monitoring", detail: "2 staff below 60% completion threshold", due: "Ongoing", priority: "High", status: "In Progress", cta: "Open Roster" },
];

const ld: WorkflowTask[] = [
  { id: "l1", title: "Pending SOP Approval", detail: "3 SOPs awaiting Unit Head sign-off", due: "Today", priority: "High", status: "Pending", cta: "Open Pipeline", href: "/knowledge-hub" },
  { id: "l2", title: "New Video Training Upload", detail: "Live Chat Tone Mastery — finalise & publish", due: "Today", priority: "Normal", status: "In Progress", cta: "Continue Upload" },
  { id: "l3", title: "Monthly Assessment Rollout", detail: "May assessments scheduled to publish Friday", due: "Fri", priority: "High", status: "Pending", cta: "Review Draft", href: "/assessments" },
  { id: "l4", title: "Staff Completion Analytics", detail: "Cross-department dip detected in Multimedia", due: "Today", priority: "High", status: "Pending", cta: "Open Analytics", href: "/analytics" },
  { id: "l5", title: "Knowledge Gap Detection", detail: "12 failed searches — no SOP coverage", due: "This week", priority: "High", status: "Pending", cta: "Review Gaps" },
  { id: "l6", title: "Content Review Reminder", detail: "8 SOPs over 90 days since last review", due: "Next week", priority: "Normal", status: "Pending", cta: "Schedule Review" },
];

const groupHead: WorkflowTask[] = [
  { id: "g1", title: "Enterprise Compliance Review", detail: "Monthly board pack — sign-off required", due: "Wed", priority: "Critical", status: "Pending", cta: "Open Pack" },
  { id: "g2", title: "Lowest Performing Department", detail: "Social Media — QA 84%, completion 69%", due: "Today", priority: "High", status: "Pending", cta: "Drill-down" },
  { id: "g3", title: "Training Completion Drop", detail: "Multimedia: −9pts WoW", due: "Today", priority: "High", status: "Pending", cta: "Investigate" },
  { id: "g4", title: "SLA Risk Detection", detail: "FHD breach risk: 3 cases in red zone", due: "Today", priority: "Critical", status: "In Progress", cta: "Open SLA Board" },
  { id: "g5", title: "Fraud Escalation Spike", detail: "+22% escalations vs 7-day baseline", due: "Today", priority: "Critical", status: "In Progress", cta: "View Threat Map" },
  { id: "g6", title: "Operational Risk Alert", detail: "Card services SOP drift — 2 versions behind", due: "Today", priority: "High", status: "Pending", cta: "Review Drift" },
];

export function getWorkflowFor(role: Role): WorkflowTask[] {
  switch (role) {
    case "qa": return qa;
    case "team_lead": return teamLead;
    case "ld": return ld;
    case "group_head":
    case "sysadmin": return groupHead;
    case "staff":
    default: return staff;
  }
}