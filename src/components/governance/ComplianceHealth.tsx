import { ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import { PanelCard } from "@/components/ui-bits/Card";
import { AnimatedCounter } from "@/components/ui-bits/AnimatedCounter";
import { bandColor, getComplianceHealth } from "@/lib/compliance-health";

export function ComplianceHealth({ department, scope = "Enterprise" }: { department?: string; scope?: string }) {
  const snap = getComplianceHealth(department);
  const positive = snap.delta >= 0;
  const ring = `conic-gradient(var(--color-primary) ${snap.score * 3.6}deg, color-mix(in oklab, var(--color-muted) 60%, transparent) 0deg)`;

  return (
    <PanelCard
      title="Compliance Health"
      description={`${scope} composite — updated every shift`}
      action={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0 rounded-full" style={{ backgroundImage: ring }}>
          <div className="absolute inset-2 rounded-full bg-card border flex flex-col items-center justify-center">
            <AnimatedCounter value={snap.score} suffix="%" className={`text-2xl font-semibold tabular-nums ${bandColor(snap.band)}`} />
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{snap.band}</div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1 text-xs">
            {positive ? (
              <TrendingUp className="h-3.5 w-3.5 text-[color:var(--success)]" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-[color:var(--destructive)]" />
            )}
            <span className={positive ? "text-[color:var(--success)]" : "text-[color:var(--destructive)]"}>
              {positive ? "+" : ""}{snap.delta} pts vs last month
            </span>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {snap.metrics.map((m) => (
              <li key={m.label} className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground truncate">{m.label}</span>
                <span className="tabular-nums font-medium">
                  {m.tone === "warning" ? m.value : `${m.value}%`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PanelCard>
  );
}