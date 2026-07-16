import { useEffect, useState } from "react";
import { AlertTriangle, Info, Wrench, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Banner = {
  id: string;
  title: string;
  body: string | null;
  severity: string | null;
  starts_at: string | null;
  ends_at: string | null;
};

const DISMISS_KEY = "coresphere.opsbanner.dismissed";

function readDismissed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(DISMISS_KEY) || "[]");
  } catch {
    return [];
  }
}

/**
 * BF-001B §12 Operational Status Banner. Reads from the governed
 * `incident_banners` table (maker-checker approved) and renders the highest
 * priority active banner. Users can dismiss non-critical banners; critical
 * banners cannot be dismissed.
 */
export function OperationalStatusBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    setDismissed(readDismissed());
    let alive = true;
    (async () => {
      const nowIso = new Date().toISOString();
      const { data } = await supabase
        .from("incident_banners")
        .select("id, title, body, severity, starts_at, ends_at")
        .lte("starts_at", nowIso)
        .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
        .order("severity", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (alive && data) setBanner(data as Banner);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!banner) return null;
  if (dismissed.includes(banner.id)) return null;

  const severity = (banner.severity || "info").toLowerCase();
  const critical = severity === "critical" || severity === "high";
  const Icon = severity === "maintenance" ? Wrench : critical ? AlertTriangle : Info;
  const tone = critical
    ? "bg-destructive/10 border-destructive/40 text-destructive"
    : severity === "maintenance"
      ? "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300"
      : "bg-primary/10 border-primary/30 text-primary";

  const onDismiss = () => {
    const next = [...dismissed, banner.id];
    setDismissed(next);
    try {
      window.localStorage.setItem(DISMISS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      role={critical ? "alert" : "status"}
      className={`border-b px-4 py-2.5 flex items-start gap-3 ${tone}`}
    >
      <Icon className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
      <div className="flex-1 min-w-0 text-sm">
        <span className="font-semibold">{banner.title}</span>
        {banner.body && <span className="ml-2 text-foreground/80">{banner.body}</span>}
      </div>
      {!critical && (
        <button
          aria-label="Dismiss operational banner"
          onClick={onDismiss}
          className="text-current/70 hover:text-current"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}