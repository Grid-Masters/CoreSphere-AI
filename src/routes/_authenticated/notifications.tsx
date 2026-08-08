import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell,
  MessageSquare,
  Award,
  AlertTriangle,
  BookOpen,
  Search,
  ShieldCheck,
  Lock,
  Filter,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard } from "@/components/ui-bits/Card";
import {
  markAllNotifRead,
  markNotifRead,
  useNotifRead,
  MANDATORY_NOTIF_CATEGORIES,
} from "@/lib/workspace-prefs";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Notifications — UBA CoreSphere" },
      { name: "description", content: "Your CoreSphere notifications — scorecards, memos, missions and operational alerts." },
      { property: "og:title", content: "Notifications — UBA CoreSphere" },
      { property: "og:description", content: "Your CoreSphere notifications — scorecards, memos, missions and operational alerts." },
    ],
  }),
  component: Notifications,
});

type Priority = "critical" | "high" | "normal";
type Category = "qa" | "governance" | "security" | "compliance" | "learning" | "announcement" | "system";

type NotifItem = {
  id: string;
  icon: typeof Bell;
  title: string;
  body: string;
  time: string;
  category: Category;
  priority: Priority;
  mandatory?: boolean;
};

const items: NotifItem[] = [
  { id: "n1", icon: Award, title: "New QA scorecard available", body: "Your week 2 scorecard from Ngozi Umeh is ready to acknowledge.", time: "12 min ago", category: "qa", priority: "normal" },
  { id: "n2", icon: BookOpen, title: "SOP-005 updated", body: "Live Chat Escalation Matrix has a new approved version.", time: "1 hr ago", category: "learning", priority: "high" },
  { id: "n3", icon: AlertTriangle, title: "Compliance memo expires soon", body: "Mandatory AML Refresher acknowledgement due in 3 days.", time: "3 hrs ago", category: "compliance", priority: "critical", mandatory: true },
  { id: "n4", icon: ShieldCheck, title: "Security policy acknowledgement", body: "Please review the updated data handling policy.", time: "5 hrs ago", category: "security", priority: "high", mandatory: true },
  { id: "n5", icon: MessageSquare, title: "Coaching session scheduled", body: "Friday 14:00 with Femi Adebayo.", time: "Yesterday", category: "qa", priority: "normal" },
  { id: "n6", icon: Bell, title: "Townhall reminder", body: "Quarterly Operations Townhall starts in 24 hours.", time: "Yesterday", category: "announcement", priority: "normal" },
];

const FILTERS: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "security", label: "Security" },
  { id: "governance", label: "Governance" },
  { id: "compliance", label: "Compliance" },
  { id: "learning", label: "Learning" },
  { id: "qa", label: "QA" },
  { id: "announcement", label: "Announcements" },
];

const priorityTone: Record<Priority, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  high: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  normal: "bg-primary/10 text-primary border-primary/20",
};

function Notifications() {
  const { readIds } = useNotifRead();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return items.filter((n) => {
      if (filter !== "all" && n.category !== filter) return false;
      if (query && !(n.title + " " + n.body).toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [filter, query]);

  const unreadCount = items.filter((n) => !readIds.includes(n.id)).length;

  const onMarkAll = () => markAllNotifRead(items.map((n) => n.id));

  return (
    <AppShell>
      <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Inbox</div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1 flex items-center gap-3">
            Notification Centre
            {unreadCount > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Security, governance and compliance notifications are mandatory and cannot be muted.
          </p>
        </div>
        <button onClick={onMarkAll} className="text-xs px-3 h-8 rounded-md border hover:bg-muted">
          Mark all as read
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 h-9 px-3 rounded-md border bg-background flex-1 min-w-[200px] max-w-md">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            aria-label="Search notifications"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notifications…"
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Filter className="h-3 w-3" />
          Filter
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`text-xs px-2.5 h-8 rounded-full border transition-colors ${
                filter === f.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <PanelCard>
        <ul className="divide-y -my-2">
          {filtered.length === 0 && (
            <li className="py-8 text-center text-sm text-muted-foreground">
              No notifications match your filters.
            </li>
          )}
          {filtered.map((n) => {
            const Icon = n.icon;
            const unread = !readIds.includes(n.id);
            const isMandatory = n.mandatory || MANDATORY_NOTIF_CATEGORIES.includes(n.category);
            return (
              <li
                key={n.id}
                className={`py-4 flex gap-3 items-start ${unread ? "" : "opacity-70"}`}
              >
                <div className={`h-9 w-9 rounded-md flex items-center justify-center shrink-0 ${unread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-medium truncate">{n.title}</h4>
                    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${priorityTone[n.priority]}`}>
                      {n.priority}
                    </span>
                    {isMandatory && (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border bg-muted text-muted-foreground inline-flex items-center gap-1">
                        <Lock className="h-2.5 w-2.5" /> Mandatory
                      </span>
                    )}
                    {unread && <span className="h-2 w-2 rounded-full bg-primary ml-auto" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-muted-foreground">{n.time}</div>
                    {unread && (
                      <button
                        onClick={() => markNotifRead(n.id)}
                        className="text-[11px] text-primary hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </PanelCard>
    </AppShell>
  );
}