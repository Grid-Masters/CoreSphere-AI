import { useEffect, useState } from "react";

/**
 * Returns true after the first client render. Use to gate any UI whose
 * shape depends on `localStorage` or other browser-only state, so the SSR
 * markup matches the initial client render and React doesn't bail on
 * hydration.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}