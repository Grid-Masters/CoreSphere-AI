import { ClipboardCheck, TriangleAlert } from "lucide-react";
import { PanelCard, ProgressBar } from "@/components/ui-bits/Card";
import { memos } from "@/lib/mock-data";
import { useAllAcks } from "@/lib/ack-store";

/**
 * Leader-facing acknowledgement tracker. Mock metrics provide a realistic
 * department baseline; the live (locally persisted) acknowledgements from the
 * current session are layered on top so a leader sees the number tick up after
 * staff acknowledge in-session.
 */
const WORKFORCE = 1284;

// Deterministic baseline rate per memo (mock metric).
function baselineRate(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  return 70 + (h % 26); // 70–95%
}

export function AckTracker({ department }: { department?: string }) {
  const liveAcks = useAllAcks();

  const rows = memos.map((m) => {
    const base = baselineRate(m.id);
    const live = liveAcks.filter((a) => a.targetId === m.id).length;
    // Each live ack nudges the displayed rate slightly upward (capped at 100).
    const rate = Math.min(100, base + Math.min(live, 5));
    const acknowledged = Math.round((rate / 100) * WORKFORCE);
    const overdue = WORKFORCE - acknowledged;
    return { ...m, rate, acknowledged, overdue };
  });

  const avg = Math.round(rows.reduce((s, r) => s + r.rate, 0) / (rows.length || 1));
  const totalOverdue = rows.reduce((s, r) => s + (r.rate < 90 ? r.overdue : 0), 0);

  return (
    <PanelCard
      title="Acknowledgement Tracking"
      description={department ? `${department} — critical content read receipts` : "Enterprise read receipts on critical content"}
      action={<ClipboardCheck className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="flex items-center gap-4 mb-4">
        <div>
          <div className="text-2xl font-semibold tabular-nums">{avg}%</div>
          <div className="text-[11px] text-muted-foreground">Avg acknowledgement</div>
        </div>
        {totalOverdue > 0 && (
          <div className="ml-auto text-right">
            <div className="text-sm font-semibold tabular-nums text-[color:var(--warning)] inline-flex items-center gap-1">
              <TriangleAlert className="h-3.5 w-3.5" /> {totalOverdue.toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground">Outstanding reads</div>
          </div>
        )}
      </div>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id}>
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="truncate">{r.title}</span>
              <span className="tabular-nums text-muted-foreground shrink-0">{r.rate}%</span>
            </div>
            <div className="mt-1">
              <ProgressBar value={r.rate} tone={r.rate >= 90 ? "success" : r.rate >= 80 ? "primary" : "warning"} />
            </div>
          </li>
        ))}
      </ul>
    </PanelCard>
  );
}