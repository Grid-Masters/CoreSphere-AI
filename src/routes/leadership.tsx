import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Pin, Archive } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard } from "@/components/ui-bits/Card";
import { announcements } from "@/lib/mock-data";

export const Route = createFileRoute("/leadership")({
  head: () => ({ meta: [{ title: "Leadership Board — UBA CoreSphere" }] }),
  component: Leadership,
});

function Leadership() {
  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Communication</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Leadership Board</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Strategic announcements and operational updates from Group Heads.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {announcements.map((a) => (
            <article key={a.id} className="bg-card border rounded-xl shadow-sm overflow-hidden">
              <header className="flex items-start gap-3 p-5 border-b">
                <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{a.title}</h3>
                    {a.pinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded">
                        <Pin className="h-3 w-3" /> Pinned
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {a.author} • {a.time}
                  </div>
                </div>
              </header>
              <div className="p-5 text-sm text-foreground/90 leading-relaxed">{a.body}</div>
            </article>
          ))}
        </div>
        <div className="space-y-4">
          <PanelCard title="Archived Broadcasts" action={<Archive className="h-4 w-4 text-muted-foreground" />}>
            <ul className="space-y-3 text-sm">
              {[
                "Q1 Operations Recap",
                "FY2025 People Strategy",
                "Network Resilience Update",
                "Customer NPS Targets",
              ].map((t) => (
                <li key={t} className="flex items-center justify-between">
                  <span className="truncate">{t}</span>
                  <span className="text-[11px] text-muted-foreground">View</span>
                </li>
              ))}
            </ul>
          </PanelCard>
        </div>
      </div>
    </AppShell>
  );
}