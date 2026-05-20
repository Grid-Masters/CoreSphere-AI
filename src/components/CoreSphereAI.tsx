import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, X, Send, AlertTriangle, ArrowRight, BookOpen, CheckSquare, Clock, ShieldCheck } from "lucide-react";
import { askCoreSphereAI, type AiAnswer } from "@/lib/coresphere-ai.functions";
import { useActiveUser } from "@/lib/active-user";

const suggested = [
  "Summarize the Card Block SOP",
  "What's the SLA for dispute resolution?",
  "Quiz me on AML red flags",
  "Draft a customer apology for delayed refund",
];

type Msg = { role: "user"; text: string } | { role: "ai"; answer: AiAnswer; loading?: boolean };

function Section({ icon: Icon, label, children, tone = "default" }: { icon: any; label: string; children: React.ReactNode; tone?: "default" | "warning" | "primary" }) {
  const toneCls = tone === "warning" ? "text-[color:var(--warning)]" : tone === "primary" ? "text-primary" : "text-muted-foreground";
  return (
    <div className="mt-2">
      <div className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold ${toneCls}`}>
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 text-[12px] leading-snug">{children}</div>
    </div>
  );
}

function AiBubble({ a }: { a: AiAnswer }) {
  return (
    <div className="max-w-[92%] text-sm rounded-lg px-3 py-2.5 bg-muted text-foreground border">
      {a.summary && <div className="text-[13px] font-medium leading-snug">{a.summary}</div>}
      {a.requiredActions.length > 0 && (
        <Section icon={CheckSquare} label="Required Actions" tone="primary">
          <ul className="list-disc pl-4 space-y-0.5">{a.requiredActions.map((x) => <li key={x}>{x}</li>)}</ul>
        </Section>
      )}
      {a.escalationPath && <Section icon={ArrowRight} label="Escalation Path">{a.escalationPath}</Section>}
      {a.slaTimeline && <Section icon={Clock} label="SLA Timeline">{a.slaTimeline}</Section>}
      {a.complianceNotes.length > 0 && (
        <Section icon={ShieldCheck} label="Compliance Notes">
          <ul className="list-disc pl-4 space-y-0.5">{a.complianceNotes.map((x) => <li key={x}>{x}</li>)}</ul>
        </Section>
      )}
      {a.relatedSops.length > 0 && (
        <Section icon={BookOpen} label="Related SOPs">
          <div className="flex flex-wrap gap-1">{a.relatedSops.map((x) => <span key={x} className="text-[11px] px-1.5 py-0.5 rounded border bg-background">{x}</span>)}</div>
        </Section>
      )}
      {a.warnings.length > 0 && (
        <Section icon={AlertTriangle} label="Warnings" tone="warning">
          <ul className="list-disc pl-4 space-y-0.5">{a.warnings.map((x) => <li key={x}>{x}</li>)}</ul>
        </Section>
      )}
      {a.nextSteps.length > 0 && (
        <Section icon={ArrowRight} label="Recommended Next Steps" tone="primary">
          <ul className="list-disc pl-4 space-y-0.5">{a.nextSteps.map((x) => <li key={x}>{x}</li>)}</ul>
        </Section>
      )}
    </div>
  );
}

export function CoreSphereAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const user = useActiveUser();
  const ask = useServerFn(askCoreSphereAI);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      answer: {
        summary: "I'm CoreSphere AI — your banking operations assistant. Ask about SOPs, compliance, or escalation paths and I'll respond in a structured operational format.",
        requiredActions: [],
        escalationPath: "",
        slaTimeline: "",
        complianceNotes: [],
        relatedSops: [],
        warnings: [],
        nextSteps: [],
      },
    },
  ]);

  const send = async () => {
    if (!input.trim() || busy) return;
    const q = input.trim();
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    try {
      const answer = await ask({ data: { prompt: q, department: user.department } });
      setMessages((m) => [...m, { role: "ai", answer }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: "ai", answer: {
        summary: "Sorry — I could not reach the operations knowledge service. Please try again shortly.",
        requiredActions: [], escalationPath: "", slaTimeline: "", complianceNotes: [], relatedSops: [], warnings: ["AI gateway error"], nextSteps: [],
      } }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Open CoreSphere AI"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-3rem)] bg-card border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b bg-sidebar text-sidebar-foreground flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1 leading-tight">
              <div className="text-sm font-semibold">CoreSphere AI</div>
              <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
                Banking Operations Intelligence
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="h-8 w-8 rounded-md hover:bg-sidebar-accent flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "user" ? (
                  <div className="max-w-[85%] text-sm rounded-lg px-3 py-2 bg-primary text-primary-foreground">{m.text}</div>
                ) : (
                  <AiBubble a={m.answer} />
                )}
              </div>
            ))}
            {busy && (
              <div className="flex justify-start"><div className="text-xs text-muted-foreground animate-pulse-soft">CoreSphere AI is analysing…</div></div>
            )}
            {messages.length <= 1 && (
              <div className="pt-2 space-y-1.5">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider px-1">
                  Suggested
                </div>
                {suggested.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="w-full text-left text-xs px-3 py-2 rounded-md border bg-background hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="border-t p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about SOPs, compliance, escalation…"
                className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                disabled={busy}
              />
              <button
                onClick={send}
                disabled={busy}
                className="h-10 w-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}