import logoMark from "@/assets/uba-logo.png";
import logoWordmark from "@/assets/uba-wordmark.png";

type Variant = "mark" | "wordmark" | "wordmark-mono";

type Props = {
  variant?: Variant;
  size?: number;
  className?: string;
  ariaLabel?: string;
  /** When true, applies a subtle white plate behind a wordmark on dark surfaces. */
  onDark?: boolean;
};

/**
 * UBA brand mark — single source of truth for the official UBA enterprise logo.
 * Use across login, sidebar, top bar, certificates, watermarks, etc.
 */
export function UbaLogo({ variant = "mark", size = 36, className = "", ariaLabel = "United Bank for Africa", onDark = false }: Props) {
  if (variant === "mark") {
    return (
      <img
        src={logoMark}
        alt={ariaLabel}
        width={size}
        height={size}
        className={`object-contain shrink-0 ${className}`}
        loading="lazy"
        decoding="async"
      />
    );
  }

  // wordmark — landscape lockup
  const h = size;
  return (
    <span
      className={`inline-flex items-center justify-center ${onDark ? "bg-white rounded-md px-1.5 py-1" : ""} ${className}`}
      style={{ height: onDark ? h + 8 : h }}
      aria-label={ariaLabel}
    >
      <img
        src={logoWordmark}
        alt={ariaLabel}
        height={h}
        style={{ height: h, width: "auto" }}
        className="object-contain"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}