import { createFileRoute } from "@tanstack/react-router";
import { Bell, MessageSquare, Award, AlertTriangle, BookOpen } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard } from "@/components/ui-bits/Card";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — UBA CoreSphere" },
      { name: "description", content: "Your CoreSphere notifications — scorecards, memos, missions and operational alerts." },
      { property: "og:title", content: "Notifications — UBA CoreSphere" },
      { property: "og:description", content: "Your CoreSphere notifications — scorecards, memos, missions and operational alerts." },
      { property: "og:url", content: "https://ubacoresphere-pulse.lovable.app/notifications" },
    ],
    links: [{ rel: "canonical", href: "https://ubacoresphere-pulse.lovable.app/notifications" }],
  }),
  component: Notifications,
});

const items = [
  { icon: Award, title: "New QA scorecard available", body: "Your week 2 scorecard from Ngozi Umeh is ready to acknowledge.", time: "12 min ago", unread: true },
  { icon: BookOpen, title: "SOP-005 updated", body: "Live Chat Escalation Matrix has a new approved version.", time: "1 hr ago", unread: true },
  { icon: AlertTriangle, title: "Compliance memo expires soon", body: "Mandatory AML Refresher acknowledgement due in 3 days.", time: "3 hrs ago", unread: false },
  { icon: MessageSquare, title: "Coaching session scheduled", body: "Friday 14:00 with Femi Adebayo.", time: "Yesterday", unread: false },
  { icon: Bell, title: "Townhall reminder", body: "Quarterly Operations Townhall starts in 24 hours.", time: "Yesterday", unread: false },
];

function Notifications() {
  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Inbox</div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Notifications</h1>
        </div>
        <button className="text-xs text-primary hover:underline">Mark all as read</button>
      </div>
      <PanelCard>
        <ul className="divide-y -my-2">
          {items.map((n, i) => {
            const Icon = n.icon;
            return (
              <li key={i} className="py-4 flex gap-3 items-start">
                <div className={`h-9 w-9 rounded-md flex items-center justify-center shrink-0 ${n.unread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium truncate">{n.title}</h4>
                    {n.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                  <div className="text-[11px] text-muted-foreground mt-1">{n.time}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </PanelCard>
    </AppShell>
  );
}