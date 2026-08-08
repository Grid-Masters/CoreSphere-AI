import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Protected route boundary (Batch 3).
 *
 * `ssr: false` because the Supabase session lives in browser storage — the
 * server cannot read it, so no protected screen is ever server-rendered.
 * Data remains protected server-side by RLS and by `requireSupabaseAuth`
 * on every privileged server function; this gate is the navigation boundary.
 */
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });

    // Server-derived session assurance — never a browser flag.
    const { getSessionAssurance } = await import("@/lib/session-assurance.functions");
    let assurance;
    try {
      assurance = await getSessionAssurance();
    } catch {
      throw redirect({ to: "/login" });
    }
    if (!assurance.authenticated || !assurance.session_valid) {
      await supabase.auth.signOut();
      throw redirect({ to: "/login" });
    }
    if (assurance.mfa_required && !assurance.mfa_verified) {
      throw redirect({ to: "/mfa" });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});
