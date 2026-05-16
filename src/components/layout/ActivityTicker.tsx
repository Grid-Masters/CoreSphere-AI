import { Link } from "@tanstack/react-router";
import { Bell, Clock, Megaphone, StickyNote, ClipboardCheck } from "lucide-react";
import { tickerItems, type TickerItem } from "@/lib/mock-data";

const iconFor = (kind: TickerItem["kind"]) => {
  switch (kind) {
    case "assessment": return ClipboardCheck;
    case "deadline": return Clock;
    case "memo": return StickyNote;
    case "announcement": return Megaphone;
  }
};

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex items-center gap-8 shrink-0 pr-8" aria-hidden={ariaHidden}>
      {tickerItems.map((item) => {
        const Icon = iconFor(item.kind);
        return (
          <Link
            key={item.id}
            to={item.href}
            className="inline-flex items-center gap-2 text-xs whitespace-nowrap hover:text-primary transition-colors"
          >
            <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="font-medium">{item.text}</span>
            <span className="text-muted-foreground">— from {item.from}</span>
            {item.due && (
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                Due {item.due}
              </span>
            )}
            <span className="text-border" aria-hidden>•</span>
          </Link>
        );
      })}
    </div>
  );
}

export function ActivityTicker() {
  return (
    <div className="h-9 border-b bg-card flex items-center overflow-hidden sticky top-0 z-30">
      <div className="hidden sm:flex items-center gap-2 px-4 h-full border-r shrink-0 bg-primary/5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-primary opacity-60 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <Bell className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">Live</span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="flex w-max animate-marquee">
          <Row />
          <Row ariaHidden />
        </div>
      </div>
    </div>
  );
}