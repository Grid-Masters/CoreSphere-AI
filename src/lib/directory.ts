export type Role = "staff" | "qa" | "ld" | "team_lead" | "group_head";

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
};

export const roleLabels: Record<Role, string> = {
  staff: "Regular Staff",
  qa: "QA Officer",
  ld: "L&D",
  team_lead: "Team Lead",
  group_head: "Group Head",
};

// Simulated UBA enterprise directory. Role, department and reporting line are
// resolved from this directory — NOT from email naming patterns.
export const directory: DirectoryEntry[] = [
  {
    email: "a.okafor@ubagroup.com",
    name: "Adaeze Okafor",
    initials: "AO",
    role: "staff",
    roleLabel: "Customer Experience Executive",
    department: "FHD",
    unit: "FHD Core",
    reportsTo: "s.eze@ubagroup.com",
    assignedQAOfficer: "d.obi@ubagroup.com",
  },
  {
    email: "m.bello@ubagroup.com",
    name: "Musa Bello",
    initials: "MB",
    role: "staff",
    roleLabel: "Inbound Service Officer",
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
    roleLabel: "Live Chat Specialist",
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
    roleLabel: "Social Media Officer",
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
    department: "QA",
    unit: "QA — FHD & Multimedia",
    reportsTo: "a.yusuf@ubagroup.com",
  },
  {
    email: "r.adeyemi@ubagroup.com",
    name: "Rita Adeyemi",
    initials: "RA",
    role: "qa",
    roleLabel: "Senior QA Officer",
    department: "QA",
    unit: "QA — Inbound & Social",
    reportsTo: "a.yusuf@ubagroup.com",
  },
  {
    email: "c.paul@ubagroup.com",
    name: "Chioma Paul",
    initials: "CP",
    role: "ld",
    roleLabel: "L&D Lead",
    department: "L&D",
    unit: "Operational Learning",
    reportsTo: "a.yusuf@ubagroup.com",
  },
  {
    email: "s.eze@ubagroup.com",
    name: "Sani Eze",
    initials: "SE",
    role: "team_lead",
    roleLabel: "Team Lead",
    department: "FHD",
    unit: "FHD Core",
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
];

export function findByEmail(email: string): DirectoryEntry | undefined {
  return directory.find((d) => d.email.toLowerCase() === email.toLowerCase());
}