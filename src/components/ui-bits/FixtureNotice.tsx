import { Info } from "lucide-react";

/**
 * Single reusable data-truth marker (Package A6).
 *
 * Applied to authoritative-looking prototype surfaces whose content is static
 * demonstration/UAT fixture data rather than governed operational knowledge.
 */
export function FixtureNotice({
  label = "Demonstration/UAT fixture — not approved operational guidance",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-dashed bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground ${className}`}
    >
      <Info className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
