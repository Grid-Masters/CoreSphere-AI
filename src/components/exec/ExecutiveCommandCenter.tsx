import { Gauge, HeartPulse, MessageSquareWarning, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { PanelCard, ProgressBar } from "@/components/ui-bits/Card";
import { pulseHealthIndex, operationalWins } from "@/lib/pulse-health";
import { voiceOfCustomer } from "@/lib/voice-of-customer";

const sentimentTone: Record<string, string> = {
  Positive: "text-[color:var(--success)]",
  Neutral: "text-muted-foreground",
  Negative: "text-[color:var(--destructive)]",
};

export function ExecutiveCommandCenter() {
  const ph = pulseHealthIndex();
  const voc = voiceOfCustomer();
  const wins = operationalWins();

  const bandTone =
    ph.band === "Excellent" || ph.band === "Healthy"
      ? "text-[color:var(--success)]"
      : ph.band === "Watch"
      ? "text-[color:var(--warning)]"
      : "text-[color:var(--destructive)]";

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-3 gap-4">
        <PanelCard title="Pulse Health Index" description="Composite enterprise KPI" action={<Gauge className="h-4 w-4 text-muted-foreground" />}>
          <div className="flex items-center gap-5">
            <div className="relative h-24 w-24 shrink-0">
              <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
                <circle cx="50" cy="50" r="42" className="stroke-muted" strokeWidth="9" fill="none" />
                <circle
                  cx="50" cy="50" r="42" className={bandTone} strokeWidth="9" fill="none"
                  stroke="currentColor" strokeLinecap="round"
                  strokeDasharray={`${(ph.index / 100) * 264} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold tabular-nums">{ph.index}</span>
                <span className="text-[10px] text-muted-foreground">/100</span>
              </div>
            </div>
            <div>
              <div className={`text-sm font-semibold ${bandTone}`}>{ph.band}</div>
              <p className="text-xs text-muted-foreground mt-1">Learning, compliance and engagement in one signal.</p>
            </div>
          </div>
          <ul className="space-y-2.5 mt-4">
            {ph.drivers.map((d) => (
              <li key={d.label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{d.label}</span>
                  <span className="tabular-nums text-muted-foreground">{d.value}%</span>
                </div>
                <div className="mt-1"><ProgressBar value={d.value} tone={d.value >= 80 ? "success" : "primary"} /></div>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard className="lg:col-span-2" title="Voice of Customer" description="Complaint themes & sentiment across channels" action={<MessageSquareWarning className="h-4 w-4 text-muted-foreground" />}>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Kpi label="CSAT" value={`${voc.csat}%`} delta={`+${voc.csatDelta}`} good />
            <Kpi label="First Contact Res." value={`${voc.fcr}%`} />
            <Kpi label="Escalation Rate" value={`${voc.escalationRate}%`} />
          </div>
          <ul className="space-y-2.5">
            {voc.themes.map((t) => (
              <li key={t.theme} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium truncate">{t.theme}</span>
                    <span className="tabular-nums text-muted-foreground ml-2 shrink-0">{t.volume}%</span>
                  </div>
                  <div className="mt-1"><ProgressBar value={t.volume} tone="primary" /></div>
                </div>
                <div className={`flex items-center gap-1 text-[11px] tabular-nums w-14 justify-end ${sentimentTone[t.sentiment]}`}>
                  {t.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {t.trend > 0 ? "+" : ""}{t.trend}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border bg-background p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Top pain points</div>
            <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
              {voc.painPoints.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </PanelCard>
      </div>

      <PanelCard title="Operational Wins Board" description="Recent measurable improvements across departments" action={<Trophy className="h-4 w-4 text-muted-foreground" />}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {wins.map((w) => (
            <div key={w.title} className="rounded-lg border bg-background p-3">
              <div className="flex items-center gap-2 text-[color:var(--success)]">
                <HeartPulse className="h-3.5 w-3.5" />
                <span className="text-sm font-semibold tabular-nums">{w.metric}</span>
              </div>
              <div className="text-sm font-medium mt-1.5">{w.title}</div>
              <p className="text-xs text-muted-foreground mt-1">{w.detail}</p>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">{w.department}</div>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}

function Kpi({ label, value, delta, good }: { label: string; value: string; delta?: string; good?: boolean }) {
  return (
    <div className="rounded-md border bg-background px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold mt-0.5 tabular-nums">{value}</div>
      {delta && <div className={`text-[10px] ${good ? "text-[color:var(--success)]" : "text-muted-foreground"}`}>{delta} pts</div>}
    </div>
  );
}