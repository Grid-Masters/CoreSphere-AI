import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, XCircle, Lock, GraduationCap, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, StatCard, StatusBadge } from "@/components/ui-bits/Card";
import { assessments } from "@/lib/mock-data";

export const Route = createFileRoute("/assessments")({
  head: () => ({ meta: [{ title: "Assessments — UBA CoreSphere" }] }),
  component: Assessments,
});

const iconFor = (s: string) =>
  s === "Completed" ? CheckCircle2 : s === "Pending" ? Clock : s === "Failed" ? XCircle : Lock;

function Assessments() {
  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Learning</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Assessments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Weekly SOP quizzes and monthly L&D assessments. Two failed attempts will lock the
          assessment until reviewed by L&D.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="Completed" value={1} icon={CheckCircle2} tone="success" />
        <StatCard label="Pending" value={2} icon={Clock} tone="warning" />
        <StatCard label="Failed" value={1} icon={XCircle} />
        <StatCard label="Locked" value={1} icon={Lock} />
      </div>

      <PanelCard title="Your Assessments">
        <ul className="divide-y -my-2">
          {assessments.map((a) => {
            const Icon = iconFor(a.status);
            const locked = a.status === "Locked";
            return (
              <li key={a.id} className="py-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {a.type} • Attempts: {a.attempts}/2
                    {a.score !== null && <span> • Last score: {a.score}%</span>}
                  </div>
                </div>
                <StatusBadge status={a.status as any} />
                <button
                  disabled={locked}
                  className={`h-9 px-4 rounded-md text-xs font-medium inline-flex items-center gap-1 ${
                    locked
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {a.status === "Completed" ? "Review" : a.status === "Failed" ? "Retake" : a.status === "Locked" ? "Locked" : "Start"}
                  {!locked && <ChevronRight className="h-3.5 w-3.5" />}
                </button>
              </li>
            );
          })}
        </ul>
      </PanelCard>
    </AppShell>
  );
}