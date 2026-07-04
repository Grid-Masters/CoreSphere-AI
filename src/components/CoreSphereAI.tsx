import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  X,
  Send,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckSquare,
  Clock,
  ShieldCheck,
  MessageSquare,
  PenLine,
  Info,
  Copy,
  Check,
  Wand2,
  Sun,
  PanelRightClose,
  Minus,
  Maximize2,
} from "lucide-react";
import { askCoreSphereAI, type AiAnswer } from "@/lib/coresphere-ai.functions";
import { runWritingAssistant, WRITER_TOOLS, type WriterTool } from "@/lib/coresphere-writer.functions";
import { useActiveUser } from "@/lib/active-user";
import { greetingForHour } from "@/lib/quotes";
import { buildBriefing, type DailyBriefing } from "@/lib/briefing";
import { IntelligenceOrb } from "@/components/IntelligenceOrb";
import {
  AI_NAME,
  AI_TAGLINE,
  AI_MAY,
  AI_MUST_NOT,
  quickPromptsFor,
} from "@/lib/ai-governance";
import aiAvatar from "@/assets/ai/coresphere-ai-avatar.png";

export const OPEN_AI_EVENT = "coresphere:open-ai";

type Tab = "briefing" | "chat" | "write" | "about";
type DisplayMode = "floating" | "docked" | "minimized";
const MODE_KEY = "coresphere.ai.mode";

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

function Avatar({ size = 32 }: { size?: number }) {
  return (
    <img
      src={aiAvatar}
      alt="CoreSphere AI"
      width={size}
      height={size}
      loading="lazy"
      className="rounded-md object-contain"
      style={{ width: size, height: size }}
    />
  );
}

export function CoreSphereAI() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("briefing");
  const [mode, setMode] = useState<DisplayMode>("floating");
  const [input, setInput] = useState("");
  const user = useActiveUser();
  const ask = useServerFn(askCoreSphereAI);
  const write = useServerFn(runWritingAssistant);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hello, setHello] = useState("Good morning");
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);

  // Writing assistant state
  const [writerTool, setWriterTool] = useState<WriterTool>("Professional tone");
  const [writerInput, setWriterInput] = useState("");
  const [writerOutput, setWriterOutput] = useState("");
  const [writerErr, setWriterErr] = useState("");
  const [writerBusy, setWriterBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const quickPrompts = quickPromptsFor(user.department);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_AI_EVENT, handler);
    return () => window.removeEventListener(OPEN_AI_EVENT, handler);
  }, []);
  // Fresh sign-in (Phase F): auto-open the Daily Briefing once after login.
  useEffect(() => {
    try {
      if (sessionStorage.getItem("coresphere:justSignedIn") === "1") {
        sessionStorage.removeItem("coresphere:justSignedIn");
        setTab("briefing");
        setOpen(true);
      }
    } catch {
      // storage unavailable — skip
    }
  }, []);
  useEffect(() => {
    setHello(greetingForHour(new Date().getHours()));
  }, [open]);
  // Persisted display mode
  useEffect(() => {
    const saved = window.localStorage.getItem(MODE_KEY) as DisplayMode | null;
    if (saved === "floating" || saved === "docked" || saved === "minimized") setMode(saved);
  }, []);
  const changeMode = (m: DisplayMode) => {
    setMode(m);
    window.localStorage.setItem(MODE_KEY, m);
  };
  // Rebuild the briefing whenever the panel opens or the user changes
  useEffect(() => {
    if (open) setBriefing(buildBriefing(user));
  }, [open, user]);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      answer: {
        summary: `I'm ${AI_NAME} — ${AI_TAGLINE}. Ask me about SOPs, compliance and escalation paths, or use the Writing Assistant to polish memos and customer responses.`,
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

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

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

  const runWriter = async () => {
    if (!writerInput.trim() || writerBusy) return;
    setWriterBusy(true);
    setWriterErr("");
    setWriterOutput("");
    try {
      const res = await write({ data: { tool: writerTool, text: writerInput.trim() } });
      setWriterOutput(res.output);
      if (res.error) setWriterErr(res.error);
    } catch (err) {
      console.error(err);
      setWriterErr("Could not reach the AI service. Please try again.");
    } finally {
      setWriterBusy(false);
    }
  };

  const copyOut = async () => {
    try {
      await navigator.clipboard.writeText(writerOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <>
      {!open && <IntelligenceOrb onClick={() => setOpen(true)} />}
      {open && (
        <div
          className={
            mode === "docked"
              ? "fixed top-0 right-0 bottom-0 z-50 w-[440px] max-w-[100vw] bg-card border-l shadow-2xl flex flex-col overflow-hidden animate-slide-in-right"
              : mode === "minimized"
                ? "fixed bottom-6 right-6 z-50 w-[300px] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-up"
                : "fixed bottom-6 right-6 z-50 w-[440px] max-w-[calc(100vw-2rem)] h-[660px] max-h-[calc(100vh-3rem)] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-up"
          }
        >
          {/* Header */}
          <div className="px-4 py-3 border-b bg-gradient-to-r from-primary/15 via-sidebar to-sidebar text-sidebar-foreground flex items-center gap-3">
            <Avatar size={36} />
            <div className="flex-1 leading-tight">
              <div className="text-sm font-semibold">{AI_NAME}</div>
              <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/70 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)] inline-block" />
                {AI_TAGLINE}
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => changeMode(mode === "minimized" ? "floating" : "minimized")}
                className="h-8 w-8 rounded-md hover:bg-sidebar-accent flex items-center justify-center"
                aria-label={mode === "minimized" ? "Restore" : "Minimize"}
              >
                {mode === "minimized" ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
              </button>
              <button
                onClick={() => changeMode(mode === "docked" ? "floating" : "docked")}
                className={`h-8 w-8 rounded-md hover:bg-sidebar-accent flex items-center justify-center ${mode === "docked" ? "text-primary" : ""}`}
                aria-label={mode === "docked" ? "Float" : "Dock to side"}
              >
                <PanelRightClose className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-md hover:bg-sidebar-accent flex items-center justify-center"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {mode !== "minimized" && (
          <>
          {/* Tabs */}
          <div className="flex border-b bg-muted/40 text-xs font-medium">
            {([
              { id: "briefing" as Tab, label: "Briefing", icon: Sun },
              { id: "chat" as Tab, label: "Coach", icon: MessageSquare },
              { id: "write" as Tab, label: "Write", icon: PenLine },
              { id: "about" as Tab, label: "About", icon: Info },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-3.5 w-3.5" /> {t.label}
              </button>
            ))}
          </div>

          {/* BRIEFING TAB */}
          {tab === "briefing" && briefing && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-card to-card p-4">
                <div className="text-sm font-semibold">
                  {briefing.greeting}, {briefing.name} 👋
                </div>
                <div className="mt-1.5 text-[12px] italic text-muted-foreground leading-snug">
                  “{briefing.quote}”
                </div>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-1">
                Today's Briefing
              </div>
              <div className="space-y-2">
                {briefing.items.map((it, i) => {
                  const toneCls =
                    it.tone === "warning"
                      ? "text-[color:var(--warning)]"
                      : it.tone === "success"
                        ? "text-[color:var(--success)]"
                        : it.tone === "info"
                          ? "text-[color:var(--info)]"
                          : "text-primary";
                  return (
                    <a
                      key={i}
                      href={it.href ?? "#"}
                      className="flex gap-2.5 rounded-lg border bg-background p-2.5 hover:bg-muted transition-colors"
                    >
                      <it.icon className={`h-4 w-4 mt-0.5 shrink-0 ${toneCls}`} />
                      <div className="min-w-0">
                        <div className={`text-[10px] uppercase tracking-wider font-semibold ${toneCls}`}>
                          {it.label}
                        </div>
                        <div className="text-[12px] leading-snug">{it.text}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* CHAT TAB */}
          {tab === "chat" && (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="text-xs text-muted-foreground">
                  {hello}, {user.name.split(" ")[0]} — how can I support your operations today?
                </div>
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}>
                    {m.role === "user" ? (
                      <div className="max-w-[85%] text-sm rounded-lg px-3 py-2 bg-primary text-primary-foreground">{m.text}</div>
                    ) : (
                      <div className="flex gap-2 max-w-[95%]">
                        <Avatar size={24} />
                        <AiBubble a={m.answer} />
                      </div>
                    )}
                  </div>
                ))}
                {busy && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar size={20} /> <span className="animate-pulse-soft">CoreSphere AI is analysing…</span>
                  </div>
                )}
                {messages.length <= 1 && (
                  <div className="pt-2 space-y-1.5">
                    <div className="text-[11px] text-muted-foreground uppercase tracking-wider px-1">Quick prompts</div>
                    {quickPrompts.map((s) => (
                      <button
                        key={s}
                        onClick={() => setInput(s)}
                        className="w-full text-left text-xs px-3 py-2 rounded-md border bg-background hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <ArrowRight className="h-3 w-3 text-primary shrink-0" /> {s}
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
                    className="h-10 w-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* WRITING ASSISTANT TAB */}
          {tab === "write" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Choose a tool</div>
              <div className="flex flex-wrap gap-1.5">
                {WRITER_TOOLS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setWriterTool(t)}
                    className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${
                      writerTool === t ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <textarea
                value={writerInput}
                onChange={(e) => setWriterInput(e.target.value)}
                placeholder="Paste a memo, customer reply, announcement or SOP text…"
                className="w-full h-28 p-3 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              <button
                onClick={runWriter}
                disabled={writerBusy || !writerInput.trim()}
                className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Wand2 className="h-4 w-4" /> {writerBusy ? "Working…" : `Apply: ${writerTool}`}
              </button>
              {writerErr && (
                <div className="text-[11px] text-[color:var(--warning)] flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {writerErr}
                </div>
              )}
              {writerOutput && (
                <div className="rounded-md border bg-muted/50 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Result</span>
                    <button onClick={copyOut} className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline">
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="text-[13px] whitespace-pre-wrap leading-snug">{writerOutput}</div>
                </div>
              )}
            </div>
          )}

          {/* ABOUT TAB */}
          {tab === "about" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar size={44} />
                <div>
                  <div className="text-sm font-semibold">{AI_NAME}</div>
                  <div className="text-[11px] text-muted-foreground">{AI_TAGLINE}</div>
                </div>
              </div>
              <p className="text-[13px] text-muted-foreground">
                CoreSphere AI is an Operations Development Assistant for the UBA Customer Fulfilment Group.
                It supports learning, knowledge and operational excellence only.
              </p>
              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[color:var(--success)] flex items-center gap-1 mb-1.5">
                  <ShieldCheck className="h-3 w-3" /> What it can do
                </div>
                <ul className="text-[12px] space-y-1">
                  {AI_MAY.map((x) => (
                    <li key={x} className="flex items-start gap-1.5">
                      <Check className="h-3 w-3 text-[color:var(--success)] mt-0.5 shrink-0" /> {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[color:var(--warning)] flex items-center gap-1 mb-1.5">
                  <AlertTriangle className="h-3 w-3" /> What it will never do
                </div>
                <ul className="text-[12px] space-y-1">
                  {AI_MUST_NOT.map((x) => (
                    <li key={x} className="flex items-start gap-1.5">
                      <X className="h-3 w-3 text-[color:var(--warning)] mt-0.5 shrink-0" /> {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          </>
          )}
          {mode === "minimized" && (
            <button
              onClick={() => changeMode("floating")}
              className="p-4 text-left text-xs text-muted-foreground hover:bg-muted transition-colors"
            >
              {hello}, {user.name.split(" ")[0]} — tap to open your briefing &amp; coach.
            </button>
          )}
        </div>
      )}
    </>
  );
}