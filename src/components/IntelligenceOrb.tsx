import { useRouterState } from "@tanstack/react-router";

export type OrbState = "normal" | "qa" | "assessment" | "critical";

const ACCENTS: Record<OrbState, string> = {
  normal: "oklch(0.62 0.19 256)", // blue
  qa: "oklch(0.78 0.16 80)", // amber
  assessment: "oklch(0.64 0.2 300)", // purple glow
  critical: "oklch(0.58 0.23 25.5)", // UBA red
};

const LABELS: Record<OrbState, string> = {
  normal: "Ready",
  qa: "QA feedback",
  assessment: "Assessment",
  critical: "Action needed",
};

export function orbStateForPath(path: string): OrbState {
  if (path.startsWith("/qa-coaching")) return "qa";
  if (path.startsWith("/assessments") || path.startsWith("/scenarios")) return "assessment";
  if (path.startsWith("/memos") || path.startsWith("/notifications")) return "critical";
  return "normal";
}

export function IntelligenceOrb({
  size = 56,
  onClick,
}: {
  size?: number;
  onClick: () => void;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const state = orbStateForPath(path);
  const accent = ACCENTS[state];

  return (
    <button
      onClick={onClick}
      aria-label={`Open CoreSphere AI — ${LABELS[state]}`}
      className="fixed bottom-6 right-6 z-50 group flex items-center justify-center hover:scale-105 transition-transform"
      style={{ width: size, height: size }}
    >
      <span
        className="orb block"
        style={{ width: size, height: size, ["--orb-accent" as any]: accent }}
      >
        <span className="absolute inset-0 flex items-center justify-center">
          <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 2.5c1.2 2.6 2.4 3.8 5 5-2.6 1.2-3.8 2.4-5 5-1.2-2.6-2.4-3.8-5-5 2.6-1.2 3.8-2.4 5-5z"
              fill="rgba(255,255,255,0.92)"
            />
            <circle cx="18.5" cy="6" r="1.4" fill="rgba(255,255,255,0.8)" />
          </svg>
        </span>
      </span>
      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[color:var(--success)] border-2 border-card" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-card border px-2 py-1 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
        CoreSphere AI · {LABELS[state]}
      </span>
    </button>
  );
}
