import { useEffect, useState } from "react";
import { Sparkles, Clock, Users, Building2, Briefcase } from "lucide-react";
import { useActiveUser } from "@/lib/active-user";
import { useApprovedQuote } from "@/lib/approved-quotes";
import { greetingForHour } from "@/lib/quotes";
import { useShifts } from "@/lib/shifts";

function useCurrentHour(): number {
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => {
    setHour(new Date().getHours());
    const id = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(id);
  }, []);
  return hour ?? 9;
}

/**
 * BF-001B §5 Intelligent Welcome — time-of-day greeting, department, team,
 * role and shift context, plus a rotating quote sourced from the L&D /
 * Corporate Communications approved library.
 */
export function WelcomeBanner() {
  const user = useActiveUser();
  const shifts = useShifts();
  const quote = useApprovedQuote();
  const hour = useCurrentHour();
  const hello = greetingForHour(hour);
  const firstName = user.name.split(" ")[0];
  const todayShift = shifts.find((s) => s.staffEmail === user.email);
  const teamLabel = user.unit;

  return (
    <section
      aria-label="Welcome"
      className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-5 sm:p-7 mb-6"
    >
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div className="relative">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
          {hello}, {firstName}.
        </h1>

        <dl className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <Meta icon={Building2} label="Department" value={user.department} />
          <Meta icon={Users} label="Team" value={teamLabel} />
          <Meta icon={Briefcase} label="Role" value={user.roleLabel.split("•").pop()?.trim() ?? user.roleLabel} />
          <Meta
            icon={Clock}
            label="Shift"
            value={todayShift ? `${todayShift.slot} • ${todayShift.day}` : "Not scheduled"}
          />
        </dl>

        {quote && (
          <figure className="mt-5 flex items-start gap-3 border-l-2 border-primary/60 pl-4">
            <Sparkles className="h-4 w-4 mt-0.5 text-primary shrink-0" aria-hidden />
            <div>
              <blockquote className="text-sm italic text-foreground/85">"{quote.quote}"</blockquote>
              <figcaption className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                {quote.author ?? "Approved"} • {quote.source_module}
              </figcaption>
            </div>
          </figure>
        )}
      </div>
    </section>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium truncate">{value}</dd>
    </div>
  );
}