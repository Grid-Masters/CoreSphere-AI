import { Link } from "@tanstack/react-router";
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  FileUp,
  GraduationCap,
  Headphones,
  Megaphone,
  MessagesSquare,
  PieChart,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  StickyNote,
  TrendingUp,
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
import { AckTracker } from "@/components/governance/AckTracker";
import { ScenarioBanner } from "@/components/ops/ScenarioBanner";
import { MissionControl } from "@/components/mission/MissionControl";
import { ReadinessScore } from "@/components/mission/ReadinessScore";
import { Leaderboards } from "@/components/mission/Leaderboards";
import { KnowledgeGapInsights } from "@/components/exec/KnowledgeGapInsights";
import { ExecutiveIntelligence } from "@/components/exec/ExecutiveIntelligence";
import { ExecutiveCommandCenter } from "@/components/exec/ExecutiveCommandCenter";
import { EnterpriseActivityFeed } from "@/components/feed/EnterpriseActivityFeed";
import { KpiDrillSheet, type KpiDrill } from "@/components/exec/KpiDrillSheet";
import { AnimatedCounter } from "@/components/ui-bits/AnimatedCounter";
import { useState } from "react";
import { WelcomeBanner } from "@/components/welcome/WelcomeBanner";
import { SmartQuickActions } from "@/components/quick-actions/SmartQuickActions";
import { FavoritesRecent } from "@/components/layout/FavoritesRecent";
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
import { type DirectoryEntry } from "@/lib/directory";
import { FixtureNotice } from "@/components/ui-bits/FixtureNotice";

function Greeting({ user, subtitle }: { user: DirectoryEntry; subtitle: string }) {
  return (
    <div>
      <h1 className="sr-only">Operational Dashboard</h1>
      <WelcomeBanner />
      <p className="-mt-4 mb-4 text-sm text-muted-foreground">{subtitle}</p>
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2"><SmartQuickActions /></div>
        <FavoritesRecent />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Regular Staff Dashboard
// ────────────────────────────────────────────────────────────────────────────
export function StaffDashboard({ user }: { user: DirectoryEntry }) {
  const maxScore = Math.max(...qaScores.map((s) => s.score));

  return (
    <>
      <div className="mb-6">
        <ProductsAndNews />
      </div>
      <WelcomeBanner />
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2"><SmartQuickActions /></div>
        <FavoritesRecent />
      </div>
      <MissionControl user={user} />

      <ScenarioBanner />

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2"><ReadinessScore user={user} /></div>
        <TodaysWorkflow role="staff" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Assigned SOPs" value={sops.length} delta="+2 this month" icon={BookOpen} tone="primary" />
        <StatCard label="SOP Completion" value="68%" delta="Across assigned" icon={CheckCircle2} tone="success" />
        <StatCard label="Monthly Assessments" value={3} delta="1 due this week" icon={CalendarDays} tone="warning" />
        <StatCard label="My QA Score (May)" value="93%" delta="+2 vs Apr" icon={Award} tone="primary" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-3"><EnterpriseActivityFeed /></div>
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
          <div className="text-sm text-muted-foreground">
            No verified QA allocation is available yet. Your QA Officer will appear here once
            QA allocations are governed in CoreSphere.
          </div>
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

  return (
    <>
      <div className="mb-6"><ProductsAndNews /></div>
      <Greeting user={user} subtitle="Audit, score and coach your assigned operational staff for the month." />

      <ScenarioBanner />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Assigned Staff" value="—" delta="Awaiting governed QA allocation" icon={Users} tone="primary" />
        <StatCard label="Audits This Month" value={112} delta="+18 vs last month" icon={ClipboardCheck} tone="success" />
        <StatCard label="Compliance Failures" value={4} delta="Open coaching" icon={ShieldAlert} tone="warning" />
        <StatCard label="Avg Scorecard" value="87.4%" delta="Department-wide" icon={Award} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2"><TodaysWorkflow role="qa" /></div>
        <ComplianceHealth scope="QA Portfolio" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <KnowledgeGapInsights title="AI Knowledge Gap Engine" />
        <Leaderboards title="Group Leaderboard" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <AtRiskStaff />
        <EnterpriseActivityFeed />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <PanelCard className="lg:col-span-2" title="My Assigned Staff" description="QA chat routes only to these staff for the month" action={<MessagesSquare className="h-4 w-4 text-muted-foreground" />}>
          <p className="py-6 text-sm text-muted-foreground">
            No verified QA allocation is available yet. Allocated staff will appear here once QA
            allocations are governed in CoreSphere by the QA Team Lead.
          </p>
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

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <KnowledgeGapInsights title="Enterprise Knowledge Gaps" />
        <Leaderboards title="Group Leaderboard" />
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
  return (
    <>
      <div className="mb-6"><ProductsAndNews /></div>
      <Greeting user={user} subtitle={`Visibility scoped to ${user.department}. Monitor your team's operations, QA performance and departmental knowledge.`} />

      <ScenarioBanner />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Team Size" value="—" delta="Awaiting configured reporting lines" icon={Users} tone="primary" />
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

      <div className="mt-4">
        <AckTracker department={user.department} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <KnowledgeGapInsights department={user.department} title={`${user.department} Knowledge Gaps`} />
        <Leaderboards department={user.department} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <PanelCard className="lg:col-span-2" title="Team Roster" description="Completion + QA per direct report">
          <ul className="divide-y -my-2">
            {team.length === 0 && (
              <li className="py-6 text-sm text-muted-foreground">
                No direct reports are recorded against your position.
              </li>
            )}
            {team.map((m) => (
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
  const [drill, setDrill] = useState<Omit<KpiDrill, "open" | "onOpenChange"> | null>(null);

  const tiles: Array<{
    label: string;
    value: number;
    suffix?: string;
    decimals?: number;
    icon: any;
    tone: "primary" | "success" | "warning";
    delta: string;
    drill: Omit<KpiDrill, "open" | "onOpenChange">;
  }> = [
    {
      label: "Active Workforce", value: 1284, icon: Users, tone: "primary", delta: "+4.2% WoW",
      drill: { title: "Active Workforce", description: "Daily active staff across Customer Fulfilment", metric: "1,284", delta: "+4.2% week-on-week", sparkline: [1180, 1205, 1222, 1240, 1260, 1284], rows: [
        { label: "FHD", primary: 412, trend: 5 }, { label: "Inbound", primary: 386, trend: 3 }, { label: "Multimedia", primary: 268, trend: 6 }, { label: "Social Media", primary: 218, trend: 2 }, { label: "Video Validation", primary: 174, trend: 7 },
      ] },
    },
    {
      label: "LMS Adoption", value: 92, suffix: "%", icon: GraduationCap, tone: "success", delta: "8 departments",
      drill: { title: "Learning Adoption", description: "SOP & training completion enterprise-wide", metric: "92%", delta: "+3 pts vs last month", sparkline: [81, 84, 86, 88, 90, 92], rows: [
        { label: "FHD", primary: "94%", trend: 2 }, { label: "Inbound", primary: "90%", trend: 4 }, { label: "Multimedia", primary: "88%", trend: 3 },
      ], watchlist: [{ label: "Social Media", primary: "83%", secondary: "Below 85% target", trend: -1 }] },
    },
    {
      label: "Group QA Average", value: 88.6, suffix: "%", decimals: 1, icon: Award, tone: "primary", delta: "+1.4 vs last month",
      drill: { title: "Quality Assurance", description: "Rolling QA scorecards by department", metric: "88.6%", delta: "+1.4 pts month-on-month", sparkline: [85, 86, 86.5, 87, 88, 88.6], rows: [
        { label: "FHD", primary: "91%", trend: 1 }, { label: "Video Validation", primary: "90%", trend: 2 }, { label: "Inbound", primary: "87%", trend: 1 },
      ], watchlist: [{ label: "Social Media", primary: "84%", secondary: "Coaching in progress", trend: -2 }] },
    },
    {
      label: "Compliance Rate", value: 96, suffix: "%", icon: ShieldCheck, tone: "success", delta: "Memo acks",
      drill: { title: "Compliance & Acknowledgements", description: "Critical-content read receipts", metric: "96%", delta: "+2 pts vs last month", sparkline: [90, 91, 93, 94, 95, 96], rows: [
        { label: "AML Refresher", primary: "97%", trend: 3 }, { label: "Block Card Tree", primary: "95%", trend: 2 },
      ], watchlist: [{ label: "KPI Review memo", primary: "88%", secondary: "147 outstanding", trend: -1 }] },
    },
    {
      label: "Fraud Advisories", value: 7, icon: ShieldAlert, tone: "warning", delta: "2 active this week",
      drill: { title: "Fraud & Risk Advisories", description: "Live typologies and escalations", metric: "7", delta: "2 active this week", rows: [
        { label: "SIM-swap impersonation", primary: "Active", trend: 0 }, { label: "Refund social-engineering", primary: "Active", trend: 0 }, { label: "Card-not-present spike", primary: "Monitoring", trend: 0 },
      ] },
    },
    {
      label: "AI Assist Usage", value: 3421, icon: Bot, tone: "primary", delta: "+18% WoW",
      drill: { title: "CoreSphere AI Usage", description: "Operational queries answered this month", metric: "3,421", delta: "+18% week-on-week", sparkline: [2400, 2650, 2800, 3050, 3200, 3421], rows: [
        { label: "SOP lookups", primary: 1480, trend: 12 }, { label: "Coaching drafts", primary: 902, trend: 22 }, { label: "Policy Q&A", primary: 1039, trend: 16 },
      ] },
    },
    {
      label: "Engagement Index", value: 78, suffix: "%", icon: TrendingUp, tone: "success", delta: "+6 pts",
      drill: { title: "Workforce Engagement", description: "Logins, learning streaks, participation", metric: "78%", delta: "+6 pts vs last month", sparkline: [66, 68, 70, 73, 75, 78], rows: [
        { label: "Daily login rate", primary: "84%", trend: 4 }, { label: "Learning streaks", primary: "61%", trend: 9 },
      ] },
    },
    {
      label: "Open Escalations", value: 11, icon: ShieldAlert, tone: "warning", delta: "Across departments",
      drill: { title: "Open Escalations", description: "Awaiting leadership action", metric: "11", delta: "3 breaching SLA", rows: [
        { label: "FHD", primary: 4, trend: 0 }, { label: "Inbound", primary: 3, trend: 0 }, { label: "Multimedia", primary: 2, trend: 0 }, { label: "Social Media", primary: 2, trend: 0 }, { label: "Video Validation", primary: 1, trend: 0 },
      ] },
    },
  ];

  return (
    <>
      <div className="mb-6"><ProductsAndNews /></div>
      <Greeting user={user} subtitle="Executive Operations Command Center — real-time intelligence across Customer Fulfilment. Click any metric to drill down." />

      <ScenarioBanner />

      <div className="grid lg:grid-cols-3 gap-4">
        <ComplianceHealth scope="Enterprise" />
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          {tiles.map((t) => (
            <button
              key={t.label}
              onClick={() => setDrill(t.drill)}
              className="group relative text-left bg-card border rounded-xl p-4 shadow-sm hover:border-primary/50 hover:shadow-md transition-all overflow-hidden animate-fade-up"
            >
              <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
              <t.icon className={`h-4 w-4 ${t.tone === "warning" ? "text-[color:var(--warning)]" : t.tone === "success" ? "text-[color:var(--success)]" : "text-primary"}`} />
              <div className="mt-3 text-xl font-semibold tracking-tight tabular-nums">
                <AnimatedCounter value={t.value} suffix={t.suffix} decimals={t.decimals ?? 0} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{t.label}</div>
              <div className="text-[10px] text-muted-foreground/80 mt-1">{t.delta}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2"><TodaysWorkflow role="group_head" /></div>
        <AckTracker />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <AtRiskStaff />
        <EnterpriseActivityFeed />
      </div>

      <div className="mt-4"><ExecutiveIntelligence /></div>

      <div className="mt-4"><ExecutiveCommandCenter /></div>

      <div className="mt-4"><KnowledgeGapInsights title="Enterprise Knowledge Gap Engine" /></div>

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

      <KpiDrillSheet
        open={!!drill}
        onOpenChange={(o) => !o && setDrill(null)}
        title={drill?.title ?? ""}
        description={drill?.description ?? ""}
        metric={drill?.metric ?? ""}
        delta={drill?.delta}
        sparkline={drill?.sparkline}
        rows={drill?.rows ?? []}
        watchlist={drill?.watchlist}
      />
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