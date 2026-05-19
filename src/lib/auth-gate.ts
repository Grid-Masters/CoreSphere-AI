import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

const KEY = "coresphere.authed";

export function isAuthed(): boolean {
  if (typeof window === "undefined") return true; // SSR pass-through
  return window.localStorage.getItem(KEY) === "1";
}

export function markAuthed() {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, "1");
}

export function clearAuth() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}

/**
 * Client-only auth gate. Redirects to /login when no auth flag is present.
 * Intentionally runs in `useEffect` so SSR markup is unaffected.
 */
export function useAuthGate() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (path === "/login") return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(KEY) !== "1") {
      navigate({ to: "/login", replace: true });
    }
  }, [navigate, path]);
}