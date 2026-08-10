import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * AI SAFETY CONTAINMENT (Package A5).
 *
 * CoreSphere AI may only answer operational/knowledge questions from approved
 * canonical knowledge with an exact record/version/source-section citation.
 * The Canonical Knowledge Registry does not exist yet (Package B/D), so there
 * is NO grounded retrieval available and this surface fails safely.
 *
 * It must never invent SOPs, procedures, limits, timelines, escalation routes,
 * compliance instructions, or "cached guidance".
 */
export const SAFE_REFUSAL =
  "Verified guidance is not currently available in CoreSphere. Please use the approved escalation channel.";

export type AiAnswer = {
  /** False until grounded canonical retrieval exists. */
  grounded: boolean;
  summary: string;
  requiredActions: string[];
  escalationPath: string;
  slaTimeline: string;
  complianceNotes: string[];
  relatedSops: string[];
  warnings: string[];
  nextSteps: string[];
};

function safeAnswer(): AiAnswer {
  return {
    grounded: false,
    summary: SAFE_REFUSAL,
    requiredActions: [],
    escalationPath: "",
    slaTimeline: "",
    complianceNotes: [],
    relatedSops: [],
    warnings: [],
    nextSteps: [],
  };
}

export const askCoreSphereAI = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ prompt: z.string().min(1).max(2000), department: z.string().optional() }))
  .handler(async (): Promise<AiAnswer> => {
    // No canonical knowledge source is connected. Fail safe — never generate.
    return safeAnswer();
  });
