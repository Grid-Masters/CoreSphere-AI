import { createFileRoute } from "@tanstack/react-router";
import { StickyNote, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard } from "@/components/ui-bits/Card";
import { memos } from "@/lib/mock-data";

export const Route = createFileRoute("/memos")({
  head: () => ({ meta: [{ title: "Operations Memos — UBA CoreSphere" }] }),
  component: Memos,
});

function Memos() {
  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Communication</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Operations Memo Board</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Notices, compliance alerts, and operational memos. Acknowledge to confirm read.
        </p>
      </div>

      <PanelCard title="Active Memos">
        <ul className="grid md:grid-cols-2 gap-3">
          {memos.map((m) => (
            <li key={m.id} className="border rounded-lg p-4 flex flex-col gap-3 bg-background hover:border-primary/40 transition-colors">
              <div className="flex items-start gap-3">
                <div
                  className={`h-9 w-9 rounded-md flex items-center justify-center ${
                    m.category === "Compliance"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {m.category === "Compliance" ? <AlertTriangle className="h-4 w-4" /> : <StickyNote className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{m.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 inline-flex items-center gap-2">
                    {m.category} <span>•</span> <Clock className="h-3 w-3" /> Expires {m.expires}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                {m.acknowledged ? (
                  <span className="text-[11px] text-[color:var(--success)] inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Acknowledged
                  </span>
                ) : (
                  <span className="text-[11px] text-[color:var(--warning)]">Pending acknowledgement</span>
                )}
                <button
                  className={`text-xs px-3 h-8 rounded-md ${
                    m.acknowledged
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {m.acknowledged ? "Read" : "Acknowledge"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </PanelCard>
    </AppShell>
  );
}