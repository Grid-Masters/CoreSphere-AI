import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard } from "@/components/ui-bits/Card";
import { LifeBuoy, BookOpen, MessagesSquare, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/_authenticated/help")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Help & Support — UBA CoreSphere" },
      { name: "description", content: "Find enterprise support channels for CoreSphere: FAQ, coaching, and Group Governance." },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  const items = [
    { icon: BookOpen, title: "FAQ Center", desc: "Common answers curated by L&D.", to: "/faq" as const },
    { icon: MessagesSquare, title: "QA Coaching Hub", desc: "Message your assigned QA officer.", to: "/qa-coaching" as const },
    { icon: ShieldAlert, title: "Report an Issue", desc: "Raise an alert to Platform Governance.", to: "/alerts" as const },
    { icon: LifeBuoy, title: "Suggestion Box", desc: "Send a suggestion or product idea.", to: "/suggestions" as const },
  ];
  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Support</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Help & Support</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link key={it.to} to={it.to}>
              <PanelCard>
                <div className="flex items-start gap-3">
                  <span className="h-9 w-9 rounded-md bg-primary/10 text-primary grid place-items-center shrink-0">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{it.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{it.desc}</div>
                  </div>
                </div>
              </PanelCard>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}