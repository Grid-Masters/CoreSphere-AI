import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { scenarios, type OperationalScenario } from "@/lib/scenarios";

function sevClass(s: OperationalScenario["severity"]) {
  if (s === "Critical") return "border-[color:var(--destructive)]/40 bg-[color:var(--destructive)]/5";
  if (s === "High") return "border-[color:var(--warning)]/40 bg-[color:var(--warning)]/5";
  return "border-primary/30 bg-primary/5";
}

export function ScenarioBanner() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % scenarios.length), 18000);
    return () => clearInterval(t);
  }, []);
  const sc = scenarios[idx];
  return (
    <div className={`mb-4 rounded-xl border p-4 ${sevClass(sc.severity)}`}>
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-md bg-card border flex items-center justify-center">
          {sc.severity === "Critical" ? (
            <ShieldAlert className="h-4 w-4 text-[color:var(--destructive)]" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-[color:var(--warning)]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
              Operational Scenario • {sc.severity}
            </span>
          </div>
          <h4 className="text-sm font-semibold mt-0.5">{sc.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{sc.detail}</p>
          <div className="mt-2 grid md:grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Recommended actions</div>
              <ul className="space-y-0.5">
                {sc.recommended.map((r) => (
                  <li key={r} className="text-[12px] flex items-start gap-1.5">
                    <ArrowRight className="h-3 w-3 mt-0.5 text-primary shrink-0" /> {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Escalation</div>
              <p className="text-[12px] leading-snug">{sc.escalation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}