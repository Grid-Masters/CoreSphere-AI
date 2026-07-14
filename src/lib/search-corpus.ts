export type CorpusEntry = {
  id: string;
  title: string;
  category: "SOP" | "Policy" | "FAQ" | "Coaching" | "Video" | "Assessment" | "Announcement" | "Advisory" | "Product Knowledge";
  snippet: string;
  href?: string;
  tags?: string[];
};

import { PRODUCTS } from "./products";

// Product Intelligence records now live inside the Enterprise Knowledge Hub.
const productEntries: CorpusEntry[] = PRODUCTS.map((p) => ({
  id: `prod-${p.id}`,
  category: "Product Knowledge",
  title: p.name,
  snippet: p.overview,
  href: "/knowledge-hub",
  tags: [p.category.toLowerCase(), "product"],
}));

export const corpus: CorpusEntry[] = [
  { id: "c1", category: "SOP", title: "Card Block & Unblock", snippet: "Step-by-step for card freeze, replacement and reactivation workflows.", href: "/knowledge-hub", tags: ["cards", "block"] },
  { id: "c2", category: "SOP", title: "KYC Refresher", snippet: "Annual KYC refresh procedure — mandatory for all customer-facing staff.", href: "/knowledge-hub", tags: ["kyc", "compliance"] },
  { id: "c3", category: "SOP", title: "AML Red Flag Escalation", snippet: "Identifying and escalating suspicious activity per AML policy.", href: "/knowledge-hub", tags: ["aml", "fraud"] },
  { id: "c4", category: "SOP", title: "Account Reactivation", snippet: "Reactivating dormant accounts including documentation and approvals.", href: "/knowledge-hub" },
  { id: "c5", category: "Policy", title: "Customer Authentication Fallback", snippet: "Approved fallback when primary auth fails — voice & chat.", tags: ["auth"] },
  { id: "c6", category: "FAQ", title: "Live chat tone exceptions", snippet: "Approved exceptions to standard live chat tone guidance.", href: "/knowledge-hub" },
  { id: "c7", category: "FAQ", title: "Containment thresholds (Q2)", snippet: "Quarterly thresholds for containment of escalated complaints.", tags: ["containment"] },
  { id: "c8", category: "Coaching", title: "Empathy on complaint calls", snippet: "Coaching note: leading with empathy on first contact.", href: "/qa-coaching" },
  { id: "c9", category: "Video", title: "Live Chat Tone Mastery", snippet: "8-minute training video on live chat tone calibration.", href: "/knowledge-hub" },
  { id: "c10", category: "Assessment", title: "May 2026 — Service Excellence", snippet: "Monthly assessment covering service excellence pillars.", href: "/assessments" },
  { id: "c11", category: "Announcement", title: "Q2 service standards reminder", snippet: "Group Head broadcast — Q2 standards across Customer Fulfilment.", href: "/leadership" },
  { id: "c12", category: "Advisory", title: "Fraud: SIM-swap voice impersonation", snippet: "New typology guidance — verify with secondary signal.", href: "/memos" },
  ...productEntries,
];

function lev(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp: number[] = Array(b.length + 1).fill(0);
  for (let j = 0; j <= b.length; j++) dp[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : Math.min(prev, dp[j], dp[j - 1]) + 1;
      prev = tmp;
    }
  }
  return dp[b.length];
}

export function searchCorpus(q: string, limit = 8): CorpusEntry[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const tokens = query.split(/\s+/).filter(Boolean);

  const scored = corpus.map((e) => {
    const hay = `${e.title} ${e.snippet} ${(e.tags ?? []).join(" ")}`.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (hay.includes(t)) score += 10;
      else {
        // typo tolerance
        for (const word of hay.split(/\W+/)) {
          if (!word) continue;
          const d = lev(t, word);
          if (d === 1) score += 4;
          else if (d === 2 && word.length >= 5) score += 2;
        }
      }
    }
    if (e.title.toLowerCase().startsWith(query)) score += 6;
    return { e, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.e);
}