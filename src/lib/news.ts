import managementCover from "@/assets/news/management.jpg";
import productCover from "@/assets/news/product.jpg";
import fraudCover from "@/assets/news/fraud.jpg";
import learningCover from "@/assets/news/learning.jpg";
import complianceCover from "@/assets/news/compliance.jpg";
import spotlightCover from "@/assets/news/spotlight.jpg";
import eventCover from "@/assets/news/event.jpg";
import operationsCover from "@/assets/news/operations.jpg";

export type NewsPriority = "Critical" | "Important" | "Info";

/** CoreSphere Pulse Feed intelligence categories. */
export type NewsCategory =
  | "Product Updates"
  | "Fraud Alerts"
  | "Compliance Notices"
  | "SOP Updates"
  | "L&D Communications"
  | "Group Head Announcements"
  | "Townhall Broadcasts";

export const newsCategories: NewsCategory[] = [
  "Product Updates",
  "Fraud Alerts",
  "Compliance Notices",
  "SOP Updates",
  "L&D Communications",
  "Group Head Announcements",
  "Townhall Broadcasts",
];

export type NewsItem = {
  id: string;
  title: string;
  body: string;
  category: NewsCategory;
  priority: NewsPriority;
  departmentTag: string;
  timestamp: string; // human-friendly
  publishedOn: string; // formatted date
  author: string;
  authorRole: string;
  image: string;
  requiresAck?: boolean;
  pinned?: boolean;
};

/** Default cover per category (used as a fallback). */
export function coverFor(category: NewsCategory): string {
  switch (category) {
    case "Group Head Announcements":
    case "Townhall Broadcasts":
      return managementCover;
    case "Product Updates":
      return productCover;
    case "Fraud Alerts":
      return fraudCover;
    case "Compliance Notices":
      return complianceCover;
    case "L&D Communications":
      return learningCover;
    case "SOP Updates":
      return operationsCover;
    default:
      return managementCover;
  }
}

export const newsItems: NewsItem[] = [
  {
    id: "n1",
    title: "Group MD addresses staff on FY2026 strategic priorities",
    body: "In a message to all employees, the Group Managing Director outlined the bank's FY2026 focus on customer-led digital transformation, operational excellence and a stronger compliance culture across all subsidiaries.",
    category: "Group Head Announcements",
    priority: "Important",
    departmentTag: "Group-wide",
    timestamp: "1h ago",
    publishedOn: "3 Jun 2026",
    author: "Office of the GMD",
    authorRole: "Executive Communications",
    image: managementCover,
    pinned: true,
  },
  {
    id: "n2",
    title: "UBA LEO 4.0 goes live — conversational banking on Apple Business Chat",
    body: "Customers can now bank with LEO directly inside iMessage. CEEs should reference the LEO 4.0 SOP when handling related enquiries and highlight the new self-service journeys to customers.",
    category: "Product Updates",
    priority: "Important",
    departmentTag: "FHD • Inbound • Multimedia",
    timestamp: "3h ago",
    publishedOn: "3 Jun 2026",
    author: "Digital Banking",
    authorRole: "Product Office",
    image: productCover,
    pinned: true,
  },
  {
    id: "n3",
    title: "Fraud Alert: New OTP-harvesting SIM swap pattern detected",
    body: "Customers calling about delayed OTPs must follow the updated SIM swap verification matrix. Escalate any pattern match to the Fraud Desk within 5 minutes.",
    category: "Compliance & Risk",
    priority: "Critical",
    departmentTag: "All Operations",
    timestamp: "5h ago",
    publishedOn: "3 Jun 2026",
    author: "Fraud & Forensics",
    authorRole: "Risk Management",
    image: fraudCover,
    requiresAck: true,
  },
  {
    id: "n4",
    title: "CBN circular on customer identification — effective Jun 1",
    body: "Updated KYC verification scripts have been published in the Knowledge Hub. All customer-facing staff must acknowledge the revised procedure before their next shift.",
    category: "Compliance & Risk",
    priority: "Critical",
    departmentTag: "All Operations",
    timestamp: "6h ago",
    publishedOn: "2 Jun 2026",
    author: "Compliance",
    authorRole: "Regulatory Affairs",
    image: complianceCover,
    requiresAck: true,
  },
  {
    id: "n5",
    title: "Card issuance batch delay (Lagos & Port Harcourt)",
    body: "Customers may experience a 24h delay on new card delivery. Use the approved holding script and log SLA breach reasons accurately in the CRM.",
    category: "SOP Updates",
    priority: "Important",
    departmentTag: "Inbound • FHD",
    timestamp: "Today",
    publishedOn: "3 Jun 2026",
    author: "Card Operations",
    authorRole: "Operations",
    image: operationsCover,
  },
  {
    id: "n6",
    title: "New training: Advanced Fraud Detection masterclass now live",
    body: "A four-module video series on emerging fraud typologies is now available in the Knowledge Hub. L&D recommends completion within two weeks for all customer-facing teams.",
    category: "Lcategory: "Learning & Development"D Communications",
    priority: "Info",
    departmentTag: "All Operations",
    timestamp: "Yesterday",
    publishedOn: "2 Jun 2026",
    author: "Learning & Development",
    authorRole: "L&D Academy",
    image: learningCover,
  },
  {
    id: "n7",
    title: "Employee Spotlight: Inbound team hits record 91% FCR",
    body: "Congratulations to the Inbound Contact Centre team for achieving the highest first-call resolution rate in the bank's history this quarter. A model of operational excellence.",
    category: "Group Head Announcements",
    priority: "Info",
    departmentTag: "Inbound",
    timestamp: "Yesterday",
    publishedOn: "2 Jun 2026",
    author: "People & Culture",
    authorRole: "HR Communications",
    image: spotlightCover,
  },
  {
    id: "n8",
    title: "FY2026 Operations Townhall — Thursday 10:00 WAT",
    body: "The Group Head, Customer Fulfilment will present the FY2026 operational priorities. Attendance is mandatory for all Customer Experience Executives.",
    category: "Townhall Broadcasts",
    priority: "Important",
    departmentTag: "Group-wide",
    timestamp: "2d ago",
    publishedOn: "1 Jun 2026",
    author: "Office of the Group Head",
    authorRole: "Customer Fulfilment",
    image: eventCover,
  },
  {
    id: "n9",
    title: "Wise Savers Promo — Phase 2 starts Monday",
    body: "Phase 2 unlocks ₦5M in additional prizes. Refer eligible customers to the campaign micro-site and log referrals in the CRM to support the bank's deposit mobilisation drive.",
    category: "Product Updates",
    priority: "Info",
    departmentTag: "All Operations",
    timestamp: "2d ago",
    publishedOn: "1 Jun 2026",
    author: "Marketing",
    authorRole: "Brand & Communications",
    image: managementCover,
  },
  {
    id: "n10",
    title: "First-call resolution standard raised to 86%",
    body: "Effective this month, QA scorecards will weight FCR adherence at 20%. Review the updated QA rubric in Performance Intelligence and brief your teams accordingly.",
    category: "SOP Updates",
    priority: "Important",
    departmentTag: "All Operations",
    timestamp: "3d ago",
    publishedOn: "31 May 2026",
    author: "Quality Assurance",
    authorRole: "Service Quality",
    image: operationsCover,
  },
  {
    id: "n11",
    title: "NextGen Account onboarding journey simplified",
    body: "A streamlined three-screen onboarding is now live across all channels. Refresh your product knowledge in the Knowledge Hub to support customers through the new journey.",
    category: "Product Updates",
    priority: "Info",
    departmentTag: "FHD • Social Media",
    timestamp: "3d ago",
    publishedOn: "31 May 2026",
    author: "Digital Banking",
    authorRole: "Product Office",
    image: productCover,
  },
  {
    id: "n12",
    title: "Innovation: AI co-pilot pilot launches for contact centre",
    body: "Selected agents will trial CoreSphere AI's real-time call assist during June. Feedback gathered will shape the enterprise-wide rollout in Q3.",
    category: "Product Updates",
    priority: "Info",
    departmentTag: "Group-wide",
    timestamp: "4d ago",
    publishedOn: "30 May 2026",
    author: "Innovation Office",
    authorRole: "Strategy & Transformation",
    image: managementCover,
  },
];