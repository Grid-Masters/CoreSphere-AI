import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, BookOpen, Radio, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, StatCard } from "@/components/ui-bits/Card";
import { ALERT_CATEGORIES, operationalAlerts, incidentLessons, type AlertCategory } from "@/lib/alerts";
import { FixtureNotice } from "@/components/ui-bits/FixtureNotice";

export const Route = createFileRoute("/_authenticated/alerts")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Operational Alert Center — UBA CoreSphere" },
      { name: "description", content: "Live operational alerts across transfers, cards, fraud, channels and compliance, plus an incident learning center for UBA Customer Fulfilment." },
      { property: "og:title", content: "Operational Alert Center — UBA CoreSphere" },
      { property: "og:description", content: "Operational alerts and incident learning for UBA Customer Fulfilment on CoreSphere." },
    ],
  }),
  component: AlertCenter,
});

const sevTone: Record<string, string> = {
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
  High: "bg-[color:var(--warning)]/20 text-[color:var(--warning)] border-[color:var(--warning)]/40",
  Watch: "bg-primary/10 text-primary border-primary/30",
};

function AlertCenter() {
  const [cat, setCat] = useState<AlertCategory | "All">("All");
  const alerts = useMemo(
    () => (cat === "All" ? operationalAlerts : operationalAlerts.filter((a) => a.category === cat)),
    [cat],
  );
  const critical = operationalAlerts.filter((a) => a.severity === "Critical").length;

  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Knowledge & Product Knowledge</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Operational Alert Center</h1>
        <FixtureNotice className="mt-2" />
        <p className="text-sm text-muted-foreground mt-1">
          Real-time operational alerts and reusable lessons from resolved incidents.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="Active Alerts" value={operationalAlerts.length} icon={Radio} tone="primary" />
        <StatCard label="Critical" value={critical} icon={ShieldAlert} tone="warning" />
        <StatCard label="Categories" value={ALERT_CATEGORIES.length} icon={AlertTriangle} />
        <StatCard label="Lessons Logged" value={incidentLessons.length} icon={BookOpen} tone="success" />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(["All", ...ALERT_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c as AlertCategory | "All")}
            className={`h-8 px-3 rounded-full border text-xs font-medium transition-colors ${
              cat === c ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {alerts.map((a) => (
            <div key={a.id} className="bg-card border rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{a.title}</span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{a.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{a.detail}</p>
                </div>
                <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium ${sevTone[a.severity]}`}>
                  {a.severity}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {a.recommended.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-[11px] text-muted-foreground border-t pt-2">
                <span className="font-medium text-foreground">Escalation:</span> {a.escalation}
              </div>
            </div>
          ))}
        </div>

        <div>
          <PanelCard title="Incident Learning Center" description="Lessons from resolved incidents">
            <ul className="space-y-3">
              {incidentLessons.map((l) => (
                <li key={l.id} className="rounded-lg border bg-background p-3">
                  <div className="text-sm font-semibold">{l.title}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{l.category}</div>
                  <p className="text-xs text-muted-foreground mt-2">{l.whatHappened}</p>
                  <p className="text-xs mt-2"><span className="font-medium">Lesson:</span> <span className="text-muted-foreground">{l.lesson}</span></p>
                  {l.linkedSop && (
                    <div className="mt-2 text-[11px] text-primary">Linked SOP: {l.linkedSop}</div>
                  )}
                </li>
              ))}
            </ul>
          </PanelCard>
        </div>
      </div>
    </AppShell>
  );
}
