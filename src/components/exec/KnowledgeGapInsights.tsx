import { AlertTriangle, BookX, FileQuestion, Lightbulb, TrendingDown } from "lucide-react";
import { PanelCard } from "@/components/ui-bits/Card";
import { knowledgeGaps, type GapSeverity, type KnowledgeGap } from "@/lib/knowledge-gaps";

const sevTone: Record<GapSeverity, string> = {
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
  High: "bg-[color:var(--warning)]/20 text-[color:var(--warning)] border-[color:var(--warning)]/40",
  Watch: "bg-muted text-muted-foreground border-border",
};

function typeIcon(t: KnowledgeGap["type"]) {
  if (t === "SOP Adoption") return TrendingDown;
  if (t === "Assessment") return BookX;
  return FileQuestion;
}

export function KnowledgeGapInsights({ department, title }: { department?: string; title?: string }) {
  const gaps = knowledgeGaps(department).slice(0, 6);
  return (
    <PanelCard
      title={title ?? "AI Knowledge Gap Engine"}
      description={department ? `${department} learning risks detected by CoreSphere AI` : "Enterprise learning risks detected by CoreSphere AI"}
      action={<Lightbulb className="h-4 w-4 text-muted-foreground" />}
    >
      <ul className="space-y-3">
        {gaps.map((g) => {
          const Icon = typeIcon(g.type);
          return (
            <li key={g.id} className="rounded-lg border bg-background p-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{g.title}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium ${sevTone[g.severity]}`}>
                      {g.severity}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{g.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{g.detail}</p>
                  <div className="mt-2 flex items-start gap-1.5 text-xs">
                    <Lightbulb className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <span>{g.recommendation}</span>
                  </div>
                </div>
                <div className="text-xs font-semibold tabular-nums text-muted-foreground shrink-0">{g.metric}</div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <AlertTriangle className="h-3.5 w-3.5" />
        Development insights only — not used for HR, promotion or disciplinary decisions.
      </div>
    </PanelCard>
  );
}