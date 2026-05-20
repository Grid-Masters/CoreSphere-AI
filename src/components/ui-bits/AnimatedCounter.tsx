import { useEffect, useRef, useState } from "react";

/**
 * Lightweight count-up. Respects prefers-reduced-motion.
 */
export function AnimatedCounter({
  value,
  duration = 900,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}