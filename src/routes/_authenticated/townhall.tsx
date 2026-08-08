import { createFileRoute } from "@tanstack/react-router";
import { Play, Lock, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { townhallSessions } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/townhall")({
  head: () => ({
    meta: [
      { title: "Townhall Hub — UBA CoreSphere" },
      { name: "description", content: "UBA townhall hub for leadership broadcasts and group-wide operational updates on CoreSphere." },
      { property: "og:title", content: "Townhall Hub — UBA CoreSphere" },
      { property: "og:description", content: "UBA townhall hub for leadership broadcasts and group-wide operational updates on CoreSphere." },
      { property: "og:url", content: "https://ubacoresphere-pulse.lovable.app/townhall" },
    ],
    links: [{ rel: "canonical", href: "https://ubacoresphere-pulse.lovable.app/townhall" }],
  }),
  component: Townhall,
});

function Townhall() {
  return (
    <AppShell>
      <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Leadership</div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Townhall Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Searchable archive of leadership townhalls and broadcasts.
          </p>
        </div>
        <div className="relative w-72">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search sessions…"
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {townhallSessions.map((s) => (
          <article key={s.id} className="group bg-card border rounded-xl overflow-hidden shadow-sm hover:border-primary/40 transition-colors">
            <div className="relative aspect-video bg-gradient-to-br from-sidebar via-sidebar to-primary/40 flex items-center justify-center">
              <button className="h-12 w-12 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Play className="h-5 w-5 fill-current" />
              </button>
              <div className="absolute top-2 right-2 text-[10px] uppercase tracking-wider bg-black/60 text-white px-2 py-0.5 rounded inline-flex items-center gap-1">
                <Lock className="h-3 w-3" /> Internal
              </div>
              <div className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
                {s.duration}
              </div>
            </div>
            <div className="p-4">
              <div className="text-[11px] uppercase tracking-wider text-primary font-medium">
                {s.category}
              </div>
              <h3 className="text-sm font-semibold mt-1">{s.title}</h3>
              <div className="text-[11px] text-muted-foreground mt-1">{s.date}</div>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}