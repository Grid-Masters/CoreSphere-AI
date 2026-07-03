import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, Package, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard } from "@/components/ui-bits/Card";
import { PRODUCT_CATEGORIES, productsForCountry, type ProductCategory } from "@/lib/products";
import { COUNTRIES, DEFAULT_COUNTRY, getCountry, type CountryCode } from "@/lib/org-structure";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Product Intelligence Hub — UBA CoreSphere" },
      { name: "description", content: "Country-aware product knowledge: features, benefits, FAQs, escalation paths and talking points for UBA Customer Fulfilment." },
      { property: "og:title", content: "Product Intelligence Hub — UBA CoreSphere" },
      { property: "og:description", content: "Country-aware product knowledge for UBA Customer Fulfilment operations on CoreSphere." },
      { property: "og:url", content: "https://ubacoresphere-pulse.lovable.app/products" },
    ],
    links: [{ rel: "canonical", href: "https://ubacoresphere-pulse.lovable.app/products" }],
  }),
  component: ProductHub,
});

function ProductHub() {
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
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Knowledge & Product Intelligence</div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Product Intelligence Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verified product knowledge with talking points and escalation paths — {getCountry(country)?.name}.
          </p>
        </div>
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
                    <Section title="Features" items={p.features} />
                    <Section title="Benefits" items={p.benefits} />
                    <Section title="Escalation Paths" items={p.escalation} />
                    <Section title="Talking Points" items={p.talkingPoints} />
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
    </AppShell>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
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
