/**
 * Deprecated (Batch 3). Route protection now lives in the `_authenticated`
 * pathless layout (`src/routes/_authenticated/route.tsx`), which validates a
 * real Supabase session plus server-derived session assurance. No browser
 * flag (sessionStorage/localStorage) may ever grant access.
 */
export function useAuthGate() {
  /* intentionally empty — see module docs */
}
