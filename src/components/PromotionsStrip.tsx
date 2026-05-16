import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Newspaper, Tag, ArrowRight } from "lucide-react";
import { bankPromotions, type BankPromotion } from "@/lib/mock-data";

const iconFor = (c: BankPromotion["category"]) =>
  c === "Product" ? Sparkles : c === "News" ? Newspaper : Tag;

export function PromotionsStrip() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = bankPromotions.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      setIndex((i) => (i + 1) % total);
    }, 6000);
    return () => clearInterval(t);
  }, [paused, total]);

  // Show 1 on mobile, 2 on md, 3 on lg
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section
      className="bg-card border rounded-xl shadow-sm overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <header className="px-5 py-4 border-b flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Products & News from UBA</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Latest offerings, campaigns and bank-wide announcements
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            aria-label="Previous"
            className="h-8 w-8 rounded-md border bg-background hover:bg-muted inline-flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="h-8 w-8 rounded-md border bg-background hover:bg-muted inline-flex items-center justify-center"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {bankPromotions.map((p) => {
            const Icon = iconFor(p.category);
            return (
              <div key={p.id} className="w-full shrink-0 p-5">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 relative overflow-hidden rounded-lg border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10" />
                    <div className="relative">
                      <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full bg-primary/15 text-primary">
                        <Icon className="h-3 w-3" /> {p.category}
                      </div>
                      <h4 className="mt-3 text-xl font-semibold tracking-tight">{p.title}</h4>
                      <p className="mt-2 text-sm text-muted-foreground max-w-xl">{p.tagline}</p>
                      <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                        {p.cta} <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col gap-3">
                    {bankPromotions
                      .filter((_, i) => i !== index)
                      .slice(0, 2)
                      .map((q) => {
                        const QIcon = iconFor(q.category);
                        return (
                          <div
                            key={q.id}
                            className="border rounded-lg p-3 bg-background hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => setIndex(bankPromotions.findIndex((x) => x.id === q.id))}
                          >
                            <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                              <QIcon className="h-3 w-3" /> {q.category}
                            </div>
                            <div className="mt-1 text-sm font-medium line-clamp-1">{q.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{q.tagline}</div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 pb-4 flex items-center justify-center gap-1.5">
        {bankPromotions.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}