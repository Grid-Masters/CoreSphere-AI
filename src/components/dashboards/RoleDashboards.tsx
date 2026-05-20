import { Link } from "@tanstack/react-router";
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  FileUp,
  Headphones,
  Megaphone,
  MessagesSquare,
  PieChart,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  StickyNote,
  Trophy,
  Upload,
  Users,
  Video,
} from "lucide-react";
import { PanelCard, ProgressBar, StatCard, StatusBadge } from "@/components/ui-bits/Card";
import { PromotionsStrip } from "@/components/PromotionsStrip";
import { ProductsAndNews } from "@/components/ProductsAndNews";
import { TodaysWorkflow } from "@/components/workflow/TodaysWorkflow";
import { ComplianceHealth } from "@/components/governance/ComplianceHealth";
import { AtRiskStaff } from "@/components/governance/AtRiskStaff";
import { ScenarioBanner } from "@/components/ops/ScenarioBanner";
import { EnterpriseActivityFeed } from "@/components/feed/EnterpriseActivityFeed";
import { pickQuote, greetingForHour } from "@/lib/quotes";
import { useEffect, useState } from "react";
import {
  announcements,
  assessments,
  champions,
  memos,
  overallProgress,
  qaScores,
  sops,
  teamLeadsOnDuty,
} from "@/lib/mock-data";
import { directory, type DirectoryEntry } from "@/lib/directory";

function Greeting({ user, subtitle }: { user: DirectoryEntry; subtitle: string }) {
  const [quote, setQuote] = useState(() => pickQuote(new Date(0)));
  const [hello, setHello] = useState("Good morning");
  useEffect(() => {
    const now = new Date();
    setQuote(pickQuote(now));
    setHello(greetingForHour(now.getHours()));
  }, []);
  return (
    <div className="mb-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {user.department} • {user.unit}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">
          {hello}, {user.name.split(" ")[0]} <span aria-hidden>👋</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      </div>
      <blockquote className="mt-3 text-sm italic text-muted-foreground border-l-2 border-primary/40 pl-3">
        “{quote}”
      </blockquote>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Regular Staff Dashboard
// ────────────────────────────────────────────────────────────────────────────
export function StaffDashboard({ user }: { user: DirectoryEntry }) {
  const maxScore = Math.max(...qaScores.map((s) => s.score));
  const qaOfficer = directory.find((d) => d.email === user.assignedQAOfficer);

  return (
    <>
      <div className="mb-6">
        <ProductsAndNews />
      </div>
      <Greeting user={user} subtitle="Here's your operational snapshot for today's shift." />

      <ScenarioBanner />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Assigned SOPs" value={sops.length} delta="+2 this month" icon={BookOpen} tone="primary" />
        <StatCard label="SOP Completion" value="68%" delta="Across assigned" icon={CheckCircle2} tone="success" />
        <StatCard label="Monthly Assessments" value={3} delta="1 due this week" icon={CalendarDays} tone="warning" />
        <StatCard label="My QA Score (May)" value="93%" delta="+2 vs Apr" icon={Award} tone="primary" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2"><TodaysWorkflow role="staff" /></div>
        <EnterpriseActivityFeed />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <PanelCard className="lg:col-span-2" title="QA Score Overview" description="6-month performance trend">
          <div className="flex items-end gap-3 h-40">
            {qaScores.map((s) => (
              <div key={s.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-full">
                  <div className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-colors" style={{ height: `${(s.score / maxScore) * 100}%` }} title={`${s.score}%`} />
                </div>
                <div className="text-[11px] text-muted-foreground">{s.month}</div>
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard title="My QA Officer" description="Coaching & scorecard contact">
          {qaOfficer ? (
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                {qaOfficer.initials}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{qaOfficer.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{qaOfficer.roleLabel}</div>
                <div className="text-[11px] text-muted-foreground truncate">{qaOfficer.email}</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No QA officer assigned this month.</div>
          )}
          <Link to="/qa-coaching" className="mt-4 inline-flex items-center gap-2 h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/90">
            <MessagesSquare className="h-3.5 w-3.5" /> Open Coaching Chat
          </Link>
        </PanelCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <PanelCard className="lg:col-span-2" title="Recent Learning Activity" action={<Activity className="h-4 w-4 text-muted-foreground" />}>
          <ul className="space-y-4">
            {sops.slice(0, 4).map((s) => (
              <li key={s.id} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <Link to="/knowledge-hub/$sopId" params={{ sopId: s.id }} className="text-sm font-medium truncate hover:text-primary">
                      {s.title}
                    </Link>
                    <span className="text-xs text-muted-foreground tabular-nums">{overallProgress(s)}%</span>
                  </div>
                  <div className="mt-2"><ProgressBar value={overallProgress(s)} tone="success" /></div>
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Recent Memos" action={<StickyNote className="h-4 w-4 text-muted-foreground" />}>
          <ul className="space-y-3">
            {memos.slice(0, 4).map((m) => (
              <li key={m.id} className="flex items-start gap-3">
                <div className={`h-2 w-2 rounded-full mt-1.5 ${m.acknowledged ? "bg-[color:var(--success)]" : "bg-primary"}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm truncate">{m.title}</div>
                  <div className="text-[11px] text-muted-foreground">{m.category} • Expires {m.expires}</div>
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
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// QA Officer Dashboard
// ────────────────────────────────────────────────────────────────────────────
export function QADashboard({ user }: { user: DirectoryEntry }) {
  const assignedStaff = directory.filter((d) => d.assignedQAOfficer === user.email);

  return (
    <>
      <div className="mb-6"><ProductsAndNews /></div>
      <Greeting user={user} subtitle="Audit, score and coach your assigned operational staff for the month." />

      <ScenarioBanner />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Assigned Staff" value={assignedStaff.length || 6} delta="This month" icon={Users} tone="primary" />
        <StatCard label="Audits This Month" value={112} delta="+18 vs last month" icon={ClipboardCheck} tone="success" />
        <StatCard label="Compliance Failures" value={4} delta="Open coaching" icon={ShieldAlert} tone="warning" />
        <StatCard label="Avg Scorecard" value="87.4%" delta="Department-wide" icon={Award} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2"><TodaysWorkflow role="qa" /></div>
        <ComplianceHealth scope="QA Portfolio" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <AtRiskStaff />
        <EnterpriseActivityFeed />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <PanelCard className="lg:col-span-2" title="My Assigned Staff" description="QA chat routes only to these staff for the month" action={<MessagesSquare className="h-4 w-4 text-muted-foreground" />}>
          <ul className="divide-y -my-2">
            {(assignedStaff.length ? assignedStaff : directory.filter((d) => d.role === "staff").slice(0, 4)).map((s) => (
              <li key={s.email} className="py-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                  {s.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {s.roleLabel} • {s.department} / {s.unit}
                  </div>
                </div>
                <Link to="/qa-coaching" className="text-xs text-primary hover:underline">
                  Coach →
                </Link>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Quick Actions" description="QA workspace">
          <div className="grid grid-cols-2 gap-2">
            <ActionTile icon={FileUp} label="Upload Scorecard" />
            <ActionTile icon={Headphones} label="Audit Call" />
            <ActionTile icon={MessagesSquare} label="Audit Chat" />
            <ActionTile icon={Video} label="Schedule Video Session" />
            <ActionTile icon={Award} label="QA of the Month" />
            <ActionTile icon={Sparkles} label="AI Coaching Insights" />
          </div>
        </PanelCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <PanelCard title="Recent Audited Interactions">
          <ul className="divide-y -my-2">
            {[
              { who: "Adaeze Okafor", channel: "Voice", score: 94, when: "Today 09:12" },
              { who: "Esther James", channel: "Live Chat", score: 88, when: "Today 08:40" },
              { who: "Musa Bello", channel: "Voice", score: 76, when: "Yesterday 16:22" },
              { who: "Tunde Aina", channel: "Social", score: 82, when: "Yesterday 11:05" },
            ].map((a) => (
              <li key={a.when} className="py-3 flex items-center gap-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground w-16">{a.channel}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.who}</div>
                  <div className="text-[11px] text-muted-foreground">{a.when}</div>
                </div>
                <div className="text-sm font-semibold tabular-nums">{a.score}%</div>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Performance Trends" description="6-month rolling QA across your portfolio">
          <div className="flex items-end gap-3 h-32">
            {qaScores.map((s) => (
              <div key={s.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-full">
                  <div className="w-full rounded-t-md bg-primary/80" style={{ height: `${s.score}%` }} />
                </div>
                <div className="text-[11px] text-muted-foreground">{s.month}</div>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// L&D Dashboard
// ────────────────────────────────────────────────────────────────────────────
export function LDDashboard({ user }: { user: DirectoryEntry }) {
  return (
    <>
      <div className="mb-6"><ProductsAndNews /></div>
      <Greeting user={user} subtitle="Manage SOPs, training content and assessments. Maker-checker enforced: L&D uploads → Unit Head approves → Publish." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Published SOPs" value={sops.filter((s) => s.status === "Approved").length} delta="Org-wide" icon={BookOpen} tone="primary" />
        <StatCard label="Pending Approval" value={sops.filter((s) => s.status === "Pending Approval").length} delta="Awaiting Unit Head" icon={ShieldCheck} tone="warning" />
        <StatCard label="Active Assessments" value={5} delta="Monthly cycle" icon={CalendarRange} tone="success" />
        <StatCard label="Avg Completion" value="71%" delta="Across departments" icon={CheckCircle2} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2"><TodaysWorkflow role="ld" /></div>
        <ComplianceHealth scope="Enterprise Learning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <PanelCard className="lg:col-span-2" title="Content Pipeline" description="Maker-checker: L&D uploads, Unit Head approves before publish">
          <ul className="divide-y -my-2">
            {sops.slice(0, 6).map((s) => (
              <li key={s.id} className="py-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.title}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {s.category} • Updated {s.updated}
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="L&D Actions" description="Only L&D can manage content">
          <div className="grid grid-cols-2 gap-2">
            <ActionTile icon={Upload} label="Upload SOP PDF" />
            <ActionTile icon={Video} label="Upload Video Lecture" />
            <ActionTile icon={CalendarDays} label="Create Monthly Quiz" />
            <ActionTile icon={CalendarRange} label="Create Assessment" />
            <ActionTile icon={Megaphone} label="Push Training Update" />
            <ActionTile icon={BarChart3} label="Completion Analytics" />
          </div>
        </PanelCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <PanelCard title="Org-wide Assessment Status">
          <ul className="divide-y -my-2">
            {assessments.map((a) => (
              <li key={a.id} className="py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.title}</div>
                  <div className="text-[11px] text-muted-foreground">{a.type} • {a.attempts} attempt(s)</div>
                </div>
                <StatusBadge status={a.status as any} />
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Onboarding Learning Queue" description="New joiners across departments">
          <ul className="space-y-3">
            {[
              { name: "12 new joiners — Multimedia", pct: 42 },
              { name: "8 new joiners — Inbound", pct: 68 },
              { name: "5 new joiners — FHD", pct: 80 },
            ].map((q) => (
              <li key={q.name}>
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate">{q.name}</span>
                  <span className="tabular-nums text-muted-foreground">{q.pct}%</span>
                </div>
                <div className="mt-1"><ProgressBar value={q.pct} tone="primary" /></div>
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Team Lead Dashboard
// ────────────────────────────────────────────────────────────────────────────
export function TeamLeadDashboard({ user }: { user: DirectoryEntry }) {
  const team = directory.filter((d) => d.reportsTo === user.email);
  return (
    <>
      <div className="mb-6"><ProductsAndNews /></div>
      <Greeting user={user} subtitle={`Visibility scoped to ${user.department}. Monitor your team's operations, QA performance and departmental knowledge.`} />

      <ScenarioBanner />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Team Size" value={team.length || 8} delta="Direct reports" icon={Users} tone="primary" />
        <StatCard label="SOP Completion" value="74%" delta="Team average" icon={CheckCircle2} tone="success" />
        <StatCard label="QA Average" value="89%" delta="+3 vs last month" icon={Award} />
        <StatCard label="Escalations Open" value={3} delta="Awaiting your action" icon={ShieldAlert} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2"><TodaysWorkflow role="team_lead" /></div>
        <ComplianceHealth scope={`${user.department} Department`} department={user.department} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <AtRiskStaff department={user.department} />
        <EnterpriseActivityFeed />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <PanelCard className="lg:col-span-2" title="Team Roster" description="Completion + QA per direct report">
          <ul className="divide-y -my-2">
            {(team.length ? team : directory.filter((d) => d.role === "staff").slice(0, 4)).map((m) => (
              <li key={m.email} className="py-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">{m.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{m.roleLabel} • {m.unit}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs tabular-nums">QA 91%</div>
                  <div className="text-[11px] text-muted-foreground tabular-nums">SOP 78%</div>
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Team Leads On Duty">
          <ul className="space-y-3">
            {teamLeadsOnDuty.map((t) => (
              <li key={t.name} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{t.department} • {t.shift}</div>
                </div>
                <StatusBadge status={t.status as any} />
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <PanelCard title="Department FAQs" description="You can edit FAQs for your unit">
          <ul className="divide-y -my-2 text-sm">
            {["Card block escalation matrix", "Live chat tone exceptions", "Containment thresholds (Q2)", "Customer authentication fallback"].map((q) => (
              <li key={q} className="py-2.5 flex items-center justify-between gap-3">
                <span className="truncate">{q}</span>
                <button className="text-xs text-primary hover:underline">Edit</button>
              </li>
            ))}
          </ul>
        </PanelCard>
        <PanelCard title="Compliance Snapshot" description="This month">
          <div className="grid grid-cols-2 gap-4">
            <Mini label="Acknowledged memos" value="86%" />
            <Mini label="Quiz pass rate" value="78%" />
            <Mini label="Escalation SLA" value="93%" />
            <Mini label="Audit findings" value="2 open" />
          </div>
        </PanelCard>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Group Head Dashboard
// ────────────────────────────────────────────────────────────────────────────
export function GroupHeadDashboard({ user }: { user: DirectoryEntry }) {
  return (
    <>
      <div className="mb-6"><ProductsAndNews /></div>
      <Greeting user={user} subtitle="Executive Operations Center — you oversee enterprise operational communications and executive intelligence across Customer Fulfilment." />

      <ScenarioBanner />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active Users" value="1,284" delta="+4.2% WoW" icon={Users} tone="primary" />
        <StatCard label="LMS Adoption" value="92%" delta="Across 8 departments" icon={CheckCircle2} tone="success" />
        <StatCard label="Avg QA (Group)" value="88.6%" delta="+1.4 vs last month" icon={Award} />
        <StatCard label="Compliance Rate" value="96%" delta="Memo acknowledgements" icon={ShieldCheck} tone="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2"><TodaysWorkflow role="group_head" /></div>
        <ComplianceHealth scope="Enterprise" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <AtRiskStaff />
        <EnterpriseActivityFeed />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <PanelCard className="lg:col-span-2" title="Departmental KPIs" description="QA + SOP completion by department">
          <ul className="divide-y -my-2">
            {[
              { dept: "FHD", qa: 91, sop: 82 },
              { dept: "Inbound", qa: 87, sop: 78 },
              { dept: "Multimedia", qa: 86, sop: 71 },
              { dept: "Social Media", qa: 84, sop: 69 },
              { dept: "Video Validation", qa: 90, sop: 88 },
            ].map((d) => (
              <li key={d.dept} className="py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{d.dept}</span>
                  <span className="text-muted-foreground tabular-nums text-xs">QA {d.qa}% • SOP {d.sop}%</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <ProgressBar value={d.qa} tone="primary" />
                  <ProgressBar value={d.sop} tone="success" />
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Group Head Broadcast" description="Org-wide announcements">
          <textarea
            placeholder="Compose a group-wide announcement…"
            className="w-full min-h-[100px] text-sm p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <div className="flex items-center justify-between mt-3">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" defaultChecked /> Pin to top
            </label>
            <button className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/90 inline-flex items-center gap-2">
              <Megaphone className="h-3.5 w-3.5" /> Publish broadcast
            </button>
          </div>
          <div className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">Recent</div>
          <ul className="mt-2 space-y-2">
            {announcements.slice(0, 2).map((a) => (
              <li key={a.id} className="text-xs">
                <div className="font-medium truncate">{a.title}</div>
                <div className="text-muted-foreground truncate">{a.time}</div>
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Mini label="Top Department" value="FHD" sub="91% QA" />
        <Mini label="Top User" value="Adaeze Okafor" sub="98% QA" />
        <Mini label="Most engaged learner" value="Halima Yusuf" sub="+14 pts" />
        <Mini label="Top SOP" value="Card Block & Unblock" sub="1,204 views" />
      </div>

      <PanelCard className="mt-4" title="Engagement Trend" description="Daily active staff (last 6 months)" action={<PieChart className="h-4 w-4 text-muted-foreground" />}>
        <div className="flex items-end gap-3 h-32">
          {qaScores.map((s, i) => (
            <div key={s.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col justify-end h-full">
                <div className="w-full rounded-t-md bg-primary/70" style={{ height: `${60 + i * 6}%` }} />
              </div>
              <div className="text-[11px] text-muted-foreground">{s.month}</div>
            </div>
          ))}
        </div>
      </PanelCard>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────
function ActionTile({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex flex-col items-start gap-2 p-3 rounded-md border bg-background hover:bg-muted text-left transition-colors">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-[11px] font-medium leading-tight">{label}</span>
    </button>
  );
}

function Mini({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-card border rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-base font-semibold mt-1 truncate">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}