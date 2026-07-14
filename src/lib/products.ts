// ============================================================================
// Product Knowledge — an Enterprise Knowledge Hub asset type
// Country-aware product knowledge for the Customer Fulfilment Group.
// Static, verified content the UI reads directly. Nigeria (NG) active;
// other countries scaffolded through the org-structure country framework.
// ============================================================================

import { DEFAULT_COUNTRY, type CountryCode } from "./org-structure";

export type ProductCategory =
  | "Accounts"
  | "Cards"
  | "Loans"
  | "Leo"
  | "Mobile Banking"
  | "Internet Banking"
  | "SME"
  | "Corporate";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  overview: string;
  features: string[];
  benefits: string[];
  faqs: { q: string; a: string }[];
  escalation: string[];
  talkingPoints: string[];
  /** Countries where this product is live. NG is the active market. */
  countries: CountryCode[];
};

export const PRODUCTS: Product[] = [
  {
    id: "acc-savings",
    name: "UBA Savings Account",
    category: "Accounts",
    tagline: "Everyday saving with instant access",
    overview:
      "A flexible savings account for individuals with competitive interest, mobile access and zero minimum operating balance.",
    features: ["Zero minimum balance", "Quarterly interest", "Free UBA card issuance", "Full mobile & internet banking"],
    benefits: ["Instant account opening via Leo", "Interest on savings", "Nationwide branch & ATM access"],
    faqs: [
      { q: "How does a customer open a savings account?", a: "Guide them to open instantly via Leo or the mobile app with a valid ID and BVN, or at any branch." },
      { q: "Why is interest not showing?", a: "Interest posts quarterly. Confirm the account has met minimum operating conditions and check the last posting cycle." },
    ],
    escalation: ["Account restrictions → FHD Containment", "Interest disputes → Inbound → Operations"],
    talkingPoints: ["Emphasise zero minimum balance", "Highlight instant Leo onboarding", "Reassure on BVN safety"],
    countries: ["NG"],
  },
  {
    id: "card-debit",
    name: "UBA Debit Card",
    category: "Cards",
    tagline: "Secure payments everywhere",
    overview:
      "Verve, Mastercard and Visa debit cards linked to customer accounts for POS, ATM, web and international transactions.",
    features: ["Contactless payments", "International usage (Visa/Mastercard)", "Instant self-service block/unblock", "Transaction alerts"],
    benefits: ["Global acceptance", "Real-time fraud monitoring", "Card controls via the app"],
    faqs: [
      { q: "How do I block a card immediately?", a: "Verify identity per Customer Authentication Fallback, then follow the Card Block & Unblock SOP. Log the action and confirm via callback." },
      { q: "Why was an international transaction declined?", a: "Confirm the card is enabled for international use and channel limits are sufficient; escalate persistent declines to Cards Ops." },
    ],
    escalation: ["Suspected fraud → FHD → Block Card unit", "Failed POS/ATM → Inbound → Channels Ops"],
    talkingPoints: ["Reassure on 24/7 fraud monitoring", "Explain self-service card controls", "Never request full PAN or PIN"],
    countries: ["NG"],
  },
  {
    id: "loan-personal",
    name: "UBA Click Credit",
    category: "Loans",
    tagline: "Instant salary-based lending",
    overview:
      "A digital personal loan for salary earners with instant disbursement and no collateral, repayable over up to 12 months.",
    features: ["No collateral", "Instant disbursement", "Up to 12-month tenor", "Self-service via app / *919#"],
    benefits: ["Fast access to funds", "Transparent flat interest", "Automatic salary-linked repayment"],
    faqs: [
      { q: "Why was a Click Credit request declined?", a: "Eligibility depends on salary history and existing obligations. Advise the customer to check salary consistency and clear overdue facilities." },
      { q: "How is repayment collected?", a: "Repayment is auto-debited on salary receipt. Confirm the salary account is the funding account." },
    ],
    escalation: ["Disbursement failure → Inbound → Retail Lending", "Repayment disputes → Operations"],
    talkingPoints: ["Highlight instant, no-collateral access", "Be clear on tenor and charges", "Confirm eligibility before promising"],
    countries: ["NG"],
  },
  {
    id: "leo",
    name: "Leo Digital Assistant",
    category: "Leo",
    tagline: "Bank on chat",
    overview:
      "UBA's AI chat banking assistant on WhatsApp, Facebook and other channels for transfers, balance, airtime and account services.",
    features: ["Chat-based transfers", "Balance & mini-statement", "Airtime & bills", "Account opening"],
    benefits: ["Bank without an app", "24/7 availability", "Familiar messaging channels"],
    faqs: [
      { q: "How does a customer activate Leo?", a: "Chat 'Hi' to the official Leo number on WhatsApp, then complete onboarding with account and BVN verification." },
      { q: "Leo is not responding — what do I check?", a: "Confirm the customer is on the official verified number and there is no active channel incident before escalating." },
    ],
    escalation: ["Leo outage → Multimedia → Channels Engineering", "Failed Leo transfer → follow failed-transfer SOP"],
    talkingPoints: ["Position Leo as no-app banking", "Stress use of the official verified handle only", "Guide onboarding step by step"],
    countries: ["NG"],
  },
  {
    id: "mobile",
    name: "UBA Mobile Banking",
    category: "Mobile Banking",
    tagline: "Your bank in your pocket",
    overview:
      "Full-service mobile app for transfers, bill payments, card controls, loans and account management with biometric login.",
    features: ["Biometric login", "Instant transfers", "Card controls", "Bill payments & airtime"],
    benefits: ["Secure biometric access", "24/7 self-service", "Reduced branch visits"],
    faqs: [
      { q: "Customer can't log in after a phone change.", a: "Guide a fresh app install and device re-registration; verify identity before resetting access." },
      { q: "How do I enable international card use in the app?", a: "Cards → select card → controls → enable international; confirm channel limits." },
    ],
    escalation: ["Login/device issues → Inbound → Digital Support", "App incident → Multimedia → Channels Engineering"],
    talkingPoints: ["Promote biometric security", "Walk through self-service controls", "Never ask for full password or OTP"],
    countries: ["NG"],
  },
  {
    id: "internet",
    name: "UBA Internet Banking",
    category: "Internet Banking",
    tagline: "Full banking on the web",
    overview:
      "Web banking platform for retail and business customers covering transfers, bulk payments, statements and account services.",
    features: ["Bulk & scheduled transfers", "e-Statements", "Beneficiary management", "Token/soft-token authentication"],
    benefits: ["Desktop convenience", "Strong transaction authentication", "Comprehensive statements"],
    faqs: [
      { q: "Token not generating codes.", a: "Confirm token time-sync or soft-token app version; re-sync or reissue per the token SOP after identity verification." },
      { q: "How does a customer get e-statements?", a: "Statements → select account & period → download; confirm the registered email for delivery." },
    ],
    escalation: ["Token issues → Inbound → Digital Support", "Bulk payment failures → Operations"],
    talkingPoints: ["Emphasise token-based security", "Guide beneficiary setup", "Confirm identity before any reset"],
    countries: ["NG"],
  },
  {
    id: "sme",
    name: "UBA SME Banking",
    category: "SME",
    tagline: "Grow your business",
    overview:
      "Tailored accounts, lending and advisory for small and medium enterprises, including collections and business tools.",
    features: ["Business current accounts", "SME lending", "Collections & POS", "Business advisory"],
    benefits: ["Access to growth financing", "Efficient collections", "Dedicated business support"],
    faqs: [
      { q: "What does an SME need to open a business account?", a: "Registration documents, directors' IDs, BVNs and business address; guide to the SME onboarding checklist." },
      { q: "How does an SME apply for a facility?", a: "Refer to relationship management with financials and business records; set expectations on assessment timelines." },
    ],
    escalation: ["Account opening → Inbound → SME Onboarding", "Facility requests → Business Banking"],
    talkingPoints: ["Position UBA as a growth partner", "Be precise on documentation", "Route lending to relationship teams"],
    countries: ["NG"],
  },
  {
    id: "corporate",
    name: "UBA Corporate Banking",
    category: "Corporate",
    tagline: "Enterprise-grade banking",
    overview:
      "Transaction banking, trade finance, treasury and cash management for large corporates and institutions.",
    features: ["Cash management", "Trade finance", "Treasury services", "Host-to-host integration"],
    benefits: ["Enterprise liquidity control", "Global trade support", "Dedicated relationship coverage"],
    faqs: [
      { q: "Who handles a corporate mandate change?", a: "Route to the corporate relationship team with board resolution and updated mandates; do not action changes at first line." },
      { q: "How are host-to-host issues handled?", a: "Confirm connectivity status, then escalate to Transaction Banking / Channels Engineering." },
    ],
    escalation: ["Mandate/authorisation → Corporate Relationship team", "Integration issues → Transaction Banking"],
    talkingPoints: ["Defer complex requests to relationship coverage", "Confirm authorised signatories", "Protect confidentiality"],
    countries: ["NG"],
  },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Accounts", "Cards", "Loans", "Leo", "Mobile Banking", "Internet Banking", "SME", "Corporate",
];

export function productsForCountry(country: CountryCode = DEFAULT_COUNTRY): Product[] {
  return PRODUCTS.filter((p) => p.countries.includes(country));
}
