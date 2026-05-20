import { ArrowRight, CalendarClock, CheckCircle2, CircleAlert, Flame, ListChecks } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PanelCard } from "@/components/ui-bits/Card";
import { getWorkflowFor, type WorkflowPriority, type WorkflowStatus, type WorkflowTask } from "@/lib/workflows";
import type { Role } from "@/lib/directory";

function priorityChip(p: WorkflowPriority) {
  if (p === "Critical") return "bg-[color:var(--destructive)]/10 text-[color:var(--destructive)] border-[color:var(--destructive)]/30";
  if (p === "High") return "bg-[color:var(--warning)]/15 text-[color:var(--warning)] border-[color:var(--warning)]/30";
  return "bg-primary/10 text-primary border-primary/20";
}

function statusChip(s: WorkflowStatus) {
  if (s === "Done") return "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30";
  if (s === "Overdue") return "bg-[color:var(--destructive)]/10 text-[color:var(--destructive)] border-[color:var(--destructive)]/30";
  if (s === "In Progress") return "bg-primary/10 text-primary border-primary/20";
  return "bg-muted text-muted-foreground border-border";
}

function StatusIcon({ s }: { s: WorkflowStatus }) {
  if (s === "Done") return <CheckCircle2 className="h-3.5 w-3.5" />;
  if (s === "Overdue") return <Flame className="h-3.5 w-3.5" />;
  return <CircleAlert className="h-3.5 w-3.5" />;
}

function Row({ t }: { t: WorkflowTask }) {
  const Cta = (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
      {t.cta} <ArrowRight className="h-3 w-3" />
    </span>
  );
  return (
    <li className="py-3 flex items-start gap-3 group">
      <div className={`mt-0.5 h-7 w-7 rounded-md border flex items-center justify-center ${priorityChip(t.priority)}`}>
        <StatusIcon s={t.status} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium leading-tight">{t.title}</span>
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] uppercase tracking-wider ${priorityChip(t.priority)}`}>
            {t.priority}
          </span>
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] uppercase tracking-wider ${statusChip(t.status)}`}>
            {t.status}
          </span>
        </div>
        {t.detail && <div className="text-xs text-muted-foreground mt-0.5">{t.detail}</div>}
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <CalendarClock className="h-3 w-3" /> {t.due}
          </div>
          {t.href ? <Link to={t.href}>{Cta}</Link> : <button>{Cta}</button>}
        </div>
      </div>
    </li>
  );
}

export function TodaysWorkflow({ role }: { role: Role }) {
  const tasks = getWorkflowFor(role);
  const done = tasks.filter((t) => t.status === "Done").length;
  const overdue = tasks.filter((t) => t.status === "Overdue").length;
  return (
    <PanelCard
      title="Today's Workflow"
      description={`${tasks.length} operational items • ${done} done • ${overdue} overdue`}
      action={<ListChecks className="h-4 w-4 text-muted-foreground" />}
    >
      <ul className="divide-y -my-2 max-h-[420px] overflow-y-auto pr-1">
        {tasks.map((t) => (
          <Row key={t.id} t={t} />
        ))}
      </ul>
    </PanelCard>
  );
}