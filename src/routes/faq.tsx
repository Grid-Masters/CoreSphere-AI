import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, FileQuestion, Lightbulb, Lock, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, StatCard } from "@/components/ui-bits/Card";
import { useActiveUser, type ActiveUser } from "@/lib/active-user";
import { faqs, failedSearches, faqPermissions, type FaqStatus } from "@/lib/faq";
import { knowledgeDecay } from "@/lib/alerts";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ Governance — UBA CoreSphere" },
      { name: "description", content: "Governed FAQ knowledge base with approved answers for UBA operations on CoreSphere AI." },
      { property: "og:title", content: "FAQ Governance — UBA CoreSphere" },
      { property: "og:description", content: "Governed FAQ knowledge base with approved answers for UBA operations on CoreSphere AI." },
      { property: "og:url", content: "https://ubacoresphere-pulse.lovable.app/faq" },
    ],
    links: [{ rel: "canonical", href: "https://ubacoresphere-pulse.lovable.app/faq" }],
  }),
  component: FaqCenter,
});

const statusTone: Record<FaqStatus, string> = {
  Published: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30",
  Draft: "bg-[color:var(--warning)]/20 text-[color:var(--warning)] border-[color:var(--warning)]/40",
  "AI Suggested": "bg-primary/10 text-primary border-primary/30",
};

function FaqCenter() {
  const user = useActiveUser();
  if (!user) return <AppShell>{null}</AppShell>;
  return <FaqCenterBody user={user} />;
}

function FaqCenterBody({ user }: { user: ActiveUser }) {
  const perms = faqPermissions(user.role, user.department);
  const [q, setQ] = useState("");
  const decay = useMemo(
    () => knowledgeDecay(user.role === "team_lead" ? user.department : undefined).filter((d) => d.severity !== "Fresh"),
    [user.role, user.department],
  );

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return faqs.filter((f) => !query || `${f.question} ${f.answer}`.toLowerCase().includes(query));
  }, [q]);

  const canManage = (scope: string, dept?: string) =>
    scope === "Enterprise" ? perms.canPublishEnterprise : perms.canPublishDepartment && (!dept || dept === user.department);

  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Knowledge Governance</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">FAQ Center</h1>
        <p className="text-sm text-muted-foreground mt-1">{perms.scopeNote}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="Published" value={faqs.filter((f) => f.status === "Published").length} icon={CheckCircle2} tone="success" />
        <StatCard label="In Draft" value={faqs.filter((f) => f.status === "Draft").length} icon={FileQuestion} tone="warning" />
        <StatCard label="AI Suggested" value={faqs.filter((f) => f.status === "AI Suggested").length} icon={Sparkles} tone="primary" />
        <StatCard label="Gaps Detected" value={failedSearches.length} icon={AlertCircle} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <PanelCard title="FAQ Library" description="AI may draft & suggest, but only authorised owners can publish">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search FAQs…"
                className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <ul className="space-y-3">
              {filtered.map((f) => {
                const manage = canManage(f.scope, f.department);
                return (
                  <li key={f.id} className="rounded-lg border bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{f.question}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {f.scope}{f.department ? ` • ${f.department}` : ""} • Owner: {f.owner} • Updated {f.updated}
                        </div>
                      </div>
                      <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium ${statusTone[f.status]}`}>
                        {f.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{f.answer}</p>
                    <div className="mt-3 flex items-center gap-2">
                      {f.status !== "Published" ? (
                        manage ? (
                          <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
                            Review & Publish
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Lock className="h-3 w-3" /> Awaiting authorised publisher
                          </span>
                        )
                      ) : manage ? (
                        <button className="h-8 px-3 rounded-md border text-xs font-medium hover:bg-muted">Edit</button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">{f.views.toLocaleString()} views</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </PanelCard>
        </div>

        <div className="space-y-4">
          <PanelCard title="FAQ Gap Detector" description="AI-flagged from failed searches" action={<Lightbulb className="h-4 w-4 text-muted-foreground" />}>
            <ul className="space-y-3">
              {failedSearches.map((s) => (
                <li key={s.id} className="rounded-lg border bg-background p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">“{s.query}”</span>
                    <span className="text-xs font-semibold text-[color:var(--warning)] tabular-nums shrink-0">{s.count}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{s.recommendation}</p>
                  {perms.canPublishEnterprise || perms.canPublishDepartment ? (
                    <button className="mt-2 text-[11px] text-primary hover:underline">Draft FAQ with AI →</button>
                  ) : perms.canRequest ? (
                    <button className="mt-2 text-[11px] text-primary hover:underline">Request FAQ →</button>
                  ) : null}
                </li>
              ))}
            </ul>
          </PanelCard>

          <PanelCard title="Governance">
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2"><Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" /> CoreSphere AI suggests, drafts and detects gaps — it cannot publish.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--success)] mt-0.5 shrink-0" /> Team Leads manage department FAQs.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--success)] mt-0.5 shrink-0" /> L&D manages enterprise FAQs.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--success)] mt-0.5 shrink-0" /> Group Head views all and requests new FAQs.</li>
            </ul>
          </PanelCard>

          <PanelCard title="Knowledge Decay Detection" description="Ageing or under-adopted SOPs to refresh">
            {decay.length === 0 ? (
              <p className="text-xs text-muted-foreground">All knowledge is fresh — nothing to refresh right now.</p>
            ) : (
              <ul className="space-y-3">
                {decay.slice(0, 5).map((d) => (
                  <li key={d.sop.id} className="rounded-lg border bg-background p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{d.sop.title}</span>
                      <span className={`shrink-0 text-[10px] font-semibold ${d.severity === "Stale" ? "text-destructive" : "text-[color:var(--warning)]"}`}>{d.severity}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">{d.sop.department} • {d.ageDays}d since update • {d.adoption}% adoption</div>
                    <p className="text-[11px] text-muted-foreground mt-1">{d.recommendation}</p>
                  </li>
                ))}
              </ul>
            )}
          </PanelCard>
        </div>
      </div>
    </AppShell>
  );
}