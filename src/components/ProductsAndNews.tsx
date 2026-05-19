import { useMemo } from "react";
import { AlertTriangle, Megaphone, Pin, ShieldAlert, Sparkles, Tag } from "lucide-react";
import { newsItems, type NewsCategory, type NewsItem, type NewsPriority } from "@/lib/news";

function priorityChip(p: NewsPriority) {
  if (p === "Critical") {
    return "bg-[color:var(--destructive)]/15 text-[color:var(--destructive)] border-[color:var(--destructive)]/20";
  }
  if (p === "Important") {
    return "bg-[color:var(--warning)]/15 text-[color:var(--warning)] border-[color:var(--warning)]/30";
  }
  return "bg-primary/10 text-primary border-primary/20";
}

function iconFor(c: NewsCategory) {
  if (c === "Fraud Bulletin") return ShieldAlert;
  if (c === "Regulatory") return AlertTriangle;
  if (c === "Product") return Sparkles;
  if (c === "Campaign") return Tag;
  return Megaphone;
}

function Card({ item }: { item: NewsItem }) {
  const Icon = iconFor(item.category);
  return (
    <article className="shrink-0 w-[320px] md:w-[360px] bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <header className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${priorityChip(
            item.priority,
          )}`}
        >
          <Icon className="h-3 w-3" /> {item.priority}
        </span>
        {item.pinned && (
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <Pin className="h-3 w-3" /> Pinned
          </span>
        )}
      </header>
      <h4 className="text-sm font-semibold leading-snug">{item.title}</h4>
      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-3">{item.body}</p>
      <footer className="mt-3 pt-3 border-t flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        <span className="truncate max-w-[60%]">{item.category} • {item.departmentTag}</span>
        <span className="tabular-nums">{item.timestamp}</span>
      </footer>
    </article>
  );
}

/**
 * Global Products & News strip. Visible to every role.
 * Pinned items stay anchored at the left; the rest auto-scroll horizontally
 * with a CSS marquee that pauses on hover and respects reduced motion.
 */
export function ProductsAndNews() {
  const { pinned, rest } = useMemo(() => {
    const pinned = newsItems.filter((n) => n.pinned);
    const rest = newsItems.filter((n) => !n.pinned);
    return { pinned, rest };
  }, []);

  return (
    <section className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <header className="px-5 py-3 border-b flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Megaphone className="h-4 w-4 text-primary shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold tracking-tight truncate">
              Products &amp; News
            </h3>
            <p className="text-[11px] text-muted-foreground truncate">
              Enterprise operational intelligence — visible to all staff
            </p>
          </div>
        </div>
      </header>

      {pinned.length > 0 && (
        <div className="px-4 pt-4 flex gap-3 overflow-x-auto">
          {pinned.map((n) => (
            <Card key={n.id} item={n} />
          ))}
        </div>
      )}

      <div className="px-4 py-4 overflow-hidden">
        <div className="flex gap-3 animate-marquee w-max">
          {[...rest, ...rest].map((n, i) => (
            <Card key={`${n.id}-${i}`} item={n} />
          ))}
        </div>
      </div>
    </section>
  );
}