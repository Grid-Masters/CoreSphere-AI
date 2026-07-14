import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Lock, ChevronRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, StatusBadge } from "@/components/ui-bits/Card";
import { currentUser } from "@/lib/mock-data";
import { getTile } from "@/lib/product-knowledge";

export const Route = createFileRoute("/knowledge-hub/product/$categoryId")({
  head: ({ params }) => {
    const tile = getTile(params.categoryId);
    const title = tile ? `${tile.name} — Product Knowledge` : "Product Knowledge";
    const desc = tile?.description ?? "UBA product knowledge in the Enterprise Knowledge Hub.";
    const url = `https://ubacoresphere-pulse.lovable.app/knowledge-hub/product/${params.categoryId}`;
    return {
      meta: [
        { title: `${title} — UBA CoreSphere` },
        { name: "description", content: desc },
        { property: "og:title", content: `${title} — UBA CoreSphere` },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  loader: ({ params }) => {
    const tile = getTile(params.categoryId);
    if (!tile) throw notFound();
    return { tile };
  },
  notFoundComponent: CatalogueNotFound,
  errorComponent: CatalogueNotFound,
  component: Catalogue,
});

function CatalogueNotFound() {
  return (
    <AppShell>
      <PanelCard>
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">This product catalogue could not be found.</p>
          <Link to="/knowledge-hub" className="inline-flex items-center gap-1 text-sm text-primary mt-3">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Enterprise Knowledge Hub
          </Link>
        </div>
      </PanelCard>
    </AppShell>
  );
}

function Catalogue() {
  const { tile } = Route.useLoaderData();
  const Icon = tile.icon;
  return (
    <AppShell>
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <Link to="/knowledge-hub" className="hover:text-foreground">Enterprise Knowledge Hub</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{tile.name}</span>
      </nav>

      <div className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${tile.gradient} p-6 mb-6 text-white`}>
        <div className="absolute inset-0 [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07]" />
        <Icon className="absolute right-4 bottom-2 h-24 w-24 text-white/15" strokeWidth={1.2} />
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/70">Product Knowledge</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">{tile.name}</h1>
        <p className="text-sm text-white/80 mt-1 max-w-2xl">{tile.description}</p>
      </div>

      <h2 className="sr-only">{tile.name} product catalogue</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tile.items.map((p: typeof tile.items[number]) => (
          <Link
            key={p.id}
            to="/knowledge-hub/product/$categoryId/$productId"
            params={{ categoryId: tile.id, productId: p.id }}
            className="group block bg-card border rounded-xl p-4 shadow-sm hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                {p.name}
              </h3>
              <StatusBadge status={p.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{p.tagline}</p>
            <div className="mt-3 pt-3 border-t flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{p.version} · Reviewed {p.lastReview}</span>
              <span className="inline-flex items-center gap-1">
                <Lock className="h-3 w-3" /> {currentUser.department}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <PanelCard
        className="mt-6 bg-gradient-to-br from-primary/5 to-transparent"
        title="Ask CoreSphere AI"
        description={`Get instant guidance on ${tile.name} products.`}
        action={<Sparkles className="h-4 w-4 text-primary" />}
      >
        <p className="text-sm text-muted-foreground">
          Try: "Explain eligibility for {tile.items[0]?.name}" or "What's the escalation path for a {tile.name.toLowerCase()} dispute?"
        </p>
      </PanelCard>
    </AppShell>
  );
}
