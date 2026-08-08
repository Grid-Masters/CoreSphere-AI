import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { UbaLogo } from "@/components/brand/UbaLogo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/mfa")({
  head: () => ({
    meta: [
      { title: "Additional verification required — CoreSphere AI" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content:
          "Hard-token verification is required to sign in from outside the UBA network.",
      },
    ],
  }),
  component: MfaPage,
});

/**
 * FAIL-CLOSED external-network gate.
 *
 * UBA hard tokens emit an 8-digit rolling code that can only be validated by
 * the bank's token-verification service. That integration does not exist in
 * this environment, so no code entry form is presented — a form that cannot
 * genuinely verify possession would be security theatre.
 */
function MfaPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/login", replace: true });
    });
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <UbaLogo variant="mark" size={36} />
          <div className="text-base font-semibold">CoreSphere AI</div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-destructive" /> Additional verification required
        </h1>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          You are signing in from outside the trusted UBA network. Access from an
          external network requires verification with your UBA hard-token
          secure-pass device (8-digit code).
        </p>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Hard-token verification cannot be completed in this environment because
          the bank token-verification service is not connected. Please sign in
          from the internal UBA network, or contact IT Support to arrange
          approved remote access.
        </p>
        <button
          onClick={signOut}
          className="mt-8 inline-flex items-center justify-center h-10 px-4 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent"
        >
          Return to sign in
        </button>
        <div className="mt-6 text-[11px] text-muted-foreground">
          All access attempts are logged.
        </div>
      </div>
    </div>
  );
}
