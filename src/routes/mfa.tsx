import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, KeyRound, ArrowRight } from "lucide-react";
import { UbaLogo } from "@/components/brand/UbaLogo";
import { supabase } from "@/integrations/supabase/client";
import { verifyHardToken, logAuditEvent } from "@/lib/platform-foundation.functions";

export const Route = createFileRoute("/mfa")({
  head: () => ({
    meta: [
      { title: "Verify your hard-token — UBA CoreSphere" },
      { name: "description", content: "Additional verification is required to complete sign-in from outside the UBA network." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MfaPage,
});

function MfaPage() {
  const navigate = useNavigate();
  const verify = useServerFn(verifyHardToken);
  const audit = useServerFn(logAuditEvent);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If the user hasn't authenticated yet, kick back to login.
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/login", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code shown on your hard token.");
      return;
    }
    const session_id = sessionStorage.getItem("coresphere:sid") ?? "";
    if (!session_id) {
      setError("Sign-in session expired. Please sign in again.");
      return;
    }
    setBusy(true);
    try {
      const res = await verify({ data: { code, session_id } });
      if (!res.ok) {
        setBusy(false);
        setError("No active hard token is registered for your account. Contact IT Support.");
        await audit({ data: {
          event_type: "mfa_failed", outcome: "failure",
          action: "Hard-token verification rejected",
          network_classification: "external",
          session_id,
        }}).catch(() => {});
        return;
      }
      await audit({ data: {
        event_type: "mfa_verified", outcome: "success",
        action: "Hard-token verification succeeded",
        network_classification: "external",
        session_id,
      }}).catch(() => {});
      sessionStorage.setItem("coresphere:mfa", "1");
      sessionStorage.setItem("coresphere:justSignedIn", "1");
      navigate({ to: "/" });
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Verification failed. Try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <UbaLogo variant="mark" size={36} />
          <div className="text-base font-semibold">CoreSphere AI</div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" /> Verify your hard token
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Additional verification is required because you are signing in from outside
          the trusted UBA network. Enter the 6-digit code displayed on your UBA hard-token
          secure-pass device.
        </p>
        <div className="mt-8">
          <label htmlFor="mfa-code" className="text-xs font-medium text-muted-foreground">
            Hard-token code
          </label>
          <div className="mt-1 relative">
            <KeyRound className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              id="mfa-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              className="w-full h-11 pl-10 pr-3 rounded-md border border-input bg-background text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
        </div>
        {error && <div className="text-xs text-destructive mt-3">{error}</div>}
        <button
          type="submit"
          disabled={busy}
          className="w-full h-11 mt-6 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {busy ? "Verifying…" : "Verify & continue"} <ArrowRight className="h-4 w-4" />
        </button>
        <div className="mt-6 text-[11px] text-muted-foreground flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          All verification attempts are logged.
        </div>
      </form>
    </div>
  );
}