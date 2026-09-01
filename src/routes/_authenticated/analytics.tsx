import { FixtureNotice } from "@/components/ui-bits/FixtureNotice";
import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, Users, BookOpen, Award, Eye, Search, Sparkles, AlertTriangle, CalendarClock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, StatCard } from "@/components/ui-bits/Card";
import { qaScores } from "@/lib/mock-data";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PRODUCT_ITEMS, isDueForReview, type ProductDetail } from "@/lib/product-knowledge";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Analytics — UBA CoreSphere" },
      { name: "description", content: "Operational analytics and performance insights across UBA Customer Fulfillment on CoreSphere AI." },
      { property: "og:title", content: "Analytics — UBA CoreSphere" },
      { property: "og:description", content: "Operational analytics and performance insights across UBA Customer Fulfillment on CoreSphere AI." },
    ],
  }),
  component: GuardedAnalytics,
});

function GuardedAnalytics() {
  return (
    <RoleGuard allow={["QA_OFFICER", "QA_TEAM_LEAD", "QA_UNIT_HEAD", "LD_OFFICER", "LD_TEAM_LEAD", "LD_UNIT_HEAD", "TEAM_LEAD", "UNIT_HEAD", "HEAD_CFC_OPERATIONS", "GROUP_HEAD"]}>
      <Analytics />
    </RoleGuard>
  );
}

const completion = [
  { dept: "FHD", value: 92 },
  { dept: "Inbound", value: 84 },
  { dept: "Multimedia", value: 78 },
  { dept: "Social Media", value: 70 },
  { dept: "L&D", value: 96 },
  { dept: "QA", value: 88 },
];

function topBy(key: keyof ProductDetail, n = 5): ProductDetail[] {
  return [...PRODUCT_ITEMS].sort((a, b) => (b[key] as number) - (a[key] as number)).slice(0, n);
}

function ProductRankList({ items, valueKey, suffix = "" }: { items: ProductDetail[]; valueKey: keyof ProductDetail; suffix?: string }) {
  const max = Math.max(...items.map((i) => i[valueKey] as number), 1);
  return (
    <ul className="space-y-3">
      {items.map((p) => (
        <li key={p.id}>
          <div className="flex justify-between text-xs mb-1 gap-2">
            <Link to="/knowledge-hub/product/$categoryId/$productId" params={{ categoryId: p.categoryId, productId: p.id }} className="truncate hover:text-primary">
              {p.name} <span className="text-muted-foreground">· {p.categoryName}</span>
            </Link>
            <span className="tabular-nums font-medium shrink-0">{(p[valueKey] as number).toLocaleString()}{suffix}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${((p[valueKey] as number) / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Analytics() {
  const max = Math.max(...qaScores.map((s) => s.score));
  const dueForReview = PRODUCT_ITEMS.filter((p) => isDueForReview(p));
  const avgCompletion = Math.round(PRODUCT_ITEMS.reduce((a, p) => a + p.completion, 0) / PRODUCT_ITEMS.length);
  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Insights</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Analytics Dashboard</h1>
        <FixtureNotice className="mt-2" label="Demonstration/UAT fixture metrics — not live operational analytics" />
        <p className="text-sm text-muted-foreground mt-1">
          Cross-department learning, QA, and engagement insights.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active Users" value="1,284" icon={Users} tone="primary" delta="+4.1% MoM" />
        <StatCard label="SOP Coverage" value="87%" icon={BookOpen} tone="success" />
        <StatCard label="Avg QA Score" value="89%" icon={Award} tone="success" />
        <StatCard label="Engagement Index" value="74" icon={TrendingUp} tone="warning" delta="+6 vs Apr" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <PanelCard title="Department SOP Completion">
          <ul className="space-y-3">
            {completion.map((c) => (
              <li key={c.dept}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{c.dept}</span>
                  <span className="tabular-nums font-medium">{c.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${c.value}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Enterprise QA Trend">
          <div className="flex items-end gap-3 h-48">
            {qaScores.map((s) => (
              <div key={s.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-full">
                  <div
                    className="w-full rounded-t-md bg-primary/70 hover:bg-primary"
                    style={{ height: `${(s.score / max) * 100}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground">{s.month}</div>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>

      <div className="mt-8 mb-4">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Enterprise Knowledge Hub</div>
        <h2 className="text-lg font-semibold tracking-tight mt-1">Product Knowledge Analytics</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Products" value={PRODUCT_ITEMS.length} icon={BookOpen} tone="primary" />
        <StatCard label="Total Views" value={PRODUCT_ITEMS.reduce((a, p) => a + p.views, 0).toLocaleString()} icon={Eye} tone="default" />
        <StatCard label="Avg Completion" value={`${avgCompletion}%`} icon={Award} tone="success" />
        <StatCard label="Due for Review" value={dueForReview.length} icon={CalendarClock} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <PanelCard title="Most Viewed Products" action={<Eye className="h-4 w-4 text-primary" />}>
          <ProductRankList items={topBy("views")} valueKey="views" />
        </PanelCard>
        <PanelCard title="Most Searched Products" action={<Search className="h-4 w-4 text-primary" />}>
          <ProductRankList items={topBy("searches")} valueKey="searches" />
        </PanelCard>
        <PanelCard title="Highest AI Query Products" action={<Sparkles className="h-4 w-4 text-primary" />}>
          <ProductRankList items={topBy("aiQueries")} valueKey="aiQueries" />
        </PanelCard>
        <PanelCard title="Frequently Escalated Products" action={<AlertTriangle className="h-4 w-4 text-primary" />}>
          <ProductRankList items={topBy("escalations")} valueKey="escalations" />
        </PanelCard>
        <PanelCard title="Knowledge Completion (lowest)" action={<Award className="h-4 w-4 text-primary" />}>
          <ProductRankList items={[...PRODUCT_ITEMS].sort((a, b) => a.completion - b.completion).slice(0, 5)} valueKey="completion" suffix="%" />
        </PanelCard>
        <PanelCard title="Products Due for Review" action={<CalendarClock className="h-4 w-4 text-primary" />}>
          {dueForReview.length === 0 ? (
            <p className="text-sm text-muted-foreground">All product knowledge is within its review schedule.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {dueForReview.slice(0, 8).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2">
                  <Link to="/knowledge-hub/product/$categoryId/$productId" params={{ categoryId: p.categoryId, productId: p.id }} className="truncate hover:text-primary">
                    {p.name} <span className="text-muted-foreground">· {p.categoryName}</span>
                  </Link>
                  <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">{p.nextReview}</span>
                </li>
              ))}
            </ul>
          )}
        </PanelCard>
      </div>
    </AppShell>
  );
}