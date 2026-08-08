import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AlertTriangle, ArrowRight, BadgeCheck, Bot, Loader2, RefreshCw, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard } from "@/components/ui-bits/Card";
import { useActiveUser, type ActiveUser } from "@/lib/active-user";
import { assessScenario, SCENARIO_LIBRARY, type ScenarioAssessment, type ScenarioPrompt } from "@/lib/coresphere-scenario.functions";

export const Route = createFileRoute("/_authenticated/scenarios")({
  head: () => ({
    meta: [
      { title: "Scenario Simulator — UBA CoreSphere" },
      { name: "description", content: "Practice realistic customer scenarios with the CoreSphere AI scenario simulator and coach." },
      { property: "og:title", content: "Scenario Simulator — UBA CoreSphere" },
      { property: "og:description", content: "Practice realistic customer scenarios with the CoreSphere AI scenario simulator and coach." },
      { property: "og:url", content: "https://ubacoresphere-pulse.lovable.app/scenarios" },
    ],
    links: [{ rel: "canonical", href: "https://ubacoresphere-pulse.lovable.app/scenarios" }],
  }),
  component: Scenarios,
});

const diffTone: Record<ScenarioPrompt["difficulty"], string> = {
  Foundational: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30",
  Intermediate: "bg-primary/10 text-primary border-primary/30",
  Advanced: "bg-[color:var(--warning)]/20 text-[color:var(--warning)] border-[color:var(--warning)]/40",
};

const verdictTone: Record<ScenarioAssessment["verdict"], string> = {
  Excellent: "text-[color:var(--success)]",
  "On Track": "text-primary",
  "Needs Work": "text-[color:var(--warning)]",
};

function Scenarios() {
  const user = useActiveUser();
  if (!user) return <AppShell>{null}</AppShell>;
  return <ScenariosBody user={user} />;
}

function ScenariosBody({ user }: { user: ActiveUser }) {
  const [active, setActive] = useState<ScenarioPrompt>(SCENARIO_LIBRARY[0]);
  const [answer, setAnswer] = useState("");
  const run = useServerFn(assessScenario);

  const mutation = useMutation({
    mutationFn: (vars: { situation: string; answer: string; department?: string }) => run({ data: vars }),
  });

  const submit = () => {
    if (!answer.trim()) return;
    mutation.mutate({ situation: active.situation, answer, department: user.department });
  };

  const pick = (s: ScenarioPrompt) => {
    setActive(s);
    setAnswer("");
    mutation.reset();
  };

  const result = mutation.data;

  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">AI Coaching</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Banking Scenario Simulator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Practise real operational scenarios. Submit your response and CoreSphere AI coaches you with the correct
          handling, SOP reference, escalation path and SLA.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <PanelCard title="Scenario Library" description="Pick a situation to practise">
          <ul className="space-y-2">
            {SCENARIO_LIBRARY.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => pick(s)}
                  className={`w-full text-left rounded-lg border p-3 transition-colors ${
                    active.id === s.id ? "border-primary bg-primary/5" : "bg-background hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">{s.title}</span>
                    <span className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full border text-[10px] font-medium ${diffTone[s.difficulty]}`}>
                      {s.difficulty}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{s.category}</div>
                </button>
              </li>
            ))}
          </ul>
        </PanelCard>

        <div className="lg:col-span-2 space-y-4">
          <PanelCard title={active.title} description={`${active.category} • ${active.difficulty}`}>
            <div className="rounded-lg border bg-muted/40 p-4 text-sm">{active.situation}</div>
            <label className="block text-xs font-medium text-muted-foreground mt-4 mb-1.5">Your response</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Describe how you would handle this customer, step by step…"
              className="w-full min-h-[120px] text-sm p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Bot className="h-3.5 w-3.5 text-primary" /> Coached by CoreSphere AI
              </div>
              <div className="flex items-center gap-2">
                {result && (
                  <button onClick={() => pick(active)} className="h-9 px-3 rounded-md border text-xs font-medium hover:bg-muted inline-flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5" /> Try again
                  </button>
                )}
                <button
                  onClick={submit}
                  disabled={!answer.trim() || mutation.isPending}
                  className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {mutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
                  {mutation.isPending ? "Assessing…" : "Submit for coaching"}
                </button>
              </div>
            </div>
          </PanelCard>

          {result && (
            <PanelCard title="CoreSphere AI Assessment" action={<BadgeCheck className="h-4 w-4 text-muted-foreground" />}>
              <div className="flex items-center gap-4">
                <div className={`text-2xl font-bold tabular-nums ${verdictTone[result.verdict]}`}>{result.score}%</div>
                <div>
                  <div className={`text-sm font-semibold ${verdictTone[result.verdict]}`}>{result.verdict}</div>
                  <p className="text-xs text-muted-foreground mt-0.5">{result.feedback}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Correct response</div>
                <ul className="space-y-1.5">
                  {result.correctResponse.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-3.5 w-3.5 text-primary mt-1 shrink-0" /> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mt-4">
                <Info label="SOP Reference" value={result.sopReference} icon={BadgeCheck} />
                <Info label="Escalation Path" value={result.escalationPath} icon={ShieldAlert} />
                <Info label="SLA" value={result.slaTimeline} icon={AlertTriangle} />
              </div>
            </PanelCard>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Info({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="text-xs mt-1">{value}</div>
    </div>
  );
}