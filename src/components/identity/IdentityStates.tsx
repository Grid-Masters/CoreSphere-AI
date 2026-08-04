import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";

export function IdentityLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div
        className="h-8 w-8 rounded-full border-2 border-muted border-t-primary animate-spin"
        role="status"
        aria-label="Loading your workspace"
      />
    </div>
  );
}

export function AccessNotProvisioned() {
  const navigate = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Access not provisioned. Contact the platform administrator.
        </h1>
        <button
          onClick={signOut}
          className="mt-6 inline-flex items-center justify-center h-10 px-4 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export function IdentityError({ reason }: { reason: string }) {
  const navigate = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          We couldn't verify your workspace access
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{reason}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            Try again
          </button>
          <button
            onClick={signOut}
            className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
