import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { AI_GOVERNANCE_PROMPT } from "./ai-governance";

export const WRITER_TOOLS = [
  "Professional tone",
  "Executive tone",
  "Empathetic tone",
  "Concise tone",
  "Grammar & spell fix",
  "Banking language enhancement",
  "Memo generator",
  "Customer response generator",
  "SOP summarizer",
  "Policy summarizer",
  "Translate to French",
  "Translate to English",
] as const;

export type WriterTool = (typeof WRITER_TOOLS)[number];

/**
 * Universal supplied-text-only fact boundary (Package A5).
 *
 * Applies to EVERY Writing Assistant tool. The assistant may only transform
 * facts already present in the user's supplied text; it must never supply
 * banking operational facts of its own.
 */
const SUPPLIED_TEXT_ONLY_RULE = `ABSOLUTE FACT BOUNDARY — applies to every tool:
- You may ONLY transform, summarise, translate, restructure or rephrase facts that are explicitly contained in the user's supplied text.
- You must NEVER add, infer, complete or "helpfully" supplement any operational fact that is not in the supplied text. This includes: banking procedures, SOP steps, fees, charges, limits, thresholds, SLAs/TATs/timelines, KYC or customer-authentication requirements, eligibility criteria, escalation routes or contacts, compliance/regulatory rules, product terms, account/card behaviours, or system names.
- If a required operational fact (e.g. a timeline, fee, escalation route or authentication step) is missing from the supplied text, OMIT it. Do not invent a placeholder value and do not guess.
- Never present yourself as the source of banking guidance. The supplied text is the only source of truth.
- Do not add greetings, commitments, apologies or promises that assert facts not present in the supplied text.`;


const instructions: Record<WriterTool, string> = {
  "Professional tone": "Rewrite the text in a polished, professional banking tone.",
  "Executive tone": "Rewrite the text in a concise, authoritative executive tone suitable for leadership.",
  "Empathetic tone": "Rewrite the text with a warm, empathetic, customer-first tone while staying professional.",
  "Concise tone": "Rewrite the text to be as clear and concise as possible without losing meaning.",
  "Grammar & spell fix": "Correct all grammar, spelling and punctuation. Preserve meaning and tone.",
  "Banking language enhancement": "Improve clarity and elevate to precise banking-operations language.",
  "Memo generator": "Turn the input into a well-structured internal banking memo with subject, body and a clear call to action.",
  "Customer response generator": "Draft a courteous, compliant customer response addressing the input.",
  "SOP summarizer": "Summarize the SOP content into key steps, owners and escalation points.",
  "Policy summarizer": "Summarize the policy into plain-language key points and obligations.",
  "Translate to French": "Translate the text to professional French. Output only the translation.",
  "Translate to English": "Translate the text to professional English. Output only the translation.",
};

export const runWritingAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      tool: z.enum(WRITER_TOOLS),
      text: z.string().min(1).max(6000),
    }),
  )
  .handler(async ({ data }): Promise<{ output: string; error?: string }> => {
    const key = process.env.LOVABLE_API_KEY;
    const instruction = instructions[data.tool as WriterTool];
    if (!key) {
      return { output: data.text, error: "AI gateway unavailable — returning original text." };
    }
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `${AI_GOVERNANCE_PROMPT}\n\n${SUPPLIED_TEXT_ONLY_RULE}\n\nYou are the CoreSphere AI Writing Assistant. ${instruction} Return ONLY the resulting text with no preamble or markdown fences.`,
            },
            { role: "user", content: data.text },
          ],
        }),
      });
      if (res.status === 429) return { output: data.text, error: "Rate limit reached — please retry shortly." };
      if (res.status === 402) return { output: data.text, error: "AI credits exhausted — please add credits." };
      if (!res.ok) {
        console.error("Writing assistant error", res.status, await res.text());
        return { output: data.text, error: "AI service error — returning original text." };
      }
      const body = await res.json();
      const content: string = body?.choices?.[0]?.message?.content ?? "";
      return { output: content.trim() || data.text };
    } catch (err) {
      console.error("Writing assistant exception", err);
      return { output: data.text, error: "Could not reach AI service." };
    }
  });