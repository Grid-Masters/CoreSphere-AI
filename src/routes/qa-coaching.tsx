import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Video, Calendar, ShieldCheck, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { coachingThreads } from "@/lib/mock-data";

export const Route = createFileRoute("/qa-coaching")({
  head: () => ({ meta: [{ title: "QA Coaching Hub — UBA CoreSphere" }] }),
  component: CoachingHub,
});

function CoachingHub() {
  const [active, setActive] = useState(coachingThreads[0]);
  const [text, setText] = useState("");
  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Performance</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">QA Coaching Hub</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Structured 1:1 coaching with your QA officer. Conversations are logged for compliance.
        </p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-4 bg-card border rounded-xl overflow-hidden h-[640px]">
        <aside className="border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="text-sm font-semibold">Coaching Threads</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Coaching only. Not a social channel.</p>
          </div>
          <ul>
            {coachingThreads.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setActive(t)}
                  className={`w-full text-left px-4 py-3 border-b hover:bg-muted/50 transition-colors ${
                    active.id === t.id ? "bg-muted/60" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                      {t.coach.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">{t.coach}</span>
                        <span className="text-[10px] text-muted-foreground">{t.time}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">{t.role}</div>
                      <div className="text-xs text-muted-foreground truncate mt-1">{t.lastMessage}</div>
                    </div>
                    {t.unread > 0 && (
                      <span className="h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
                        {t.unread}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex flex-col min-w-0">
          <header className="px-5 py-3 border-b flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                {active.coach.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-semibold">{active.coach}</div>
                <div className="text-[11px] text-muted-foreground">{active.role}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="h-9 px-3 text-xs rounded-md border bg-card hover:bg-muted inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Schedule
              </button>
              <button className="h-9 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5" /> Video Coaching
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {[
              { from: "coach", text: "I've reviewed your call from yesterday. Strong opening and verification handling." },
              { from: "coach", text: "Focus area: hold etiquette. Try announcing each hold with an estimated time." },
              { from: "me", text: "Noted. I'll apply that on today's batch and flag any difficult handovers." },
              { from: "coach", text: "Great. Let's review your scorecard live on Friday at 14:00." },
            ].map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] text-sm rounded-lg px-3 py-2 ${m.from === "me" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5 bg-muted/60 border px-3 py-1 rounded-full">
                <ShieldCheck className="h-3 w-3" /> Coaching session logged • Reference COA-2387
              </div>
            </div>
          </div>
          <div className="border-t p-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <input
              aria-label="Write a coaching note"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a coaching note…"
              className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            <button className="h-10 w-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}