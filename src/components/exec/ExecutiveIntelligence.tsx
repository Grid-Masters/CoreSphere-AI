import { Activity, HeartPulse, ShieldCheck, TrendingUp } from "lucide-react";
import { PanelCard, ProgressBar } from "@/components/ui-bits/Card";
import { learningHealth } from "@/lib/knowledge-gaps";

export function ExecutiveIntelligence() {
  const h = learningHealth();
  const tone = h.index >= 85 ? "success" : h.index >= 70 ? "primary" : "warning";
  const ring =
    tone === "success" ? "text-[color:var(--success)]" : tone === "warning" ? "text-[color:var(--warning)]" : "text-primary";

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <PanelCard title="Learning Health Index" description="Composite enterprise learning signal" action={<HeartPulse className="h-4 w-4 text-muted-foreground" />}>
        <div className="flex items-center gap-5">
          <div className="relative h-24 w-24 shrink-0">
            <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
              <circle cx="50" cy="50" r="42" className="stroke-muted" strokeWidth="9" fill="none" />
              <circle
                cx="50" cy="50" r="42"
                className={`${ring} transition-all`}
                strokeWidth="9" fill="none" stroke="currentColor" strokeLinecap="round"
                strokeDasharray={`${(h.index / 100) * 264} 264`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold tabular-nums">{h.index}</span>
              <span className="text-[10px] text-muted-foreground">/100</span>
            </div>
          </div>
          <div>
            <div className={`text-sm font-semibold ${ring}`}>{h.label}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Weighted from SOP adoption, assessment performance, compliance and engagement.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
          <Metric label="SOP Adoption" value={`${h.sopAdoption}%`} />
          <Metric label="Assessments" value={`${h.assessmentPerformance}%`} />
          <Metric label="Compliance" value={`${h.compliance}%`} />
          <Metric label="Engagement" value={`${h.engagement}%`} />
        </div>
      </PanelCard>

      <PanelCard title="Department Readiness" description="SOP adoption by department" action={<TrendingUp className="h-4 w-4 text-muted-foreground" />}>
        <ul className="space-y-3">
          {h.departmentReadiness.map((d) => (
            <li key={d.department}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{d.department}</span>
                <span className="tabular-nums text-muted-foreground">{d.value}%</span>
              </div>
              <div className="mt-1">
                <ProgressBar value={d.value} tone={d.value >= 75 ? "success" : "primary"} />
              </div>
            </li>
          ))}
        </ul>
      </PanelCard>

      <PanelCard title="Knowledge Risk Areas" description="AI-flagged critical gaps" action={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}>
        {h.riskAreas.length ? (
          <ul className="space-y-2">
            {h.riskAreas.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm">
                <Activity className="h-3.5 w-3.5 text-destructive mt-1 shrink-0" />
                <span className="truncate">{r}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-muted-foreground">No critical risk areas this cycle.</div>
        )}
        <p className="text-[11px] text-muted-foreground mt-3">
          Trends only. CoreSphere AI never produces HR, promotion or disciplinary output.
        </p>
      </PanelCard>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold mt-0.5 tabular-nums">{value}</div>
    </div>
  );
}