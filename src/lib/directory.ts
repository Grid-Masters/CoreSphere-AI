import { DEFAULT_COUNTRY, type CountryCode } from "./org-structure";

export type Role = "staff" | "qa" | "ld" | "team_lead" | "group_head" | "sysadmin";

export type DirectoryEntry = {
  email: string;
  name: string;
  initials: string;
  role: Role;
  roleLabel: string;
  department: string;
  unit: string;
  reportsTo?: string;
  assignedQAOfficer?: string;
  country?: CountryCode;
};

export const roleLabels: Record<Role, string> = {
  staff: "Customer Experience Executive",
  qa: "QA Team Lead",
  ld: "Learning & Development Officer",
  team_lead: "Team Lead",
  group_head: "Group Head",
  sysadmin: "Platform Administrator",
};

// Simulated UBA enterprise directory. Role, department and reporting line are
// resolved from this directory — NOT from email naming patterns.
export const directory: DirectoryEntry[] = [
  {
    email: "a.okafor@ubagroup.com",
    name: "Adaeze Okafor",
    initials: "AO",
    role: "staff",
    roleLabel: "Customer Experience Executive • FHD Service Officer",
    department: "FHD",
    unit: "FHD Operations",
    reportsTo: "s.eze@ubagroup.com",
    assignedQAOfficer: "d.obi@ubagroup.com",
  },
  {
    email: "m.bello@ubagroup.com",
    name: "Musa Bello",
    initials: "MB",
    role: "staff",
    roleLabel: "Customer Experience Executive • Inbound Service Officer",
    department: "Inbound",
    unit: "Inbound Voice",
    reportsTo: "s.eze@ubagroup.com",
    assignedQAOfficer: "r.adeyemi@ubagroup.com",
  },
  {
    email: "e.james@ubagroup.com",
    name: "Esther James",
    initials: "EJ",
    role: "staff",
    roleLabel: "Customer Experience Executive • Multimedia Service Officer",
    department: "Multimedia",
    unit: "Live Chat",
    reportsTo: "s.eze@ubagroup.com",
    assignedQAOfficer: "d.obi@ubagroup.com",
  },
  {
    email: "t.aina@ubagroup.com",
    name: "Tunde Aina",
    initials: "TA",
    role: "staff",
    roleLabel: "Customer Experience Executive • Social Media Service Officer",
    department: "Social Media",
    unit: "Reputation",
    reportsTo: "s.eze@ubagroup.com",
    assignedQAOfficer: "r.adeyemi@ubagroup.com",
  },
  {
    email: "d.obi@ubagroup.com",
    name: "Daniel Obi",
    initials: "DO",
    role: "qa",
    roleLabel: "QA Officer",
    department: "Quality Assurance Team (Q.A)",
    unit: "Quality Assurance Team (Q.A) — FHD & Multimedia",
    reportsTo: "o.balogun@ubagroup.com",
  },
  {
    email: "r.adeyemi@ubagroup.com",
    name: "Rita Adeyemi",
    initials: "RA",
    role: "qa",
    roleLabel: "QA Officer",
    department: "Quality Assurance Team (Q.A)",
    unit: "Quality Assurance Team (Q.A) — Inbound & Social",
    reportsTo: "o.balogun@ubagroup.com",
  },
  {
    email: "c.paul@ubagroup.com",
    name: "Chioma Paul",
    initials: "CP",
    role: "ld",
    roleLabel: "L&D Officer",
    department: "Learning and Development Team (L & D)",
    unit: "Learning and Development Team (L & D)",
    reportsTo: "p.okonkwo@ubagroup.com",
  },
  {
    email: "s.eze@ubagroup.com",
    name: "Sani Eze",
    initials: "SE",
    role: "team_lead",
    roleLabel: "Team Lead, FHD",
    department: "FHD",
    unit: "FHD Operations",
    reportsTo: "n.abubakar@ubagroup.com",
  },
  {
    email: "n.abubakar@ubagroup.com",
    name: "Nafisa Abubakar",
    initials: "NA",
    role: "team_lead",
    roleLabel: "Unit Head, Fraud Help Desk",
    department: "FHD",
    unit: "Fraud Help Desk",
    reportsTo: "s.mohammed@ubagroup.com",
  },
  {
    email: "o.balogun@ubagroup.com",
    name: "Olu Balogun",
    initials: "OB",
    role: "qa",
    roleLabel: "QA Team Lead",
    department: "Quality Assurance Team (Q.A)",
    unit: "Quality Assurance Team (Q.A)",
    reportsTo: "g.iheanacho@ubagroup.com",
  },
  {
    email: "g.iheanacho@ubagroup.com",
    name: "Grace Iheanacho",
    initials: "GI",
    role: "qa",
    roleLabel: "QA Unit Head",
    department: "Quality Assurance Team (Q.A)",
    unit: "Quality Assurance Team (Q.A)",
    reportsTo: "s.mohammed@ubagroup.com",
  },
  {
    email: "p.okonkwo@ubagroup.com",
    name: "Peter Okonkwo",
    initials: "PO",
    role: "ld",
    roleLabel: "L&D Team Lead",
    department: "Learning and Development Team (L & D)",
    unit: "Learning and Development Team (L & D)",
    reportsTo: "v.ekpo@ubagroup.com",
  },
  {
    email: "v.ekpo@ubagroup.com",
    name: "Victoria Ekpo",
    initials: "VE",
    role: "ld",
    roleLabel: "L&D Unit Head",
    department: "Learning and Development Team (L & D)",
    unit: "Learning and Development Team (L & D)",
    reportsTo: "s.mohammed@ubagroup.com",
  },
  {
    email: "s.mohammed@ubagroup.com",
    name: "Sadiq Mohammed",
    initials: "SM",
    role: "group_head",
    roleLabel: "Head of CFC Operations",
    department: "CFC Operations",
    unit: "CFC Operations",
    reportsTo: "a.yusuf@ubagroup.com",
  },
  {
    email: "a.yusuf@ubagroup.com",
    name: "Aliyu Yusuf",
    initials: "AY",
    role: "group_head",
    roleLabel: "Group Head, Customer Fulfilment",
    department: "Group Head",
    unit: "Executive Office",
  },
  {
    email: "admin@ubagroup.com",
    name: "Ibrahim Sadiq",
    initials: "IS",
    role: "sysadmin",
    roleLabel: "Platform Administrator",
    department: "Platform Governance",
    unit: "Enterprise Controls",
  },
  {
    email: "f.danjuma@ubagroup.com",
    name: "Fatima Danjuma",
    initials: "FD",
    role: "staff",
    roleLabel: "Customer Experience Executive • Incident Containment Officer",
    department: "FHD",
    unit: "Incident Containment",
    reportsTo: "s.eze@ubagroup.com",
    assignedQAOfficer: "d.obi@ubagroup.com",
  },
  {
    email: "k.mensah@ubagroup.com",
    name: "Kelechi Mensah",
    initials: "KM",
    role: "staff",
    roleLabel: "Customer Experience Executive • Block Card Officer",
    department: "FHD",
    unit: "Block Card",
    reportsTo: "s.eze@ubagroup.com",
    assignedQAOfficer: "d.obi@ubagroup.com",
  },
  {
    email: "n.ibe@ubagroup.com",
    name: "Ngozi Ibe",
    initials: "NI",
    role: "staff",
    roleLabel: "Customer Experience Executive • Email Officer",
    department: "Multimedia",
    unit: "Email",
    reportsTo: "s.eze@ubagroup.com",
    assignedQAOfficer: "d.obi@ubagroup.com",
  },
  {
    email: "b.achi@ubagroup.com",
    name: "Blessing Achi",
    initials: "BA",
    role: "staff",
    roleLabel: "Customer Experience Executive • Video Validation / KYC Officer",
    department: "Video Validation",
    unit: "KYC",
    reportsTo: "s.eze@ubagroup.com",
    assignedQAOfficer: "r.adeyemi@ubagroup.com",
  },
];

export function findByEmail(email: string): DirectoryEntry | undefined {
  return directory.find((d) => d.email.toLowerCase() === email.toLowerCase());
}

// Re-export the canonical org structure so consumers resolve from one place.
export { DEPARTMENTS, OPERATIONAL_DEPARTMENTS, COUNTRIES, DEFAULT_COUNTRY } from "./org-structure";