import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Scenario Simulator — prototype practice UI only (Package A5 containment).
 *
 * Governed assessment requires source-linked rubrics built on approved
 * canonical knowledge (Package E, Scenario Simulator V2). Until then this
 * surface must NOT fabricate a score, verdict, SOP reference, SLA, escalation
 * route or "correct procedure".
 */
export type ScenarioPrompt = {
  id: string;
  title: string;
  category: string;
  difficulty: "Foundational" | "Intermediate" | "Advanced";
  situation: string;
};

export type ScenarioAssessment = {
  available: false;
  message: string;
  detail: string;
};

export const assessScenario = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      situation: z.string().min(1).max(2000),
      answer: z.string().min(1).max(2000),
      department: z.string().max(120).optional(),
    }),
  )
  .handler(async (): Promise<ScenarioAssessment> => ({
    available: false,
    message: "Verified guidance is not currently available in CoreSphere. Please use the approved escalation channel.",
    detail:
      "Governed scenario assessment requires approved canonical knowledge and a source-linked rubric. Scoring and model answers are intentionally withheld until governed assessment is enabled.",
  }));

/** Demonstration/UAT practice scenarios — synthetic, not approved guidance. */
export const SCENARIO_LIBRARY: ScenarioPrompt[] = [
  { id: "scn-1", title: "Failed Transfer Complaint", category: "Transactions", difficulty: "Intermediate", situation: "A customer calls furious that a ₦250,000 NIP transfer was debited but never received by the beneficiary 40 minutes ago. They demand an immediate reversal." },
  { id: "scn-2", title: "Suspected Fraud / SIM Swap", category: "Fraud", difficulty: "Advanced", situation: "A caller claims to be a customer and wants to disable transaction alerts and add a new beneficiary. They sound rushed and cannot answer a security question correctly on the first try." },
  { id: "scn-3", title: "Card Blocking Request", category: "Cards", difficulty: "Foundational", situation: "A customer messages on live chat that they lost their debit card at a mall and want it blocked right now before someone uses it." },
  { id: "scn-4", title: "Dispute Escalation", category: "Disputes", difficulty: "Intermediate", situation: "A customer disputes a POS charge they say they never made and is threatening to post about it on social media if not resolved today." },
  { id: "scn-5", title: "Dormant Account Reactivation", category: "Accounts", difficulty: "Foundational", situation: "A customer wants to reactivate an account dormant for 18 months and is unsure what documents are required." },
];
