import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardCheck,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ShieldAlert,
  Award,
  Users,
  Megaphone,
  StickyNote,
  Trophy,
  Sparkles,
  Activity,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, StatCard, ProgressBar, StatusBadge } from "@/components/ui-bits/Card";
import {
  announcements,
  champions,
  currentUser,
  memos,
  qaScores,
  sops,
  teamLeadsOnDuty,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Dashboard — UBA CoreSphere" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const maxScore = Math.max(...qaScores.map((s) => s.score));
  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {currentUser.department} • {currentUser.unit}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">
            Good morning, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's your operational snapshot for today's shift.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/knowledge-hub"
            className="inline-flex items-center gap-2 h-10 px-4 text-sm rounded-md border bg-card hover:bg-muted"
          >
            <BookOpen className="h-4 w-4" /> Knowledge Hub
          </Link>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-2 h-10 px-4 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="h-4 w-4" /> Resume Learning
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total SOPs" value={sops.length} delta="+2 this month" icon={BookOpen} tone="primary" />
        <StatCard label="SOP Completion" value="68%" delta="Across assigned" icon={CheckCircle2} tone="success" />
        <StatCard label="Weekly Assessments" value={3} delta="1 due today" icon={CalendarDays} tone="warning" />
        <StatCard label="Pending Approvals" value={5} delta="L&D queue" icon={ShieldAlert} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <PanelCard
          className="lg:col-span-2"
          title="QA Score Overview"
          description="6-month performance trend"
          action={
            <Link to="/score-buddy" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              Open Score Buddy <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <div className="flex items-end gap-3 h-40">
            {qaScores.map((s) => (
              <div key={s.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-full">
                  <div
                    className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-colors"
                    style={{ height: `${(s.score / maxScore) * 100}%` }}
                    title={`${s.score}%`}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground">{s.month}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t">
            <div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Current</div>
              <div className="text-lg font-semibold">93%</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Avg (6mo)</div>
              <div className="text-lg font-semibold">87%</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Δ vs last</div>
              <div className="text-lg font-semibold text-[color:var(--success)]">+2 pts</div>
            </div>
          </div>
        </PanelCard>

        <PanelCard
          title="Team Leads On Duty"
          description={`${currentUser.department} unit`}
          action={<Users className="h-4 w-4 text-muted-foreground" />}
        >
          <ul className="space-y-3">
            {teamLeadsOnDuty.map((t) => (
              <li key={t.name} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {t.department} • {t.shift}
                  </div>
                </div>
                <StatusBadge status={t.status as any} />
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <PanelCard
          className="lg:col-span-2"
          title="Leadership Announcements"
          action={
            <Link to="/leadership" className="text-xs text-primary hover:underline">
              View board
            </Link>
          }
        >
          <ul className="divide-y -my-2">
            {announcements.map((a) => (
              <li key={a.id} className="py-3 flex gap-3">
                <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium truncate">{a.title}</h4>
                    {a.pinned && (
                      <span className="text-[10px] uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded">
                        Pinned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{a.body}</p>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {a.author} • {a.time}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Recent Memos" action={<StickyNote className="h-4 w-4 text-muted-foreground" />}>
          <ul className="space-y-3">
            {memos.slice(0, 4).map((m) => (
              <li key={m.id} className="flex items-start gap-3">
                <div
                  className={`h-2 w-2 rounded-full mt-1.5 ${
                    m.acknowledged ? "bg-[color:var(--success)]" : "bg-primary"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm truncate">{m.title}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {m.category} • Expires {m.expires}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {champions.map((c) => (
          <div key={c.label} className="bg-card border rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5" />
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <Trophy className="h-3.5 w-3.5 text-primary" /> {c.label}
            </div>
            <div className="mt-3 text-base font-semibold">{c.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{c.detail}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <PanelCard
          className="lg:col-span-2"
          title="Recent Learning Activity"
          action={<Activity className="h-4 w-4 text-muted-foreground" />}
        >
          <ul className="space-y-4">
            {sops.slice(0, 4).map((s) => (
              <li key={s.id} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to="/knowledge-hub/$sopId"
                      params={{ sopId: s.id }}
                      className="text-sm font-medium truncate hover:text-primary"
                    >
                      {s.title}
                    </Link>
                    <span className="text-xs text-muted-foreground tabular-nums">{s.progress}%</span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={s.progress} tone="success" />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1.5">
                    {s.category} • Updated {s.updated}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>
        <PanelCard title="CoreSphere AI" description="Operational assistant — always on">
          <div className="text-sm text-muted-foreground leading-relaxed">
            Ask anything about SOPs, scripts, escalation paths, or compliance. CoreSphere AI is
            context-aware of your department and current SOP.
          </div>
          <button
            onClick={() => {
              const evt = new CustomEvent("open-coresphere-ai");
              window.dispatchEvent(evt);
            }}
            className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90"
          >
            <Sparkles className="h-4 w-4" /> Open Assistant
          </button>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="p-3 rounded-md border bg-background">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">This week</div>
              <div className="text-lg font-semibold mt-1">42</div>
              <div className="text-[11px] text-muted-foreground">queries answered</div>
            </div>
            <div className="p-3 rounded-md border bg-background">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg latency</div>
              <div className="text-lg font-semibold mt-1">1.2s</div>
              <div className="text-[11px] text-muted-foreground">enterprise grade</div>
            </div>
          </div>
        </PanelCard>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <StatCard label="Monthly Assessments" value={2} delta="1 completed" icon={CalendarRange} tone="primary" />
        <StatCard label="Acknowledged Memos" value="2 / 4" delta="2 awaiting your action" icon={ClipboardCheck} tone="warning" />
      </div>
    </AppShell>
  );
}
