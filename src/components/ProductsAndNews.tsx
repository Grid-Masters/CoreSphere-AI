import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pause,
  Play,
  Radio,
  User,
  X,
} from "lucide-react";
import { newsItems, type NewsItem, type NewsPriority } from "@/lib/news";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const ROTATE_MS = 5000;

function priorityChip(p: NewsPriority) {
  if (p === "Critical") return "bg-[color:var(--destructive)] text-white";
  if (p === "Important") return "bg-[color:var(--warning)] text-white";
  return "bg-primary text-primary-foreground";
}

function priorityDot(p: NewsPriority) {
  if (p === "Critical") return "bg-[color:var(--destructive)]";
  if (p === "Important") return "bg-[color:var(--warning)]";
  return "bg-emerald-500";
}

/**
 * CoreSphere Pulse Feed — a compact, auto-rotating operational intelligence
 * ticker. One update at a time with category, title, timestamp and priority.
 * Click an item to open a right-side drawer with full details.
 */
export function ProductsAndNews() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<NewsItem | null>(null);
  const total = newsItems.length;

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total),
    [total],
  );

  const active = paused || hovered;
  useEffect(() => {
    if (active || total <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % total), ROTATE_MS);
    return () => clearInterval(t);
  }, [active, total]);

  const item = newsItems[index];

  const openDetail = (n: NewsItem) => {
    setDetail(n);
    setOpen(true);
  };

  return (
    <section
      aria-label="CoreSphere Pulse Feed"
      className="mb-6 overflow-hidden rounded-xl border bg-card shadow-sm"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 min-h-[60px] max-h-[90px]">
        {/* Brand / live indicator */}
        <div className="flex items-center gap-2 shrink-0 pr-2 sm:pr-3 border-r border-border/60">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Pulse Feed
          </span>
          <Radio className="h-4 w-4 text-primary sm:hidden" />
        </div>

        {/* Rotating item */}
        <button
          type="button"
          onClick={() => openDetail(item)}
          className="group flex-1 min-w-0 text-left"
        >
          <div key={item.id} className="animate-fade-in flex items-center gap-2 sm:gap-3 min-w-0">
            <span className={`hidden xs:inline-flex shrink-0 h-2 w-2 rounded-full ${priorityDot(item.priority)}`} aria-hidden />
            <span className={`shrink-0 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${priorityChip(item.priority)}`}>
              <span className="hidden sm:inline">{item.category}</span>
              <span className="sm:hidden">{item.priority}</span>
            </span>
            <span className="min-w-0 flex-1 truncate text-xs sm:text-sm font-medium group-hover:text-primary transition-colors">
              {item.title}
            </span>
            <span className="hidden md:inline-flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground tabular-nums">
              <Clock className="h-3 w-3" /> {item.timestamp}
            </span>
          </div>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-0.5 shrink-0 pl-1 sm:pl-2 border-l border-border/60">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous update"
            className="grid place-items-center h-7 w-7 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Resume" : "Pause"}
            className="grid place-items-center h-7 w-7 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next update"
            className="grid place-items-center h-7 w-7 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="hidden sm:inline ml-1 text-[10px] text-muted-foreground tabular-nums w-9 text-right">
            {index + 1}/{total}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-border/50 overflow-hidden">
        <div
          key={`${item.id}-${active}`}
          className="h-full bg-primary"
          style={{
            animation: active ? "none" : `pulse-progress ${ROTATE_MS}ms linear`,
            width: active ? "100%" : undefined,
          }}
        />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-y-auto">
          {detail && (
            <>
              <div className="relative h-44 overflow-hidden">
                <img src={detail.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="absolute top-3 right-3 grid place-items-center h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${priorityChip(detail.priority)}`}>
                    {detail.priority}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white backdrop-blur">
                    {detail.category}
                  </span>
                </div>
              </div>
              <SheetHeader className="px-5 pt-4 text-left">
                <SheetTitle className="text-lg leading-snug">{detail.title}</SheetTitle>
              </SheetHeader>
              <div className="px-5 pb-6 space-y-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> {detail.author}</span>
                  <span className="inline-flex items-center gap-1"><Activity className="h-3 w-3" /> {detail.authorRole}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {detail.publishedOn}</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{detail.body}</p>
                <div className="rounded-lg border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  Affected scope: <span className="font-medium text-foreground">{detail.departmentTag}</span>
                </div>
                {detail.requiresAck && (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                    <CheckCircle2 className="h-4 w-4" /> Acknowledgement required before next shift.
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}