import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useAcknowledged } from "@/lib/ack-store";

type Props = {
  targetId: string;
  targetKind?: string;
  className?: string;
  /** Compact pill style for tight rows, vs full button. */
  variant?: "button" | "pill";
};

export function AckButton({ targetId, targetKind = "memo", className = "", variant = "button" }: Props) {
  const [acked, confirm] = useAcknowledged(targetId);

  if (acked) {
    return (
      <span className={`text-[11px] text-[color:var(--success)] inline-flex items-center gap-1 ${className}`}>
        <CheckCircle2 className="h-3.5 w-3.5" /> Acknowledged
      </span>
    );
  }

  if (variant === "pill") {
    return (
      <button
        onClick={() => confirm(targetKind)}
        className={`text-[11px] px-2.5 h-7 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1 ${className}`}
      >
        <ShieldCheck className="h-3 w-3" /> Acknowledge
      </button>
    );
  }

  return (
    <button
      onClick={() => confirm(targetKind)}
      className={`text-xs px-3 h-8 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 ${className}`}
    >
      <ShieldCheck className="h-3.5 w-3.5" /> Acknowledge &amp; Mark as Read
    </button>
  );
}