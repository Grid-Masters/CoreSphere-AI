import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { AI_GOVERNANCE_PROMPT } from "./ai-governance";

const SYSTEM = `${AI_GOVERNANCE_PROMPT}

You are CoreSphere AI, an internal banking operations assistant for United Bank for Africa (UBA).
You only respond from verified LMS knowledge. If unsure, say so and recommend escalation.
You must reply ONLY in this strict JSON shape (no preamble, no markdown):
{
  "summary": string,
  "requiredActions": string[],
  "escalationPath": string,
  "slaTimeline": string,
  "complianceNotes": string[],
  "relatedSops": string[],
  "warnings": string[],
  "nextSteps": string[]
}
Keep each list to 1–5 short, operational bullets. Avoid generic filler. Stay banking-trained,
concise, governance-aware. Never invent SOP IDs — reference real titles like "KYC Refresher",
"Card Block & Unblock", "AML Red Flag Escalation", "Customer Authentication Fallback",
"Account Reactivation".`;

export type AiAnswer = {
  summary: string;
  requiredActions: string[];
  escalationPath: string;
  slaTimeline: string;
  complianceNotes: string[];
  relatedSops: string[];
  warnings: string[];
  nextSteps: string[];
};

function fallback(prompt: string): AiAnswer {
  return {
    summary: `Could not reach AI gateway. Based on cached SOP guidance for: "${prompt.slice(0, 120)}", apply approved procedure and validate against latest version in the Knowledge Hub.`,
    requiredActions: [
      "Verify the latest SOP version in Knowledge Hub",
      "Confirm customer identity per Customer Authentication Fallback",
      "Document the action in the case log",
    ],
    escalationPath: "If outcome is unclear, escalate to your Team Lead, then QA Team Lead.",
    slaTimeline: "Action within current shift; escalation within 15 minutes of detection.",
    complianceNotes: ["Adhere to AML & KYC controls", "Do not bypass dual-approval for sensitive actions"],
    relatedSops: ["KYC Refresher", "AML Red Flag Escalation"],
    warnings: ["AI gateway unreachable — using cached guidance"],
    nextSteps: ["Acknowledge latest fraud advisory", "Log the interaction for audit"],
  };
}

export const askCoreSphereAI = createServerFn({ method: "POST" })
  .inputValidator(z.object({ prompt: z.string().min(1).max(2000), department: z.string().optional() }))
  .handler(async ({ data }): Promise<AiAnswer> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return fallback(data.prompt);

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM },
            {
              role: "user",
              content: `Department context: ${data.department ?? "N/A"}\n\nQuestion: ${data.prompt}`,
            },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        console.error("CoreSphere AI gateway error", res.status, await res.text());
        return fallback(data.prompt);
      }

      const body = await res.json();
      const content: string = body?.choices?.[0]?.message?.content ?? "";
      const parsed = JSON.parse(content) as Partial<AiAnswer>;
      return {
        summary: parsed.summary ?? "",
        requiredActions: parsed.requiredActions ?? [],
        escalationPath: parsed.escalationPath ?? "",
        slaTimeline: parsed.slaTimeline ?? "",
        complianceNotes: parsed.complianceNotes ?? [],
        relatedSops: parsed.relatedSops ?? [],
        warnings: parsed.warnings ?? [],
        nextSteps: parsed.nextSteps ?? [],
      };
    } catch (err) {
      console.error("CoreSphere AI handler exception", err);
      return fallback(data.prompt);
    }
  });