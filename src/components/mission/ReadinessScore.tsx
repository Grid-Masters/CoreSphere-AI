import { ShieldCheck, Info } from "lucide-react";
import { PanelCard, ProgressBar } from "@/components/ui-bits/Card";
import {
  readinessBreakdown,
  readinessScore,
  readinessLabel,
  READINESS_WEIGHTS,
} from "@/lib/gamification";
import type { DirectoryEntry } from "@/lib/directory";

const ROWS: { key: keyof ReturnType<typeof readinessBreakdown>; label: string }[] = [
  { key: "sopCompletion", label: "SOP Completion" },
  { key: "videoCompletion", label: "Video Completion" },
  { key: "assessmentScore", label: "Assessment Scores" },
  { key: "qaScore", label: "QA Scores" },
  { key: "compliance", label: "Compliance" },
  { key: "consistency", label: "Learning Consistency" },
];

export function ReadinessScore({ user }: { user: DirectoryEntry }) {
  const score = readinessScore(user);
  const { label, tone } = readinessLabel(score);
  const b = readinessBreakdown(user);
  const ring =
    tone === "success"
      ? "text-[color:var(--success)]"
      : tone === "warning"
        ? "text-[color:var(--warning)]"
        : "text-primary";
  const circumference = 2 * Math.PI * 52;

  return (
    <PanelCard
      title="CoreSphere Readiness Score"
      description="Operational development indicator"
      action={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative h-32 w-32 shrink-0">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="10" className="stroke-muted" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              className={`${ring} transition-all duration-700`}
              stroke="currentColor"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (score / 100) * circumference}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-semibold tabular-nums">{score}%</div>
            <div className={`text-[11px] font-medium ${ring}`}>{label}</div>
          </div>
        </div>
        <div className="flex-1 w-full space-y-2.5">
          {ROWS.map((r) => (
            <div key={r.key}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">
                  {r.label}{" "}
                  <span className="opacity-60">· {Math.round(READINESS_WEIGHTS[r.key] * 100)}%</span>
                </span>
                <span className="tabular-nums font-medium">{b[r.key]}%</span>
              </div>
              <div className="mt-1">
                <ProgressBar value={b[r.key]} tone={b[r.key] >= 85 ? "success" : "primary"} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-start gap-2 text-[11px] text-muted-foreground border-t pt-3">
        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        For learning & development only. Not a performance appraisal and not used for
        promotion, pay or disciplinary decisions.
      </div>
    </PanelCard>
  );
}