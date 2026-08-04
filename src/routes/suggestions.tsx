import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Lightbulb, Send, Sparkles, TrendingUp, Inbox, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, StatCard } from "@/components/ui-bits/Card";
import { useActiveUser, type ActiveUser } from "@/lib/active-user";
import {
  SUGGESTION_CATEGORIES,
  submitSuggestion,
  listMySuggestions,
  listAllSuggestions,
  updateSuggestionStatus,
  type Suggestion,
  type SuggestionCategory,
} from "@/lib/suggestions.functions";

export const Route = createFileRoute("/suggestions")({
  head: () => ({
    meta: [
      { title: "Digital Suggestion Box — UBA CoreSphere" },
      { name: "description", content: "Share ideas to improve UBA Customer Fulfilment operations. AI auto-categorises every suggestion and leadership tracks trends — anonymous to peers." },
      { property: "og:title", content: "Digital Suggestion Box — UBA CoreSphere" },
      { property: "og:description", content: "Submit operational improvement ideas; AI categorises and leadership acts on trends." },
      { property: "og:url", content: "https://ubacoresphere-pulse.lovable.app/suggestions" },
    ],
    links: [{ rel: "canonical", href: "https://ubacoresphere-pulse.lovable.app/suggestions" }],
  }),
  component: SuggestionBox,
});

const STATUS_TONE: Record<string, string> = {
  Submitted: "bg-muted text-muted-foreground border-border",
  "Under Review": "bg-primary/10 text-primary border-primary/30",
  Planned: "bg-[color:var(--warning)]/20 text-[color:var(--warning)] border-[color:var(--warning)]/40",
  Implemented: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30",
  Archived: "bg-muted text-muted-foreground border-border",
};
const STATUSES = ["Submitted", "Under Review", "Planned", "Implemented", "Archived"] as const;

function SuggestionBox() {
  const user = useActiveUser();
  if (!user) return <AppShell>{null}</AppShell>;
  return <SuggestionBoxBody user={user} />;
}

function SuggestionBoxBody({ user }: { user: ActiveUser }) {
  const isMgmt = user.role === "team_lead" || user.role === "ld" || user.role === "group_head";

  const submit = useServerFn(submitSuggestion);
  const loadMine = useServerFn(listMySuggestions);
  const loadAll = useServerFn(listAllSuggestions);
  const setStatus = useServerFn(updateSuggestionStatus);

  const [category, setCategory] = useState<SuggestionCategory>("Process Improvement");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [rows, setRows] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = isMgmt ? await loadAll() : await loadMine();
      setRows(data);
    } catch {
      // signed-out or transient — leave empty
    } finally {
      setLoading(false);
    }
  }, [isMgmt, loadAll, loadMine]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (body.trim().length < 10) {
      toast.error("Please add a little more detail (10+ characters).");
      return;
    }
    setSending(true);
    try {
      await submit({ data: { category, body: body.trim() } });
      toast.success("Suggestion submitted — CoreSphere AI has categorised it.");
      setBody("");
      await refresh();
    } catch {
      toast.error("Could not submit right now. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const onStatus = async (id: string, status: (typeof STATUSES)[number]) => {
    try {
      await setStatus({ data: { id, status } });
      setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
      toast.success(`Marked as ${status}.`);
    } catch {
      toast.error("Could not update status.");
    }
  };

  const trends = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of rows) {
      const key = r.ai_category || r.category || "General";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [rows]);

  const implemented = rows.filter((r) => r.status === "Implemented").length;

  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Engagement & Continuous Improvement</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Digital Suggestion Box</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Share ideas to improve operations. CoreSphere AI categorises every submission — {isMgmt ? "you see all suggestions and trends." : "your entries stay private to leadership."}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label={isMgmt ? "Total Suggestions" : "My Suggestions"} value={rows.length} icon={Inbox} tone="primary" />
        <StatCard label="Implemented" value={implemented} icon={ShieldCheck} tone="success" />
        <StatCard label="Categories" value={trends.length} icon={Sparkles} />
        <StatCard label="AI Categorised" value={rows.filter((r) => r.ai_category).length} icon={Lightbulb} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <PanelCard title="Submit an idea" description="AI will auto-categorise and summarise it" action={<Lightbulb className="h-4 w-4 text-muted-foreground" />}>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SuggestionCategory)}
                className="mt-1 w-full h-9 rounded-md border bg-background px-3 text-sm"
              >
                {SUGGESTION_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Your suggestion</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                maxLength={2000}
                placeholder="Describe your idea and the impact it could have…"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm resize-none"
              />
              <div className="text-[10px] text-muted-foreground mt-1 text-right">{body.length}/2000</div>
            </div>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {sending ? "Submitting…" : "Submit suggestion"}
            </button>
          </form>
        </PanelCard>

        <PanelCard
          className="lg:col-span-2"
          title={isMgmt ? "All suggestions" : "My suggestions"}
          description={isMgmt ? "Anonymous to peers — manage status and act on trends" : "Your submitted ideas and their status"}
          action={<Inbox className="h-4 w-4 text-muted-foreground" />}
        >
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-muted-foreground">No suggestions yet. Be the first to share an idea.</div>
          ) : (
            <ul className="space-y-3 max-h-[420px] overflow-y-auto -mx-1 px-1">
              {rows.map((r) => (
                <li key={r.id} className="rounded-lg border bg-background p-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.ai_category || r.category}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium ${STATUS_TONE[r.status] ?? STATUS_TONE.Submitted}`}>
                      {r.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm mt-1.5">{r.body}</p>
                  {r.ai_summary && (
                    <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <span>{r.ai_summary}</span>
                    </div>
                  )}
                  {isMgmt && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => onStatus(r.id, s)}
                          className={`h-6 px-2 rounded-full border text-[10px] font-medium transition-colors ${r.status === s ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </PanelCard>
      </div>

      {isMgmt && trends.length > 0 && (
        <div className="mt-4">
          <PanelCard title="Suggestion Trends" description="Where ideas are concentrating" action={<TrendingUp className="h-4 w-4 text-muted-foreground" />}>
            <ul className="space-y-3">
              {trends.map(([cat, count]) => {
                const pct = Math.round((count / rows.length) * 100);
                return (
                  <li key={cat}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{cat}</span>
                      <span className="tabular-nums text-muted-foreground">{count} · {pct}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="text-[11px] text-muted-foreground mt-3">
              Trends only — suggestions are never attributed to individuals for HR, promotion or disciplinary purposes.
            </p>
          </PanelCard>
        </div>
      )}
    </AppShell>
  );
}