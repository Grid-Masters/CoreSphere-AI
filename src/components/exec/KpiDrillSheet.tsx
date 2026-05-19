import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export type DrillRow = {
  label: string;
  primary: string | number;
  secondary?: string;
  trend?: number; // -100..100
};

export type KpiDrill = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  metric: string;
  delta?: string;
  sparkline?: number[];
  rows: DrillRow[];
  watchlist?: DrillRow[];
};

function Sparkline({ values }: { values: number[] }) {
  if (!values.length) return null;
  const w = 280;
  const h = 56;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1 || 1);
  const points = values
    .map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 6) - 3}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="text-primary"
        points={points}
      />
    </svg>
  );
}

function Row({ row, tone }: { row: DrillRow; tone?: "positive" | "negative" | "neutral" }) {
  const trendClass =
    tone === "negative"
      ? "text-[color:var(--destructive)]"
      : tone === "positive"
      ? "text-[color:var(--success)]"
      : "text-muted-foreground";
  return (
    <li className="py-2.5 flex items-center gap-3 border-b last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{row.label}</div>
        {row.secondary && (
          <div className="text-[11px] text-muted-foreground truncate">{row.secondary}</div>
        )}
      </div>
      <div className="text-sm font-semibold tabular-nums">{row.primary}</div>
      {typeof row.trend === "number" && (
        <div className={`text-[11px] tabular-nums w-12 text-right ${trendClass}`}>
          {row.trend > 0 ? "+" : ""}
          {row.trend}
        </div>
      )}
    </li>
  );
}

export function KpiDrillSheet({
  open,
  onOpenChange,
  title,
  description,
  metric,
  delta,
  sparkline,
  rows,
  watchlist,
}: KpiDrill) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Current
              </div>
              <div className="text-3xl font-semibold tracking-tight tabular-nums">{metric}</div>
              {delta && <div className="text-xs text-muted-foreground mt-1">{delta}</div>}
            </div>
          </div>
          {sparkline && sparkline.length > 0 && (
            <div className="mt-4">
              <Sparkline values={sparkline} />
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                6-month trend
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
            Department breakdown
          </div>
          <ul className="divide-y -my-2">
            {rows.map((r) => (
              <Row key={r.label} row={r} tone="positive" />
            ))}
          </ul>
        </div>

        {watchlist && watchlist.length > 0 && (
          <div className="mt-6">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              Watch list
            </div>
            <ul className="divide-y -my-2">
              {watchlist.map((r) => (
                <Row key={r.label} row={r} tone="negative" />
              ))}
            </ul>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}