// AI Daily Briefing builder. Derives a personalised "Today's Briefing" from the
// active user, their daily mission and Pulse Points. Development/engagement only.
import type { DirectoryEntry } from "./directory";
import { dailyMission, pulsePoints } from "./gamification";
import { freshQuote, greetingForHour } from "./quotes";
import {
  BookOpen,
  Target,
  Package,
  ShieldAlert,
  FileCheck,
  Sparkles,
} from "lucide-react";

export type BriefingItem = {
  icon: any;
  label: string;
  text: string;
  tone: "primary" | "warning" | "info" | "success";
  href?: string;
};

export type DailyBriefing = {
  greeting: string;
  name: string;
  quote: string;
  items: BriefingItem[];
  pulsePoints: number;
};

export function buildBriefing(user: DirectoryEntry, now: Date = new Date()): DailyBriefing {
  const mission = dailyMission(user, now);
  const points = pulsePoints(user);

  const items: BriefingItem[] = [
    {
      icon: BookOpen,
      label: "SOP Update",
      text: `Updated guidance linked to "${mission.title}" is ready for your ${user.department} unit.`,
      tone: "info",
      href: "/knowledge-hub",
    },
    {
      icon: Target,
      label: "Learning Mission",
      text: `${mission.type}: ${mission.title} — ${mission.minutes} min · +${mission.points} Pulse Points.`,
      tone: "primary",
      href: "/assessments",
    },
    {
      icon: Package,
      label: "Product Update",
      text: "UBA Prestige Visa — revised fee schedule effective this week.",
      tone: "info",
      href: "/memos",
    },
    {
      icon: ShieldAlert,
      label: "Fraud Alert",
      text: "New typology: SIM-swap voice impersonation. Verify before any account action.",
      tone: "warning",
      href: "/memos",
    },
    {
      icon: FileCheck,
      label: "Compliance Notice",
      text: "KYC Refresher acknowledgement due today — keep your readiness green.",
      tone: "warning",
      href: "/memos",
    },
    {
      icon: Sparkles,
      label: "Pulse Points",
      text: `You have ${points.toLocaleString()} Pulse Points. Complete today's mission to climb the board.`,
      tone: "success",
      href: "/achievements",
    },
  ];

  return {
    greeting: greetingForHour(now.getHours()),
    name: user.name.split(" ")[0],
    quote: freshQuote(now),
    items,
    pulsePoints: points,
  };
}
