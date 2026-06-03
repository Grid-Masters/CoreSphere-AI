import { useMemo, useState } from "react";
import { CheckCircle2, Clock, Megaphone, Newspaper, Pin, User } from "lucide-react";
import { newsCategories, newsItems, type NewsCategory, type NewsItem, type NewsPriority } from "@/lib/news";

function priorityChip(p: NewsPriority) {
  if (p === "Critical") {
    return "bg-[color:var(--destructive)] text-white";
  }
  if (p === "Important") {
    return "bg-[color:var(--warning)] text-white";
  }
  return "bg-primary text-primary-foreground";
}

function FeatureCard({ item }: { item: NewsItem }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm h-full">
      <div className="relative h-48 md:h-full md:min-h-[280px] overflow-hidden">
        <img
          src={item.image}
          alt=""
          width={768}
          height={512}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${priorityChip(item.priority)}`}>
            {item.priority}
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white backdrop-blur">
            {item.category}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white">
          <h3 className="text-base md:text-xl font-semibold leading-snug">{item.title}</h3>
          <p className="mt-1.5 text-xs md:text-sm text-white/80 line-clamp-2 md:line-clamp-3">{item.body}</p>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-white/70">
            <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> {item.author}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {item.publishedOn}</span>
            {item.requiresAck && (
              <span className="inline-flex items-center gap-1 text-amber-300">
                <CheckCircle2 className="h-3 w-3" /> Ack required
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ListCard({ item }: { item: NewsItem }) {
  return (
    <article className="group flex gap-3 rounded-xl border bg-card p-2.5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
        <img
          src={item.image}
          alt=""
          width={768}
          height={512}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full ${priorityChip(item.priority)}`}>
            {item.priority}
          </span>
          <span className="text-[10px] text-muted-foreground truncate">{item.category}</span>
          {item.pinned && <Pin className="h-3 w-3 text-primary shrink-0" />}
        </div>
        <h4 className="mt-1 text-sm font-medium leading-snug line-clamp-2">{item.title}</h4>
        <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="truncate">{item.author}</span>
          <span aria-hidden>•</span>
          <span className="tabular-nums shrink-0">{item.timestamp}</span>
        </div>
      </div>
    </article>
  );
}

/**
 * Enterprise communications hub. Image-rich news portal visible to every role:
 * a featured executive story, a category filter, and a scannable list feed.
 */
export function ProductsAndNews() {
  const [active, setActive] = useState<NewsCategory | "All">("All");

  const filtered = useMemo(
    () => (active === "All" ? newsItems : newsItems.filter((n) => n.category === active)),
    [active],
  );

  const featured = useMemo(
    () => filtered.find((n) => n.pinned) ?? filtered[0],
    [filtered],
  );
  const rest = useMemo(() => filtered.filter((n) => n.id !== featured?.id), [filtered, featured]);

  return (
    <section className="bg-card border rounded-2xl shadow-sm overflow-hidden">
      <header className="px-5 py-3.5 border-b flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Newspaper className="h-4 w-4 text-primary shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold tracking-tight truncate">UBA Communications Hub</h3>
            <p className="text-[11px] text-muted-foreground truncate">
              Enterprise news, announcements &amp; operational updates
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          <Megaphone className="h-3 w-3" /> All staff
        </span>
      </header>

      <div className="px-4 pt-3 flex gap-1.5 overflow-x-auto no-scrollbar">
        {(["All", ...newsCategories] as const).map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
              active === c
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="p-4 grid gap-4 lg:grid-cols-2">
        {featured && <FeatureCard item={featured} />}
        <div className="grid gap-2.5 content-start max-h-[420px] overflow-y-auto pr-1">
          {rest.map((n) => (
            <ListCard key={n.id} item={n} />
          ))}
          {rest.length === 0 && !featured && (
            <p className="text-sm text-muted-foreground py-8 text-center">No communications in this category.</p>
          )}
        </div>
      </div>
    </section>
  );
}