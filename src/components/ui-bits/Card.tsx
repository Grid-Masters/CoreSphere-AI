import { cn } from "@/lib/utils";

export function PanelCard({
  title,
  action,
  children,
  className,
  description,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "bg-card border rounded-xl shadow-sm overflow-hidden",
        className,
      )}
    >
      {(title || action) && (
        <header className="px-5 py-4 border-b flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-sm font-semibold tracking-tight">{title}</h3>}
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon?: any;
  tone?: "default" | "primary" | "success" | "warning";
}) {
  const toneClasses = {
    default: "bg-muted text-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
    warning: "bg-[color:var(--warning)]/20 text-[color:var(--warning)]",
  } as const;
  return (
    <div className="bg-card border rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="text-2xl font-semibold mt-2 tabular-nums">{value}</div>
          {delta && (
            <div className="text-xs text-muted-foreground mt-1">{delta}</div>
          )}
        </div>
        {Icon && (
          <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", toneClasses[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export function ProgressBar({ value, tone = "primary" }: { value: number; tone?: "primary" | "success" }) {
  const color = tone === "success" ? "bg-[color:var(--success)]" : "bg-primary";
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} />
    </div>
  );
}

export function StatusBadge({
  status,
}: {
  status: "Approved" | "Pending Approval" | "Archived" | "Completed" | "Pending" | "Failed" | "Locked" | "On Duty" | "On Break";
}) {
  const map: Record<string, string> = {
    Approved: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30",
    Completed: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30",
    "On Duty": "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30",
    "Pending Approval": "bg-[color:var(--warning)]/20 text-[color:var(--warning)] border-[color:var(--warning)]/40",
    Pending: "bg-[color:var(--warning)]/20 text-[color:var(--warning)] border-[color:var(--warning)]/40",
    "On Break": "bg-[color:var(--warning)]/20 text-[color:var(--warning)] border-[color:var(--warning)]/40",
    Failed: "bg-destructive/15 text-destructive border-destructive/30",
    Locked: "bg-muted text-muted-foreground border-border",
    Archived: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium", map[status])}>
      {status}
    </span>
  );
}