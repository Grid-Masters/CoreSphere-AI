import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { AI_GOVERNANCE_PROMPT } from "./ai-governance";

const SYSTEM = `${AI_GOVERNANCE_PROMPT}

You are CoreSphere AI running the Banking Scenario Simulator for UBA Customer Fulfilment Group.
The user is a customer-facing employee practising operational judgement. Given a banking scenario
and the staff member's proposed response, you assess the response and teach the correct handling.
Reply ONLY in this strict JSON shape (no preamble, no markdown):
{
  "verdict": "Excellent" | "On Track" | "Needs Work",
  "score": number (0-100),
  "feedback": string,
  "correctResponse": string[],
  "sopReference": string,
  "escalationPath": string,
  "slaTimeline": string
}
Keep lists to 2-5 short operational bullets. Reference real SOP titles such as
"Card Block & Unblock", "Fraud Containment First Response", "AML Red Flag Identification",
"Dispute Resolution SLA Guide", "Customer Authentication Fallback". Be a supportive coach.`;

export type ScenarioPrompt = {
  id: string;
  title: string;
  category: string;
  difficulty: "Foundational" | "Intermediate" | "Advanced";
  situation: string;
};

export type ScenarioAssessment = {
  verdict: "Excellent" | "On Track" | "Needs Work";
  score: number;
  feedback: string;
  correctResponse: string[];
  sopReference: string;
  escalationPath: string;
  slaTimeline: string;
};

function fallback(): ScenarioAssessment {
  return {
    verdict: "On Track",
    score: 72,
    feedback:
      "AI gateway unreachable — using cached coaching. Your approach covers the basics. Always lead with identity verification and reference the latest SOP version before acting.",
    correctResponse: [
      "Verify identity per Customer Authentication Fallback",
      "Apply the relevant SOP step-by-step and document the case",
      "Set clear customer expectations against the SLA",
    ],
    sopReference: "Customer Authentication Fallback",
    escalationPath: "Escalate unclear outcomes to your Team Lead, then QA Team Lead.",
    slaTimeline: "Resolve within shift; escalate within 15 minutes of detection.",
  };
}

export const assessScenario = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      situation: z.string().min(1).max(2000),
      answer: z.string().min(1).max(2000),
      department: z.string().max(120).optional(),
    }),
  )
  .handler(async ({ data }): Promise<ScenarioAssessment> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return fallback();
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM },
            {
              role: "user",
              content: `Department: ${data.department ?? "N/A"}\n\nScenario: ${data.situation}\n\nStaff response: ${data.answer}`,
            },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) {
        console.error("Scenario AI gateway error", res.status, await res.text());
        return fallback();
      }
      const body = await res.json();
      const content: string = body?.choices?.[0]?.message?.content ?? "";
      const parsed = JSON.parse(content) as Partial<ScenarioAssessment>;
      return {
        verdict: (parsed.verdict as ScenarioAssessment["verdict"]) ?? "On Track",
        score: typeof parsed.score === "number" ? parsed.score : 72,
        feedback: parsed.feedback ?? "",
        correctResponse: parsed.correctResponse ?? [],
        sopReference: parsed.sopReference ?? "",
        escalationPath: parsed.escalationPath ?? "",
        slaTimeline: parsed.slaTimeline ?? "",
      };
    } catch (err) {
      console.error("Scenario handler exception", err);
      return fallback();
    }
  });

export const SCENARIO_LIBRARY: ScenarioPrompt[] = [
  { id: "scn-1", title: "Failed Transfer Complaint", category: "Transactions", difficulty: "Intermediate", situation: "A customer calls furious that a ₦250,000 NIP transfer was debited but never received by the beneficiary 40 minutes ago. They demand an immediate reversal." },
  { id: "scn-2", title: "Suspected Fraud / SIM Swap", category: "Fraud", difficulty: "Advanced", situation: "A caller claims to be a customer and wants to disable transaction alerts and add a new beneficiary. They sound rushed and cannot answer a security question correctly on the first try." },
  { id: "scn-3", title: "Card Blocking Request", category: "Cards", difficulty: "Foundational", situation: "A customer messages on live chat that they lost their debit card at a mall and want it blocked right now before someone uses it." },
  { id: "scn-4", title: "Dispute Escalation", category: "Disputes", difficulty: "Intermediate", situation: "A customer disputes a POS charge they say they never made and is threatening to post about it on social media if not resolved today." },
  { id: "scn-5", title: "Dormant Account Reactivation", category: "Accounts", difficulty: "Foundational", situation: "A customer wants to reactivate an account dormant for 18 months and is unsure what documents are required." },
];