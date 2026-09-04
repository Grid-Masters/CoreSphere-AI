import { AlertTriangle } from "lucide-react";

/**
 * Persistent environment classification. This is intentionally hard-coded
 * until a separately approved deployment configuration service exists.
 */
export function PreProductionNotice() {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 border-b border-amber-300/70 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-950 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-100"
    >
      <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>Pre-production environment — not approved for production banking use.</span>
    </div>
  );
}
