import { Brain, Sparkles, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { PanelCard } from "@/components/ui-bits/Card";
import { atRiskStaff, bandColor, type AtRiskStaffEntry } from "@/lib/at-risk";

function TrendIcon({ t }: { t: AtRiskStaffEntry["trend"] }) {
  if (t === "up") return <TrendingUp className="h-3.5 w-3.5 text-[color:var(--destructive)]" />;
  if (t === "down") return <TrendingDown className="h-3.5 w-3.5 text-[color:var(--success)]" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

export function AtRiskStaff({ department }: { department?: string }) {
  const list = department
    ? atRiskStaff.filter((s) => s.department.toLowerCase() === department.toLowerCase())
    : atRiskStaff;

  const view = list.length ? list : atRiskStaff.slice(0, 2);

  return (
    <PanelCard
      title="AI: At-Risk Staff Detection"
      description={department ? `Scoped to ${department}` : "Enterprise — composite risk model"}
      action={
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary">
          <Sparkles className="h-3 w-3" /> AI scoring
        </span>
      }
    >
      {view.length === 0 ? (
        <div className="text-sm text-muted-foreground py-2">No at-risk staff detected this cycle.</div>
      ) : (
        <ul className="space-y-3">
          {view.map((s) => (
            <li key={s.id} className="rounded-lg border bg-background/50 p-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                  {s.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium truncate">{s.name}</span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] uppercase tracking-wider ${bandColor(s.band)}`}>
                      <TrendIcon t={s.trend} /> {s.band}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">{s.department} • {s.unit}</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-semibold tabular-nums">{s.riskScore}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Risk</div>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {s.factors.map((f) => (
                  <span key={f.label} className="text-[10px] px-1.5 py-0.5 rounded border bg-muted text-muted-foreground">
                    {f.label}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex items-start gap-2 text-[12px] bg-primary/5 border border-primary/15 rounded-md p-2">
                <Brain className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <span className="leading-snug">{s.recommendation}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PanelCard>
  );
}