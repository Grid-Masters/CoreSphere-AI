import { useEffect, useState } from "react";
import { Activity, BookOpen, ClipboardCheck, Megaphone, MessagesSquare, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";
import { PanelCard } from "@/components/ui-bits/Card";
import { liveEventPool, seedActivity, type ActivityEvent, type ActivityKind } from "@/lib/activity-feed";

function iconFor(k: ActivityKind) {
  switch (k) {
    case "fraud": return ShieldAlert;
    case "sop": return BookOpen;
    case "compliance": return ShieldCheck;
    case "coaching": return MessagesSquare;
    case "product": return Sparkles;
    case "audit": return ClipboardCheck;
    case "broadcast": return Megaphone;
    case "assessment":
    default: return Activity;
  }
}

export function EnterpriseActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>(seedActivity);
  useEffect(() => {
    const t = setInterval(() => {
      const pick = liveEventPool[Math.floor(Math.random() * liveEventPool.length)];
      const next: ActivityEvent = {
        ...pick,
        id: `live-${Date.now()}`,
        timeAgo: "just now",
      };
      setEvents((prev) => [next, ...prev].slice(0, 12));
    }, 25000);
    return () => clearInterval(t);
  }, []);

  return (
    <PanelCard title="Enterprise Activity" description="Live operational stream" action={<Activity className="h-4 w-4 text-muted-foreground" />}>
      <ul className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {events.map((e) => {
          const Icon = iconFor(e.kind);
          return (
            <li key={e.id} className={`flex items-start gap-3 ${e.emphasis ? "animate-fade-up" : ""}`}>
              <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${e.emphasis ? "bg-[color:var(--destructive)]/10 text-[color:var(--destructive)]" : "bg-muted text-muted-foreground"}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium leading-tight truncate">{e.title}</div>
                <div className="text-[11px] text-muted-foreground truncate">{e.detail}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{e.actor} • {e.timeAgo}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </PanelCard>
  );
}