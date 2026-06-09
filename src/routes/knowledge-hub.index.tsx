import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Sparkles,
  PlayCircle,
  Lock,
  CreditCard,
  ShieldAlert,
  Headphones,
  Mail,
  MessageSquare,
  Megaphone,
  Scale,
  FileText,
  BookOpen,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, ProgressBar, StatusBadge } from "@/components/ui-bits/Card";
import { sops, currentUser } from "@/lib/mock-data";
import { useVideoProgress, useTheoryProgress } from "@/lib/progress-store";

const categoryStyles: Record<
  string,
  { gradient: string; icon: any }
> = {
  "Cards Operations": { gradient: "from-rose-600 via-red-700 to-rose-900", icon: CreditCard },
  Containment: { gradient: "from-amber-500 via-orange-600 to-red-700", icon: ShieldAlert },
  "Customer Service": { gradient: "from-sky-600 via-blue-700 to-indigo-800", icon: Headphones },
  Multimedia: { gradient: "from-fuchsia-600 via-purple-700 to-indigo-800", icon: Mail },
  Reputation: { gradient: "from-emerald-600 via-teal-700 to-slate-800", icon: Megaphone },
  Compliance: { gradient: "from-slate-700 via-slate-800 to-zinc-900", icon: Scale },
  Operations: { gradient: "from-cyan-600 via-blue-700 to-slate-800", icon: FileText },
};

function thumbFor(cat: string) {
  return categoryStyles[cat] ?? { gradient: "from-primary via-primary/80 to-rose-900", icon: BookOpen };
}

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
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            aria-label="Search SOPs and policies"
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

      <h2 className="sr-only">Standard Operating Procedures</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((s) => (
          <SopCard key={s.id} sop={s} />
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

function SopCard({ sop: s }: { sop: (typeof sops)[number] }) {
  const { gradient, icon: Icon } = thumbFor(s.category);
  const [theoryPct] = useTheoryProgress(s.id, s.theoryProgress);
  const [videoPct] = useVideoProgress(s.id, s.videoProgress);
  return (
    <div className="relative">
      {/* Soft ground shadow */}
      <div
        aria-hidden
        className="absolute -bottom-2 left-3 right-3 h-3 rounded-full bg-foreground/15 blur-md opacity-60 group-hover:opacity-90 transition-opacity"
      />
      <Link
        to="/knowledge-hub/$sopId"
        params={{ sopId: s.id }}
        className="group relative block bg-card border rounded-xl overflow-hidden shadow-md shadow-black/5 hover:border-primary/50 hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col"
      >
              {/* Thumbnail */}
              <div className={`relative aspect-[16/10] bg-gradient-to-br ${gradient} overflow-hidden`}>
                <div className="absolute inset-0 opacity-30 mix-blend-overlay [background-image:radial-gradient(circle_at_20%_20%,white,transparent_45%),radial-gradient(circle_at_80%_70%,white,transparent_50%)]" />
                <div className="absolute inset-0 [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07]" />
                <Icon className="absolute right-4 bottom-4 h-20 w-20 text-white/15" strokeWidth={1.2} />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider bg-black/40 text-white px-2 py-1 rounded backdrop-blur-sm font-medium">
                    {s.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge status={s.status} />
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <PlayCircle className="h-5 w-5 drop-shadow" />
                  <span className="text-[11px] font-medium drop-shadow">Theory + Video</span>
                </div>
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center text-white/10 text-2xl font-bold rotate-[-18deg] select-none pointer-events-none tracking-widest"
                >
                  UBA • INTERNAL
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {s.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 flex-1">
                  {s.summary}
                </p>
                <div className="mt-3 space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground inline-flex items-center gap-1">
                        <BookOpen className="h-3 w-3" /> Theory
                      </span>
                      <span className="tabular-nums font-medium">{theoryPct}%</span>
                    </div>
                    <div className="mt-1">
                      <ProgressBar value={theoryPct} tone="success" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground inline-flex items-center gap-1">
                        <PlayCircle className="h-3 w-3" /> Video
                      </span>
                      <span className="tabular-nums font-medium">{videoPct}%</span>
                    </div>
                    <div className="mt-1">
                      <ProgressBar value={videoPct} tone="primary" />
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Updated {s.updated}</span>
                  <span className="inline-flex items-center gap-1">
                    <Lock className="h-3 w-3" /> {currentUser.department}
                  </span>
                </div>
              </div>
      </Link>
    </div>
  );
}