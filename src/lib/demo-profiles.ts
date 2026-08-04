import type { PositionCode } from "./identity";

/**
 * DEMO/FIXTURE METADATA ONLY.
 *
 * Presentation labels for the discreet "Demo Access" selector on the login
 * page. These entries are NOT an identity, permission or access authority —
 * after sign-in, identity is resolved exclusively from the database profile,
 * primary position assignment, organisation unit and capabilities.
 */
export type DemoProfile = {
  email: string;
  name: string;
  initials: string;
  label: string;
  unit: string;
  positionCode: PositionCode;
};

export const demoProfiles: DemoProfile[] = [
  { email: "a.okafor@ubagroup.com", name: "Adaeze Okafor", initials: "AO", label: "Customer Experience Executive", unit: "FHD Operations / Fraud Help Desk", positionCode: "CEE" },
  { email: "s.eze@ubagroup.com", name: "Sani Eze", initials: "SE", label: "Team Lead", unit: "FHD Operations / Fraud Help Desk", positionCode: "TEAM_LEAD" },
  { email: "n.abubakar@ubagroup.com", name: "Nafisa Abubakar", initials: "NA", label: "Unit Head", unit: "Fraud Help Desk", positionCode: "UNIT_HEAD" },
  { email: "d.obi@ubagroup.com", name: "Daniel Obi", initials: "DO", label: "QA Officer", unit: "Quality Assurance", positionCode: "QA_OFFICER" },
  { email: "o.balogun@ubagroup.com", name: "Olu Balogun", initials: "OB", label: "QA Team Lead", unit: "Quality Assurance", positionCode: "QA_TEAM_LEAD" },
  { email: "g.iheanacho@ubagroup.com", name: "Grace Iheanacho", initials: "GI", label: "QA Unit Head", unit: "Quality Assurance", positionCode: "QA_UNIT_HEAD" },
  { email: "c.paul@ubagroup.com", name: "Chioma Paul", initials: "CP", label: "L&D Officer", unit: "Learning & Development", positionCode: "LD_OFFICER" },
  { email: "p.okonkwo@ubagroup.com", name: "Peter Okonkwo", initials: "PO", label: "L&D Team Lead", unit: "Learning & Development", positionCode: "LD_TEAM_LEAD" },
  { email: "v.ekpo@ubagroup.com", name: "Victoria Ekpo", initials: "VE", label: "L&D Unit Head", unit: "Learning & Development", positionCode: "LD_UNIT_HEAD" },
  { email: "s.mohammed@ubagroup.com", name: "Sadiq Mohammed", initials: "SM", label: "Head of CFC Operations", unit: "CFC Operations", positionCode: "HEAD_CFC_OPERATIONS" },
  { email: "a.yusuf@ubagroup.com", name: "Aliyu Yusuf", initials: "AY", label: "Group Head", unit: "Office of the Group Head", positionCode: "GROUP_HEAD" },
  { email: "admin@ubagroup.com", name: "Ibrahim Sadiq", initials: "IS", label: "Platform Administrator", unit: "Operations Support", positionCode: "PLATFORM_ADMINISTRATOR" },
];
