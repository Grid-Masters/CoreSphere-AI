import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  FileText,
  HelpCircle,
  MessagesSquare,
  Video,
  ClipboardList,
  Megaphone,
  ShieldAlert,
  Sparkles,
  Search as SearchIcon,
  Clock,
  Package,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { searchCorpus, type CorpusEntry } from "@/lib/search-corpus";
import { supabase } from "@/integrations/supabase/client";
import { getActiveUser } from "@/lib/active-user";

export const OPEN_SEARCH_EVENT = "coresphere-open-search";
const RECENT_KEY = "coresphere.recent-searches.v1";

const catIcon: Record<CorpusEntry["category"], any> = {
  SOP: BookOpen,
  Policy: FileText,
  FAQ: HelpCircle,
  Coaching: MessagesSquare,
  Video: Video,
  Assessment: ClipboardList,
  Announcement: Megaphone,
  Advisory: ShieldAlert,
  "Product Knowledge": Package,
};

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function pushRecent(q: string) {
  if (typeof window === "undefined" || !q.trim()) return;
  const next = [q.trim(), ...readRecent().filter((r) => r !== q.trim())].slice(0, 6);
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

/** Mounted once globally. Opens on Cmd/Ctrl+K or the OPEN_SEARCH_EVENT. */
export function EnterpriseSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onEvt = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, onEvt);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, onEvt);
    };
  }, []);

  useEffect(() => {
    if (open) setRecent(readRecent());
  }, [open]);

  const results = useMemo(() => searchCorpus(query, 8), [query]);
  const grouped = useMemo(() => {
    const m = new Map<CorpusEntry["category"], CorpusEntry[]>();
    for (const r of results) {
      const arr = m.get(r.category) ?? [];
      arr.push(r);
      m.set(r.category, arr);
    }
    return Array.from(m.entries());
  }, [results]);

  const go = (entry: CorpusEntry) => {
    pushRecent(query);
    setOpen(false);
    setQuery("");
    if (entry.href) navigate({ to: entry.href });
  };

  const logUnresolved = async () => {
    const q = query.trim();
    if (!q) return;
    pushRecent(q);
    const user = getActiveUser();
    try {
      await supabase.from("failed_searches").insert({ query: q, department: user?.department ?? null });
    } catch {
      /* best-effort telemetry */
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0">
        <DialogTitle className="sr-only">Enterprise search</DialogTitle>
        <Command
          shouldFilter={false}
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          <CommandInput
            placeholder="Search SOPs, policies, FAQs, coaching, advisories…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
        {!query && recent.length > 0 && (
          <CommandGroup heading="Recent searches">
            {recent.map((r) => (
              <CommandItem key={r} value={`recent-${r}`} onSelect={() => setQuery(r)}>
                <Clock className="text-muted-foreground" />
                <span>{r}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {query && results.length === 0 && (
          <CommandEmpty>
            <div className="px-2">
              <div className="text-sm">No results for “{query}”.</div>
              <button
                onClick={logUnresolved}
                className="mt-3 inline-flex items-center gap-2 text-xs text-primary hover:underline"
              >
                <Sparkles className="h-3.5 w-3.5" /> Ask CoreSphere AI &amp; log knowledge gap
              </button>
            </div>
          </CommandEmpty>
        )}

        {grouped.map(([cat, items], i) => (
          <div key={cat}>
            {i > 0 && <CommandSeparator />}
            <CommandGroup heading={cat}>
              {items.map((entry) => {
                const Icon = catIcon[entry.category] ?? SearchIcon;
                return (
                  <CommandItem key={entry.id} value={`${entry.category}-${entry.title}`} onSelect={() => go(entry)}>
                    <Icon className="text-muted-foreground" />
                    <div className="min-w-0">
                      <div className="truncate">{entry.title}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{entry.snippet}</div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}