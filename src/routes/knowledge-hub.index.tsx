import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Filter, ShieldCheck, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, ProgressBar, StatusBadge } from "@/components/ui-bits/Card";
import { sops } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge-hub/")({
  head: () => ({ meta: [{ title: "Knowledge Hub — UBA CoreSphere" }] }),
  component: KnowledgeHub,
});

function KnowledgeHub() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const cats = ["All", ...Array.from(new Set(sops.map((s) => s.category)))];

  const filtered = useMemo(
    () =>
      sops.filter(
        (s) =>
          (cat === "All" || s.category === cat) &&
          (q === "" || s.title.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, cat],
  );

  return (
    <AppShell>
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Operational Knowledge
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Knowledge Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Approved SOPs, policies, and operational playbooks for your role.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground border rounded-md px-3 py-1.5 bg-card">
          <ShieldCheck className="h-3.5 w-3.5" /> Internal Banking Use Only • No download
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="AI-powered search across SOPs and policies…"
            className="w-full h-11 pl-10 pr-4 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-xs px-3 h-8 rounded-full border transition-colors ${
                cat === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <Link
            key={s.id}
            to="/knowledge-hub/$sopId"
            params={{ sopId: s.id }}
            className="group bg-card border rounded-xl p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <StatusBadge status={s.status} />
            </div>
            <h3 className="mt-4 text-base font-semibold leading-snug group-hover:text-primary transition-colors">
              {s.title}
            </h3>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">
              {s.category}
            </div>
            <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{s.summary}</p>
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="tabular-nums font-medium">{s.progress}%</span>
              </div>
              <div className="mt-1.5">
                <ProgressBar value={s.progress} tone="success" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Updated {s.updated}</span>
              <span className="inline-flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition">
                Open <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <PanelCard
        className="mt-6 bg-gradient-to-br from-primary/5 to-transparent"
        title="Ask CoreSphere AI"
        description="Find the right SOP, summarise a policy, or get instant operational guidance."
        action={<Sparkles className="h-4 w-4 text-primary" />}
      >
        <p className="text-sm text-muted-foreground">
          Try: "What's the escalation path for a suspected card-not-present fraud?" or "Quiz me on
          Live Chat tone standards."
        </p>
      </PanelCard>
    </AppShell>
  );
}