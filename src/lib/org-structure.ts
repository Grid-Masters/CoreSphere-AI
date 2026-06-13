// ============================================================================
// CoreSphere Pulse AI — Official Customer Fulfilment Structure
// Single source of truth for departments, sub-units and country framework.
// Every dashboard, analytic, leaderboard, readiness metric and recognition
// module MUST read department/sub-unit data from here.
// ============================================================================

export type DepartmentCode =
  | "Inbound"
  | "FHD"
  | "Multimedia"
  | "Social Media"
  | "Video Validation"
  | "QA"
  | "L&D";

export type Department = {
  code: DepartmentCode;
  name: string;
  short: string;
  /** Operational departments handle live customer fulfilment work. */
  operational: boolean;
  /** Sub-units are NOT standalone departments — they roll up to the parent. */
  units: string[];
  description: string;
};

// PRIMARY OPERATIONAL DEPARTMENTS + enabling functions (QA, L&D).
export const DEPARTMENTS: Department[] = [
  {
    code: "Inbound",
    name: "Inbound",
    short: "Inbound",
    operational: true,
    units: ["Inbound Voice"],
    description: "Inbound customer voice servicing for the Customer Fulfilment Group.",
  },
  {
    code: "FHD",
    name: "Fraud Help Desk",
    short: "FHD",
    operational: true,
    units: ["FHD Operations", "Containment", "Block Card"],
    description: "Fraud Help Desk — first response, containment and card blocking.",
  },
  {
    code: "Multimedia",
    name: "Multimedia",
    short: "Multimedia",
    operational: true,
    units: ["Email", "Live Chat"],
    description: "Multimedia servicing across Email and Live Chat channels.",
  },
  {
    code: "Social Media",
    name: "Social Media",
    short: "Social",
    operational: true,
    units: ["Reputation"],
    description: "Social media servicing and reputation management.",
  },
  {
    code: "Video Validation",
    name: "Video Validation",
    short: "Video Validation",
    operational: true,
    units: ["KYC", "Identity Verification"],
    description: "Video validation, KYC and identity verification operations.",
  },
  {
    code: "QA",
    name: "Quality Assurance",
    short: "QA",
    operational: false,
    units: ["QA — FHD & Multimedia", "QA — Inbound & Social", "QA — Video Validation"],
    description: "Quality Assurance governing operational service standards.",
  },
  {
    code: "L&D",
    name: "Learning & Development",
    short: "L&D",
    operational: false,
    units: ["Operational Learning"],
    description: "Learning & Development — enterprise learning and FAQ governance.",
  },
];

export const DEPARTMENT_CODES: DepartmentCode[] = DEPARTMENTS.map((d) => d.code);

// Operational departments that carry frontline staff and appear in leaderboards,
// department rankings, recognition and readiness rollups.
export const OPERATIONAL_DEPARTMENTS: DepartmentCode[] = DEPARTMENTS.filter(
  (d) => d.operational,
).map((d) => d.code);

export function getDepartment(code: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.code === code || d.name === code || d.short === code);
}

export function departmentName(code: string): string {
  return getDepartment(code)?.name ?? code;
}

export function unitsFor(code: string): string[] {
  return getDepartment(code)?.units ?? [];
}

/** Resolve which department a sub-unit rolls up to (e.g. "Containment" -> "FHD"). */
export function parentDepartmentOf(unit: string): DepartmentCode | undefined {
  const dept = DEPARTMENTS.find((d) => d.units.includes(unit));
  return dept?.code;
}

// ============================================================================
// Country Expansion Framework — Nigeria active, others scaffolded for rollout.
// ============================================================================

export type CountryCode = "NG" | "GH" | "KE" | "UG" | "CM" | "TZ" | "ZM";

export type Country = {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  /** Active = fully rolled out. Others are scaffolded for future expansion. */
  status: "active" | "planned";
};

export const COUNTRIES: Country[] = [
  { code: "NG", name: "Nigeria", flag: "🇳🇬", currency: "NGN", status: "active" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", currency: "GHS", status: "planned" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", currency: "KES", status: "planned" },
  { code: "UG", name: "Uganda", flag: "🇺🇬", currency: "UGX", status: "planned" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲", currency: "XAF", status: "planned" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", currency: "TZS", status: "planned" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲", currency: "ZMW", status: "planned" },
];

export const DEFAULT_COUNTRY: CountryCode = "NG";

export function getCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}