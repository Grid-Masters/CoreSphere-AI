import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { quotes as fallbackQuotes } from "@/lib/quotes";

export type ApprovedQuote = {
  id: string;
  quote: string;
  author: string | null;
  category: string;
  source_module: string;
};

let _cache: ApprovedQuote[] | null = null;
let _inFlight: Promise<ApprovedQuote[]> | null = null;

async function fetchApprovedQuotes(): Promise<ApprovedQuote[]> {
  if (_cache) return _cache;
  if (_inFlight) return _inFlight;
  _inFlight = (async () => {
    try {
      const { data, error } = await supabase
        .from("approved_quotes")
        .select("id, quote, author, category, source_module")
        .eq("is_active", true)
        .not("approved_at", "is", null);
      if (error || !data || data.length === 0) {
        _cache = fallbackQuotes.map((q, i) => ({
          id: `fallback-${i}`,
          quote: q,
          author: "UBA L&D",
          category: "general",
          source_module: "L&D",
        }));
      } else {
        _cache = data as ApprovedQuote[];
      }
      return _cache;
    } catch {
      _cache = fallbackQuotes.map((q, i) => ({
        id: `fallback-${i}`,
        quote: q,
        author: "UBA L&D",
        category: "general",
        source_module: "L&D",
      }));
      return _cache;
    } finally {
      _inFlight = null;
    }
  })();
  return _inFlight;
}

/**
 * React hook that resolves an approved motivational quote from the governed
 * quote library. Rotates once per calendar day per browser to feel fresh at
 * each login while remaining stable within the day.
 */
export function useApprovedQuote(): ApprovedQuote | null {
  const [q, setQ] = useState<ApprovedQuote | null>(null);
  useEffect(() => {
    let alive = true;
    fetchApprovedQuotes().then((list) => {
      if (!alive || list.length === 0) return;
      const today = new Date().toISOString().slice(0, 10);
      const KEY = "coresphere.dailyApprovedQuote";
      try {
        const raw = window.localStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { day: string; id: string };
          if (parsed.day === today) {
            const hit = list.find((x) => x.id === parsed.id);
            if (hit) {
              setQ(hit);
              return;
            }
          }
        }
        const chosen = list[Math.floor(Math.random() * list.length)];
        window.localStorage.setItem(KEY, JSON.stringify({ day: today, id: chosen.id }));
        setQ(chosen);
      } catch {
        setQ(list[0]);
      }
    });
    return () => {
      alive = false;
    };
  }, []);
  return q;
}