import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { AI_GOVERNANCE_PROMPT } from "./ai-governance";

export const SUGGESTION_CATEGORIES = [
  "Process Improvement",
  "Customer Experience",
  "Tools & Systems",
  "Training & Knowledge",
  "Wellbeing & Culture",
  "Cost Efficiency",
  "General",
] as const;

export type SuggestionCategory = (typeof SUGGESTION_CATEGORIES)[number];

export type Suggestion = {
  id: string;
  user_id: string;
  category: string;
  body: string;
  status: string;
  ai_category: string | null;
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
};

async function classify(body: string): Promise<{ ai_category: string; ai_summary: string }> {
  const key = process.env.LOVABLE_API_KEY;
  const fallback = { ai_category: "General", ai_summary: body.slice(0, 140) };
  if (!key) return fallback;
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `${AI_GOVERNANCE_PROMPT}\n\nYou are the CoreSphere Suggestion Box classifier. Categorise the employee suggestion into exactly one of: ${SUGGESTION_CATEGORIES.join(", ")}. Also write a one-sentence neutral summary. Reply ONLY as JSON: {"category": string, "summary": string}. Never reference individuals or produce HR/disciplinary content.`,
          },
          { role: "user", content: body },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    const parsed = JSON.parse(data?.choices?.[0]?.message?.content ?? "{}");
    const cat = SUGGESTION_CATEGORIES.includes(parsed.category) ? parsed.category : "General";
    return { ai_category: cat, ai_summary: String(parsed.summary ?? fallback.ai_summary).slice(0, 200) };
  } catch {
    return fallback;
  }
}

export const submitSuggestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      category: z.enum(SUGGESTION_CATEGORIES),
      body: z.string().trim().min(10).max(2000),
    }),
  )
  .handler(async ({ data, context }): Promise<Suggestion> => {
    const { ai_category, ai_summary } = await classify(data.body);
    const { data: row, error } = await context.supabase
      .from("suggestions")
      .insert({
        user_id: context.userId,
        category: data.category,
        body: data.body,
        ai_category,
        ai_summary,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row as Suggestion;
  });

export const listMySuggestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Suggestion[]> => {
    const { data, error } = await context.supabase
      .from("suggestions")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Suggestion[];
  });

export const listAllSuggestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Suggestion[]> => {
    // RLS ensures only management sees all; non-managers get only their own rows.
    const { data, error } = await context.supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Suggestion[];
  });

export const updateSuggestionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      status: z.enum(["Submitted", "Under Review", "Planned", "Implemented", "Archived"]),
    }),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { error } = await context.supabase
      .from("suggestions")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });