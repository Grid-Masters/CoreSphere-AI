import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft, ChevronRight, Sparkles, BookOpen, GraduationCap, MessageSquare,
  ListChecks, GitBranch, ShieldCheck, AlertTriangle, Receipt, Users, FileText,
  HelpCircle, PlayCircle, Clock, History, Lock, ScrollText,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, StatusBadge } from "@/components/ui-bits/Card";
import { currentUser } from "@/lib/mock-data";
import { getProduct, getTile, isDueForReview } from "@/lib/product-knowledge";
import { OPEN_AI_EVENT } from "@/components/CoreSphereAI";

export const Route = createFileRoute("/knowledge-hub/product/$categoryId/$productId")({
  head: ({ params }) => {
    const p = getProduct(params.productId);
    const title = p ? `${p.name} — ${p.categoryName}` : "Product Knowledge";
    const desc = p?.overview ?? "UBA product knowledge in the Enterprise Knowledge Hub.";
    const url = `https://ubacoresphere-pulse.lovable.app/knowledge-hub/product/${params.categoryId}/${params.productId}`;
    return {
      meta: [
        { title: `${title} — UBA CoreSphere` },
        { name: "description", content: desc },
        { property: "og:title", content: `${title} — UBA CoreSphere` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  loader: ({ params }) => {
    const p = getProduct(params.productId);
    const tile = getTile(params.categoryId);
    if (!p || !tile) throw notFound();
    return { product: p, tile };
  },
  notFoundComponent: DetailNotFound,
  errorComponent: DetailNotFound,
  component: ProductDetailPage,
});

function DetailNotFound() {
  return (
    <AppShell>
      <PanelCard>
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">This product could not be found.</p>
          <Link to="/knowledge-hub" className="inline-flex items-center gap-1 text-sm text-primary mt-3">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Enterprise Knowledge Hub
          </Link>
        </div>
      </PanelCard>
    </AppShell>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <PanelCard title={title} action={<Icon className="h-4 w-4 text-primary" />}>
      {children}
    </PanelCard>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-sm">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-2 text-muted-foreground">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function ProductDetailPage() {
  const { product: p, tile } = Route.useLoaderData();
  const due = isDueForReview(p);

  const askAI = () => window.dispatchEvent(new CustomEvent(OPEN_AI_EVENT));

  return (
    <AppShell>
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 flex-wrap">
        <Link to="/knowledge-hub" className="hover:text-foreground">Enterprise Knowledge Hub</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/knowledge-hub/product/$categoryId" params={{ categoryId: tile.id }} className="hover:text-foreground">
          {tile.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{p.name}</span>
      </nav>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Product Knowledge · {p.categoryName}</div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">{p.name}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{p.tagline}</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <StatusBadge status={p.status} />
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{p.version}</span>
            {due && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[color:var(--warning)]/20 text-[color:var(--warning)]">
                Due for review
              </span>
            )}
          </div>
        </div>
        <button
          onClick={askAI}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Sparkles className="h-4 w-4" /> Ask CoreSphere AI
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Section title="Product Overview" icon={BookOpen}>
            <p className="text-sm text-muted-foreground">{p.overview}</p>
          </Section>
          <Section title="Theory" icon={GraduationCap}>
            <p className="text-sm text-muted-foreground">{p.theory}</p>
          </Section>
          <Section title="Customer Talking Points" icon={MessageSquare}>
            <Bullets items={p.talkingPoints} />
          </Section>
          <Section title="Operational Workflow" icon={ListChecks}>
            <ol className="space-y-2 text-sm">
              {p.workflow.map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold flex items-center justify-center">{i + 1}</span>
                  <span>{w}</span>
                </li>
              ))}
            </ol>
          </Section>
          <div className="grid sm:grid-cols-2 gap-4">
            <Section title="Eligibility" icon={Users}><Bullets items={p.eligibility} /></Section>
            <Section title="Exceptions" icon={AlertTriangle}><Bullets items={p.exceptions} /></Section>
          </div>
          <Section title="Fees & Charges" icon={Receipt}>
            <ul className="divide-y text-sm">
              {p.fees.map((f, i) => (
                <li key={i} className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">{f.label}</span>
                  <span className="font-medium">{f.value}</span>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Escalation Path" icon={GitBranch}><Bullets items={p.escalation} /></Section>
          <Section title="Quick Reference Guide" icon={ScrollText}><Bullets items={p.quickReference} /></Section>
        </div>

        <div className="space-y-4">
          <Section title="Governance" icon={ShieldCheck}>
            <dl className="text-sm space-y-2">
              <div className="flex justify-between"><dt className="text-muted-foreground">Owner</dt><dd className="font-medium text-right">{p.owner}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Version</dt><dd className="font-medium">{p.version}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Last review</dt><dd className="font-medium">{p.lastReview}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Next review</dt><dd className="font-medium">{p.nextReview}</dd></div>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
                <Lock className="h-3 w-3" /> Maker-checker · immutable audit trail
              </div>
            </dl>
          </Section>

          <Section title="Version History" icon={History}>
            <ul className="space-y-3 text-sm">
              {p.versionHistory.map((v, i) => (
                <li key={i} className="relative pl-4 border-l border-border">
                  <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{v.version}</span>
                    <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" />{v.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{v.note}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Related SOPs" icon={FileText}>
            <ul className="space-y-1.5 text-sm">
              {p.relatedSops.map((s, i) => (
                <li key={i}>
                  <Link to="/knowledge-hub" className="text-primary hover:underline inline-flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> {s}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Related Policies" icon={ShieldCheck}><Bullets items={p.relatedPolicies} /></Section>
          <Section title="Related FAQs" icon={HelpCircle}>
            <ul className="space-y-1.5 text-sm">
              {p.relatedFaqs.map((f, i) => (
                <li key={i}><Link to="/faq" className="text-primary hover:underline">{f}</Link></li>
              ))}
            </ul>
          </Section>
          <Section title="Related Assessments" icon={GraduationCap}>
            <ul className="space-y-1.5 text-sm">
              {p.relatedAssessments.map((a, i) => (
                <li key={i}><Link to="/assessments" className="text-primary hover:underline">{a}</Link></li>
              ))}
            </ul>
          </Section>
          <Section title="Training Videos" icon={PlayCircle}>
            <ul className="space-y-2 text-sm">
              {p.videos.map((v, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg border bg-background p-3">
                  <span className="inline-flex items-center gap-2"><PlayCircle className="h-4 w-4 text-primary" /> {v.title}</span>
                  <span className="text-[11px] text-muted-foreground tabular-nums">{v.duration}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
