import { useState } from "react";
import { Sparkles, X, Send } from "lucide-react";

const suggested = [
  "Summarize the Card Block SOP",
  "What's the SLA for dispute resolution?",
  "Quiz me on AML red flags",
  "Draft a customer apology for delayed refund",
];

type Msg = { role: "user" | "ai"; text: string };

export function CoreSphereAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      text: "I'm CoreSphere AI. I can help with SOPs, compliance checks, and operational guidance. How can I support your shift today?",
    },
  ]);

  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [
      ...m,
      { role: "user", text: q },
      {
        role: "ai",
        text:
          "Based on current SOPs and your department context (FHD), here's the recommended approach. Always validate against the latest approved version in the Knowledge Hub before action.",
      },
    ]);
    setInput("");
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
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] bg-card border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b bg-sidebar text-sidebar-foreground flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1 leading-tight">
              <div className="text-sm font-semibold">CoreSphere AI</div>
              <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
                Operational Assistant
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
                <div
                  className={`max-w-[85%] text-sm rounded-lg px-3 py-2 ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
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
                placeholder="Ask CoreSphere AI…"
                className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              <button
                onClick={send}
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