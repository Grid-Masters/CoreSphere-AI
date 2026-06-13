import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Client-only auth gate backed by a real Supabase session. Redirects to
 * /login when no authenticated session exists. Runs in `useEffect` so SSR
 * markup is unaffected, and also reacts to sign-out events.
 */
export function useAuthGate() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (path === "/login") return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && !data.session) navigate({ to: "/login", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate({ to: "/login", replace: true });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate, path]);
}