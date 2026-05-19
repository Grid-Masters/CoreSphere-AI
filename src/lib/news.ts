export type NewsPriority = "Critical" | "Important" | "Info";
export type NewsCategory =
  | "Product"
  | "Service Update"
  | "Fraud Bulletin"
  | "Regulatory"
  | "Internal Ops"
  | "Campaign"
  | "CX Update";

export type NewsItem = {
  id: string;
  title: string;
  body: string;
  category: NewsCategory;
  priority: NewsPriority;
  departmentTag: string;
  timestamp: string; // human-friendly
  pinned?: boolean;
};

export const newsItems: NewsItem[] = [
  {
    id: "n1",
    title: "Fraud Alert: New OTP-harvesting SIM swap pattern detected",
    body: "Customers calling about delayed OTPs must follow the updated SIM swap verification matrix. Escalate any pattern match to the Fraud Desk within 5 minutes.",
    category: "Fraud Bulletin",
    priority: "Critical",
    departmentTag: "All Operations",
    timestamp: "1h ago",
    pinned: true,
  },
  {
    id: "n2",
    title: "UBA LEO 4.0 rolling out — chat banking on Apple Business Chat",
    body: "Customers can now bank with LEO directly inside iMessage. CEEs should reference the LEO 4.0 SOP when handling related enquiries.",
    category: "Product",
    priority: "Important",
    departmentTag: "FHD • Inbound • Multimedia",
    timestamp: "3h ago",
    pinned: true,
  },
  {
    id: "n3",
    title: "Regulatory: CBN circular on customer identification — effective Jun 1",
    body: "Updated KYC verification scripts have been published in the Knowledge Hub. Acknowledge before your next shift.",
    category: "Regulatory",
    priority: "Critical",
    departmentTag: "All Operations",
    timestamp: "6h ago",
  },
  {
    id: "n4",
    title: "Service Update: Card issuance batch delay (Lagos & PH)",
    body: "Customers may experience a 24h delay on new card delivery. Use the approved holding script and log SLA breach reasons accurately.",
    category: "Service Update",
    priority: "Important",
    departmentTag: "Inbound • FHD",
    timestamp: "Today",
  },
  {
    id: "n5",
    title: "Campaign: Wise Savers Promo — Phase 2 starts Monday",
    body: "Phase 2 unlocks ₦5M in additional prizes. Refer eligible customers to the campaign micro-site and log referrals in the CRM.",
    category: "Campaign",
    priority: "Info",
    departmentTag: "All Operations",
    timestamp: "Yesterday",
  },
  {
    id: "n6",
    title: "CX: First-call resolution standard raised to 86%",
    body: "Effective this month. QA scorecards will weight FCR adherence at 20%. Review the updated QA rubric in Performance Intelligence.",
    category: "CX Update",
    priority: "Important",
    departmentTag: "All Operations",
    timestamp: "2d ago",
  },
  {
    id: "n7",
    title: "Internal Ops: Townhall rescheduled to Thursday 10:00 WAT",
    body: "Group Head, Customer Fulfilment will present the FY2026 operational priorities. Attendance is mandatory for all CEEs.",
    category: "Internal Ops",
    priority: "Important",
    departmentTag: "All Operations",
    timestamp: "2d ago",
  },
  {
    id: "n8",
    title: "Product: NextGen Account onboarding journey simplified",
    body: "Three-screen onboarding now live across all channels. Refresh your knowledge in the Knowledge Hub.",
    category: "Product",
    priority: "Info",
    departmentTag: "FHD • Social Media",
    timestamp: "3d ago",
  },
  {
    id: "n9",
    title: "Fraud Bulletin: Cloned merchant POS scheme in South-West",
    body: "Brief customers on tap-and-go safeguards. Any reported pattern must be flagged to the Fraud Desk via the standard template.",
    category: "Fraud Bulletin",
    priority: "Critical",
    departmentTag: "All Operations",
    timestamp: "4d ago",
  },
  {
    id: "n10",
    title: "Service Update: USSD downtime window — Sat 02:00–04:00 WAT",
    body: "Planned maintenance. Use the standard customer holding statement if calls come in during this window.",
    category: "Service Update",
    priority: "Info",
    departmentTag: "Inbound",
    timestamp: "4d ago",
  },
];