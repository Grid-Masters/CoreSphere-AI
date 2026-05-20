export type OperationalScenario = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "High" | "Watch";
  recommended: string[];
  escalation: string;
};

export const scenarios: OperationalScenario[] = [
  {
    id: "sc1",
    title: "Failed Transfer Spike",
    detail: "NIP transfer failures +37% in the last 30 minutes — switch partner timeout suspected.",
    severity: "Critical",
    recommended: [
      "Activate failed-transfer SOP v2.4",
      "Route impacted complaints to dedicated queue",
      "Push customer holding message via Multimedia",
    ],
    escalation: "Notify Channels Ops + Group Head within 15 minutes.",
  },
  {
    id: "sc2",
    title: "Fraud Escalation Surge",
    detail: "Voice impersonation reports +22% above baseline — likely coordinated attempt.",
    severity: "Critical",
    recommended: [
      "Apply SIM-swap verification fallback",
      "Force re-authentication on flagged accounts",
      "Acknowledge fraud advisory before next call",
    ],
    escalation: "Engage Fraud Risk + Compliance lead immediately.",
  },
  {
    id: "sc3",
    title: "Product Outage Alert",
    detail: "USSD *919# degraded service in 3 regions.",
    severity: "High",
    recommended: [
      "Use approved outage talk-track",
      "Log incidents under outage tag",
      "Direct customers to mobile app fallback",
    ],
    escalation: "Channels Engineering already engaged — monitor.",
  },
  {
    id: "sc4",
    title: "Compliance Deadline Warning",
    detail: "KYC Refresher: 18 staff outstanding with 3 days to deadline.",
    severity: "High",
    recommended: [
      "Send reminder to outstanding cohort",
      "Block non-compliant accounts from sensitive workflows",
      "Schedule make-up session with L&D",
    ],
    escalation: "Team Leads must close gap before May 31.",
  },
  {
    id: "sc5",
    title: "SLA Breach Risk",
    detail: "FHD average handle time tracking +18% above SLA target this week.",
    severity: "Watch",
    recommended: [
      "Pull short coaching huddle on call control",
      "Audit top-5 longest interactions for root cause",
      "Temporarily redistribute queue priority",
    ],
    escalation: "FHD Team Lead — review and report at end of shift.",
  },
  {
    id: "sc6",
    title: "High Complaint Volume Alert",
    detail: "Multimedia channel complaints +44% in last hour.",
    severity: "High",
    recommended: [
      "Open auxiliary chat queue",
      "Switch to template-assisted responses",
      "Notify Product Ops if pattern persists 30 min",
    ],
    escalation: "Escalate to Group Head if volume sustains.",
  },
];