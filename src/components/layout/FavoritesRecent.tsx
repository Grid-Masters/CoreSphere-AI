import { Link } from "@tanstack/react-router";
import { Pin, Clock, Star, StarOff } from "lucide-react";
import { PanelCard } from "@/components/ui-bits/Card";
import {
  useFavorites,
  useRecent,
  toggleFavorite,
  isFavorite,
} from "@/lib/workspace-prefs";

/**
 * BF-001B §13 Favorites & Recently Used — pin frequent pages and view the
 * last places you were, so you can pick up where you left off.
 */
export function FavoritesRecent() {
  const favs = useFavorites();
  const recent = useRecent();

  return (
    <PanelCard title="Favorites & Recent" description="Pick up where you left off">
      <div className="grid gap-4 sm:grid-cols-2">
        <section>
          <h3 className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
            <Pin className="h-3 w-3" /> Pinned
          </h3>
          {favs.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Star any page from the header to pin it here.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {favs.slice(0, 6).map((f) => (
                <li key={f.path} className="flex items-center gap-2">
                  <Link to={f.path} className="text-sm hover:text-primary truncate flex-1">
                    {f.label}
                  </Link>
                  <button
                    aria-label={`Unpin ${f.label}`}
                    onClick={() => toggleFavorite(f.path, f.label)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <StarOff className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h3 className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
            <Clock className="h-3 w-3" /> Recently Used
          </h3>
          {recent.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Your recently visited pages will appear here.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {recent.slice(0, 6).map((r) => {
                const pinned = isFavorite(r.path);
                return (
                  <li key={r.path} className="flex items-center gap-2">
                    <Link to={r.path} className="text-sm hover:text-primary truncate flex-1">
                      {r.label}
                    </Link>
                    <button
                      aria-label={pinned ? `Unpin ${r.label}` : `Pin ${r.label}`}
                      onClick={() => toggleFavorite(r.path, r.label)}
                      className={`${pinned ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <Star className={`h-3.5 w-3.5 ${pinned ? "fill-current" : ""}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </PanelCard>
  );
}