import type { Role } from "./directory";

export type DemoProfile = {
  email: string;
  label: string; // role title shown in the modal
  role: Role;
};

// Discreet demo access selection used on the login page. Maps a friendly
// role title to a seeded directory account.
export const demoProfiles: DemoProfile[] = [
  { email: "a.okafor@ubagroup.com", label: "Customer Experience Executive", role: "staff" },
  { email: "d.obi@ubagroup.com", label: "QA Team Lead", role: "qa" },
  { email: "s.eze@ubagroup.com", label: "Team Lead", role: "team_lead" },
  { email: "c.paul@ubagroup.com", label: "Learning & Development", role: "ld" },
  { email: "a.yusuf@ubagroup.com", label: "Group Head", role: "group_head" },
  { email: "admin@ubagroup.com", label: "Platform Administrator", role: "sysadmin" },
];
