// ============================================================================
// Product Knowledge — an Enterprise Knowledge Hub asset type
// Tile → Catalogue → Detail structure with governance + analytics metadata.
// This is the authoritative product knowledge model used by the Enterprise
// Knowledge Hub, Enterprise Search, CoreSphere AI, and Analytics. No separate
// "Product Intelligence" index exists — everything lives here.
// ============================================================================

import {
  Wallet, CreditCard, HandCoins, Bot, Smartphone, Globe, Hash, Store,
  Building2, Users, LineChart, Ship, ShoppingBag, Calculator, Plane, Languages,
} from "lucide-react";

export type ProductVersion = { version: string; date: string; note: string };

export type ProductDetail = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  tagline: string;
  overview: string;
  theory: string;
  talkingPoints: string[];
  workflow: string[];
  eligibility: string[];
  fees: { label: string; value: string }[];
  exceptions: string[];
  escalation: string[];
  relatedSops: string[];
  relatedPolicies: string[];
  relatedFaqs: string[];
  relatedAssessments: string[];
  videos: { title: string; duration: string }[];
  quickReference: string[];
  owner: string;
  status: "Approved" | "Pending Approval";
  version: string;
  versionHistory: ProductVersion[];
  lastReview: string;
  nextReview: string;
  tags: string[];
  // analytics
  views: number;
  searches: number;
  aiQueries: number;
  escalations: number;
  completion: number;
};

export type ProductTile = {
  id: string;
  name: string;
  description: string;
  icon: any;
  gradient: string;
  items: ProductDetail[];
};

// Deterministic pseudo-metrics so analytics stay stable across renders.
function seed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
function metric(id: string, min: number, max: number, salt = ""): number {
  const s = seed(id + salt);
  return min + (s % (max - min + 1));
}

type Override = Partial<ProductDetail>;

function makeItem(
  categoryId: string,
  categoryName: string,
  name: string,
  over: Override = {},
): ProductDetail {
  const id = `${categoryId}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
  const reviewMonths = metric(id, 0, 11, "rev");
  const lastReview = `2026-${String(1 + (reviewMonths % 6)).padStart(2, "0")}-${String(1 + (seed(id) % 27)).padStart(2, "0")}`;
  const nextReview = `2026-${String(7 + (reviewMonths % 6)).padStart(2, "0")}-${String(1 + (seed(id) % 27)).padStart(2, "0")}`;
  return {
    id,
    name,
    categoryId,
    categoryName,
    tagline: over.tagline ?? `${name} — verified product knowledge`,
    overview:
      over.overview ??
      `${name} within UBA ${categoryName}. Approved reference covering how the product works, who it serves, and how first-line teams support customers accurately and compliantly.`,
    theory:
      over.theory ??
      `${name} is part of UBA's ${categoryName} proposition. Understand the underlying banking principle, the customer need it solves, the channels it is delivered through, and how it interacts with related products across the group.`,
    talkingPoints: over.talkingPoints ?? [
      `Explain ${name} benefits in plain, reassuring language`,
      "Confirm eligibility before making any commitment",
      "Never request full PAN, PIN, password or OTP",
      "Set clear expectations on timelines and charges",
    ],
    workflow: over.workflow ?? [
      "Verify customer identity per authentication policy",
      `Confirm the ${name} request and current account status`,
      "Action within approved limits or route to the correct unit",
      "Log the interaction and confirm resolution with the customer",
    ],
    eligibility: over.eligibility ?? [
      "Active UBA customer with valid KYC and BVN",
      "Account in good standing (no restrictions)",
      "Meets product-specific criteria",
    ],
    fees: over.fees ?? [
      { label: "Setup / Issuance", value: "Per approved tariff" },
      { label: "Maintenance", value: "As disclosed to customer" },
      { label: "Transaction charges", value: "CBN-compliant rates" },
    ],
    exceptions: over.exceptions ?? [
      "Restricted or PND accounts require containment clearance",
      "Non-standard requests require supervisor authorisation",
    ],
    escalation: over.escalation ?? [
      `${name} disputes → Inbound → Operations`,
      "Suspected fraud → FHD Containment",
    ],
    relatedSops: over.relatedSops ?? ["Customer Authentication Fallback", "KYC Refresher"],
    relatedPolicies: over.relatedPolicies ?? ["Data Privacy Policy", "AML / CFT Policy"],
    relatedFaqs: over.relatedFaqs ?? [`How do I support a ${name} request?`],
    relatedAssessments: over.relatedAssessments ?? ["Service Excellence Monthly"],
    videos: over.videos ?? [{ title: `${name} Essentials`, duration: "6:20" }],
    quickReference: over.quickReference ?? [
      `Confirm identity → verify status → action ${name} → log`,
      "Escalate anything outside first-line authority",
    ],
    owner: over.owner ?? "Customer Fulfilment Group — L&D",
    status: over.status ?? "Approved",
    version: over.version ?? `v${1 + (seed(id) % 3)}.${seed(id) % 6}`,
    versionHistory: over.versionHistory ?? [
      { version: "v1.0", date: "2025-09-14", note: "Initial approved publication (maker-checker)" },
      { version: `v${1 + (seed(id) % 3)}.${seed(id) % 6}`, date: lastReview, note: "Reviewed and re-approved" },
    ],
    lastReview: over.lastReview ?? lastReview,
    nextReview: over.nextReview ?? nextReview,
    tags: over.tags ?? [categoryName.toLowerCase(), "product knowledge"],
    views: over.views ?? metric(id, 120, 4200, "v"),
    searches: over.searches ?? metric(id, 20, 900, "s"),
    aiQueries: over.aiQueries ?? metric(id, 10, 700, "ai"),
    escalations: over.escalations ?? metric(id, 0, 60, "esc"),
    completion: over.completion ?? metric(id, 42, 99, "c"),
  };
}

function tile(
  id: string,
  name: string,
  icon: any,
  gradient: string,
  description: string,
  items: (string | [string, Override])[],
): ProductTile {
  return {
    id,
    name,
    icon,
    gradient,
    description,
    items: items.map((it) =>
      Array.isArray(it) ? makeItem(id, name, it[0], it[1]) : makeItem(id, name, it),
    ),
  };
}

export const PRODUCT_TILES: ProductTile[] = [
  tile("accounts", "Accounts", Wallet, "from-sky-600 via-blue-700 to-indigo-800",
    "Savings, current and specialised deposit accounts across segments.",
    ["Savings Account", "Current Account", "Domiciliary Account", "Salary Account", "Kiddies & Teens Account", "Fixed Deposit", "Zero Balance Account"]),
  tile("cards", "Cards", CreditCard, "from-rose-600 via-red-700 to-rose-900",
    "Debit, credit, prepaid and virtual cards across all schemes.",
    ["Debit Cards", "Credit Cards", "Prepaid Cards", "Virtual Cards", "Visa", "Mastercard", "Verve", "Card Replacement", "PIN Management", "Card Limits", "Card Charges", "Card Disputes", "Chargeback", "Security Features"]),
  tile("loans", "Loans", HandCoins, "from-emerald-600 via-teal-700 to-slate-800",
    "Personal, salary-based and asset financing products.",
    ["Click Credit", "Personal Loan", "Salary Advance", "Asset Finance", "Overdraft", "SME Loan", "Repayment & Restructuring"]),
  tile("leo", "LEO", Bot, "from-fuchsia-600 via-purple-700 to-indigo-800",
    "UBA's AI chat-banking assistant across messaging channels.",
    ["Leo Onboarding", "Transfers on Leo", "Balance & Statements", "Airtime & Bills", "Leo Security", "Troubleshooting Leo"]),
  tile("mobile", "Mobile Banking", Smartphone, "from-cyan-600 via-blue-700 to-slate-800",
    "Full-service mobile app for everyday banking.",
    ["App Onboarding", "Transfers", "Card Controls", "Bill Payments", "Biometric Login", "Device Change", "App Troubleshooting"]),
  tile("internet", "Internet Banking", Globe, "from-indigo-600 via-blue-800 to-slate-900",
    "Web banking for retail and business customers.",
    ["Retail Internet Banking", "Business Internet Banking", "Bulk Payments", "e-Statements", "Token Management", "Beneficiary Management"]),
  tile("ussd", "USSD (*919#)", Hash, "from-amber-500 via-orange-600 to-red-700",
    "No-data quick banking via the *919# short code.",
    ["USSD Registration", "USSD Transfers", "Airtime via USSD", "Balance Enquiry", "USSD PIN Reset", "USSD Security"]),
  tile("sme", "SME Banking", Store, "from-lime-600 via-emerald-700 to-teal-900",
    "Accounts, lending and tools for small and medium enterprises.",
    ["SME Current Account", "SME Lending", "Collections & POS", "Business Advisory", "Payroll Services"]),
  tile("corporate", "Corporate Banking", Building2, "from-slate-700 via-slate-800 to-zinc-900",
    "Transaction banking and coverage for large corporates.",
    ["Cash Management", "Host-to-Host Integration", "Corporate Mandates", "Liquidity Management", "Escrow Services"]),
  tile("agency", "Agency Banking", Users, "from-orange-600 via-amber-700 to-yellow-900",
    "MONI agent network delivering banking to underserved areas.",
    ["Agent Onboarding", "Cash-In / Cash-Out", "Agent Commissions", "Agent Float Management", "Agent Disputes"]),
  tile("treasury", "Treasury", LineChart, "from-teal-600 via-cyan-800 to-blue-900",
    "FX, money market and investment products.",
    ["Foreign Exchange", "Treasury Bills", "Money Market", "Bonds", "Investment Advisory"]),
  tile("trade", "Trade Finance", Ship, "from-blue-700 via-indigo-800 to-slate-900",
    "Letters of credit, guarantees and trade services.",
    ["Letters of Credit", "Bank Guarantees", "Bills for Collection", "Import Finance", "Export Finance", "Form M & NXP"]),
  tile("merchant", "Merchant Services", ShoppingBag, "from-rose-600 via-pink-700 to-purple-900",
    "Payment acceptance and settlement for businesses.",
    ["Merchant Onboarding", "Payment Gateway", "Settlement", "Merchant Disputes", "QR Payments"]),
  tile("pos", "POS", Calculator, "from-red-600 via-rose-700 to-slate-900",
    "Point-of-sale terminals and acquiring services.",
    ["POS Request", "POS Activation", "POS Settlement", "POS Faults", "POS Charges", "POS Reconciliation"]),
  tile("diaspora", "Diaspora Banking", Plane, "from-violet-600 via-purple-800 to-slate-900",
    "Banking for Nigerians and Africans abroad.",
    ["Diaspora Account Opening", "Remittances", "Investment for Diaspora", "Diaspora Mortgage", "Diaspora Support"]),
  tile("foreign-ops", "Foreign Operations", Languages, "from-emerald-700 via-teal-800 to-slate-900",
    "Cross-border operations across UBA's global network.",
    ["International Transfers", "SWIFT Operations", "Correspondent Banking", "Cross-Border Compliance", "Multi-Currency Support"]),
];

export const PRODUCT_ITEMS: ProductDetail[] = PRODUCT_TILES.flatMap((t) => t.items);

export function getTile(id: string): ProductTile | undefined {
  return PRODUCT_TILES.find((t) => t.id === id);
}
export function getProduct(id: string): ProductDetail | undefined {
  return PRODUCT_ITEMS.find((p) => p.id === id);
}
export function isDueForReview(p: ProductDetail, ref = new Date("2026-07-14")): boolean {
  return new Date(p.nextReview) <= ref;
}
