import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveIdentity, type ActiveUser, type IdentityState } from "@/lib/identity";

const LOADING: IdentityState = { status: "loading", user: null };

const IdentityContext = createContext<IdentityState>(LOADING);

/**
 * Module-level snapshot for the few non-React consumers (imperative helpers).
 * It mirrors the provider state and is `null` until an identity is resolved —
 * there is deliberately no default employee.
 */
let _snapshot: ActiveUser | null = null;
export function getActiveUserSnapshot(): ActiveUser | null {
  return _snapshot;
}

export function IdentityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<IdentityState>(LOADING);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      _snapshot = null;
      setState(LOADING); // unauthenticated: the auth gate redirects to /login
      return;
    }
    try {
      const next = await resolveIdentity();
      _snapshot = next.user;
      setState(next);
    } catch (error) {
      _snapshot = null;
      setState({
        status: "error",
        user: null,
        reason: error instanceof Error ? error.message : "Identity resolution failed",
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void refresh();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  return <IdentityContext.Provider value={state}>{children}</IdentityContext.Provider>;
}

export function useIdentity(): IdentityState {
  return useContext(IdentityContext);
}

/** Resolved active user, or `null` while loading / when not provisioned. */
export function useActiveUser(): ActiveUser | null {
  return useContext(IdentityContext).user;
}

/**
 * For components that are only ever mounted inside the resolved application
 * shell (AppShell gates on identity state before rendering them).
 */
export function useResolvedUser(): ActiveUser {
  const user = useContext(IdentityContext).user;
  if (!user) throw new Error("useResolvedUser used outside a resolved identity boundary");
  return user;
}
