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
  Megaphone,
  Scale,
  FileText,
  BookOpen,
  Package,
  ChevronDown,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, ProgressBar, StatusBadge } from "@/components/ui-bits/Card";
import { sops, currentUser } from "@/lib/mock-data";
import { useVideoProgress, useTheoryProgress } from "@/lib/progress-store";
import { PRODUCT_CATEGORIES, productsForCountry, type ProductCategory } from "@/lib/products";
import { COUNTRIES, DEFAULT_COUNTRY, getCountry, type CountryCode } from "@/lib/org-structure";

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
  head: () => ({
    meta: [
      { title: "Enterprise Knowledge Hub — UBA CoreSphere" },
      { name: "description", content: "Search approved UBA SOPs, policies, operational playbooks and product intelligence with AI-powered guidance in the CoreSphere Enterprise Knowledge Hub." },
      { property: "og:title", content: "Enterprise Knowledge Hub — UBA CoreSphere" },
      { property: "og:description", content: "Search approved UBA SOPs, policies, operational playbooks and product intelligence with AI-powered guidance in the CoreSphere Enterprise Knowledge Hub." },
      { property: "og:url", content: "https://ubacoresphere-pulse.lovable.app/knowledge-hub" },
    ],
    links: [{ rel: "canonical", href: "https://ubacoresphere-pulse.lovable.app/knowledge-hub" }],
  }),
  component: KnowledgeHub,
});

type Tab = "sops" | "products";

function KnowledgeHub() {
  const [tab, setTab] = useState<Tab>("sops");

  return (
    <AppShell>
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Operational Knowledge
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Enterprise Knowledge Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Approved SOPs, policies, playbooks and product knowledge for your role.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 border-b">
        <TabButton active={tab === "sops"} onClick={() => setTab("sops")} icon={BookOpen}>
          SOPs &amp; Policies
        </TabButton>
        <TabButton active={tab === "products"} onClick={() => setTab("products")} icon={Package}>
          Product Knowledge
        </TabButton>
      </div>

      {tab === "sops" ? <SopSection /> : <ProductSection />}
    </AppShell>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 h-10 -mb-px text-sm font-medium border-b-2 transition-colors ${
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function SopSection() {
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
    <>
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
    </>
  );
}

function ProductSection() {
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [cat, setCat] = useState<ProductCategory | "All">("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const products = useMemo(() => {
    const query = q.trim().toLowerCase();
    return productsForCountry(country).filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (!query || `${p.name} ${p.overview} ${p.category}`.toLowerCase().includes(query)),
    );
  }, [country, cat, q]);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Verified product knowledge with talking points and escalation paths — {getCountry(country)?.name}.
        </p>
        <label className="text-sm">
          <span className="sr-only">Country</span>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as CountryCode)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} disabled={c.status !== "active"}>
                {c.flag} {c.name}{c.status !== "active" ? " (coming soon)" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {(["All", ...PRODUCT_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c as ProductCategory | "All")}
            className={`h-8 px-3 rounded-full border text-xs font-medium transition-colors ${
              cat === c ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <PanelCard>
          <div className="py-10 text-center text-sm text-muted-foreground">
            <Package className="h-6 w-6 mx-auto mb-2 opacity-60" />
            No products match your filters in {getCountry(country)?.name}.
          </div>
        </PanelCard>
      ) : (
        <div className="space-y-3">
          {products.map((p) => {
            const isOpen = open === p.id;
            return (
              <div key={p.id} className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : p.id)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{p.name}</span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">{p.category}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.tagline}</div>
                  </div>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t grid md:grid-cols-2 gap-5 text-sm">
                    <div className="md:col-span-2">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Overview</div>
                      <p className="text-muted-foreground">{p.overview}</p>
                    </div>
                    <ProductList title="Features" items={p.features} />
                    <ProductList title="Benefits" items={p.benefits} />
                    <ProductList title="Escalation Paths" items={p.escalation} />
                    <ProductList title="Talking Points" items={p.talkingPoints} />
                    <div className="md:col-span-2">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">FAQs</div>
                      <ul className="space-y-2">
                        {p.faqs.map((f, i) => (
                          <li key={i} className="rounded-lg border bg-background p-3">
                            <div className="font-medium">{f.q}</div>
                            <p className="text-muted-foreground mt-1">{f.a}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function ProductList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">{title}</div>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-muted-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
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

