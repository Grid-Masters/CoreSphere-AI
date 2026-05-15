import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — UBA CoreSphere" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <aside className="hidden lg:flex flex-col justify-between p-12 bg-sidebar text-sidebar-foreground relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-10 bottom-10 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <img src="/assets/uba-logo.png" alt="UBA" className="h-10 w-10" width={40} height={40} />
          <div>
            <div className="text-base font-semibold">UBA CoreSphere</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/60">
              Workforce Operations OS
            </div>
          </div>
        </div>
        <div className="relative max-w-md">
          <div className="text-xs uppercase tracking-[0.2em] text-sidebar-foreground/60">
            Intelligent Workforce Operations
          </div>
          <h2 className="text-3xl font-semibold mt-3 leading-tight">
            One operational ecosystem for the United Bank for Africa workforce.
          </h2>
          <p className="text-sm text-sidebar-foreground/70 mt-4 leading-relaxed">
            Knowledge, learning, QA, leadership communication and AI assistance — secured,
            audited, and built for banking-grade operations.
          </p>
        </div>
        <div className="relative text-[11px] text-sidebar-foreground/60 flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5" /> Restricted system. Internal Banking Use Only.
        </div>
      </aside>
      <main className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/" });
          }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/assets/uba-logo.png" alt="UBA" className="h-9 w-9" width={36} height={36} />
            <div className="text-base font-semibold">UBA CoreSphere</div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Use your UBA enterprise credentials to continue.
          </p>
          <div className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Corporate email</label>
              <div className="mt-1 relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="firstname.lastname@ubagroup.com"
                  className="w-full h-11 pl-10 pr-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <div className="mt-1 relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded border-input" /> Remember this device
              </label>
              <a href="#" className="text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full h-11 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 inline-flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-8 pt-6 border-t text-[11px] text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            All access is logged. Misuse is subject to UBA InfoSec Policy.
          </div>
        </form>
      </main>
    </div>
  );
}