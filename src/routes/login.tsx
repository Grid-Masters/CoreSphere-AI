import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { UbaLogo } from "@/components/brand/UbaLogo";
import { findByEmail } from "@/lib/directory";
import { demoProfiles } from "@/lib/demo-profiles";
import { supabase } from "@/integrations/supabase/client";
import { quotes } from "@/lib/quotes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ops1 from "@/assets/login/ops-1.jpg";
import ops2 from "@/assets/login/ops-2.jpg";
import ops3 from "@/assets/login/ops-3.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — UBA CoreSphere" },
      { name: "description", content: "Sign in to CoreSphere AI with your UBA enterprise credentials to access operations intelligence and knowledge tools." },
      { property: "og:title", content: "Sign in — UBA CoreSphere" },
      { property: "og:description", content: "Sign in to CoreSphere AI with your UBA enterprise credentials to access operations intelligence and knowledge tools." },
      { property: "og:url", content: "https://ubacoresphere-pulse.lovable.app/login" },
    ],
    links: [{ rel: "canonical", href: "https://ubacoresphere-pulse.lovable.app/login" }],
  }),
  component: LoginPage,
});

// Shared password for the internally provisioned UBA directory accounts.
const DEMO_PASSWORD = "CoreSphere#2026";

const slides = [
  {
    img: ops1,
    title: "Operational intelligence, in real time",
    body: "Monitor service performance, QA quality and compliance health from one command center.",
  },
  {
    img: ops2,
    title: "Banking-grade security & governance",
    body: "Every action audited. Every policy enforced. Built for UBA enterprise operations.",
  },
  {
    img: ops3,
    title: "One workforce, fully aligned",
    body: "Knowledge, learning, coaching and leadership communication — unified for the whole team.",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [quote, setQuote] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setQuote((q) => (q + 1) % quotes.length), 6500);
    return () => clearInterval(t);
  }, []);

  async function signIn(targetEmail: string, targetPassword: string) {
    setError("");
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: targetEmail.trim(),
      password: targetPassword,
    });
    setBusy(false);
    if (signInError) {
      setError("Invalid credentials. Check your enterprise email and password.");
      return;
    }
    navigate({ to: "/" });
  }

  function signInDemo(targetEmail: string) {
    void signIn(targetEmail, DEMO_PASSWORD);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — rotating banking operations imagery */}
      <aside className="hidden lg:block relative overflow-hidden bg-sidebar">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === slide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={s.img}
              alt=""
              width={1024}
              height={1280}
              loading={i === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/70 to-sidebar/20" />
          </div>
        ))}

        <div className="relative h-full flex flex-col justify-between p-12 text-sidebar-foreground">
          <div className="flex items-center gap-3">
            <UbaLogo variant="mark" size={44} />
            <div>
              <div className="text-base font-semibold">CoreSphere AI</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/70">
                Enterprise Operations Intelligence
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <div className="text-xs uppercase tracking-[0.2em] text-primary">
              UBA Operations Command Center
            </div>
            <h2 className="text-3xl font-semibold mt-3 leading-tight min-h-[5rem]">
              {slides[slide].title}
            </h2>
            <p className="text-sm text-sidebar-foreground/80 mt-3 leading-relaxed min-h-[3rem]">
              {slides[slide].body}
            </p>
            <div className="flex items-center gap-2 mt-6">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === slide ? "w-8 bg-primary" : "w-3 bg-sidebar-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-[11px] text-sidebar-foreground/70 flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5" /> Restricted system. Internal Banking Use Only.
          </div>
        </div>
      </aside>

      {/* Right — premium login panel */}
      <main className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signIn(email);
          }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <UbaLogo variant="mark" size={36} />
            <div className="text-base font-semibold">CoreSphere AI</div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in to CoreSphere AI</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in with your UBA enterprise credentials to continue.
          </p>
          <div className="mt-8 space-y-4">
            <div>
              <label htmlFor="login-email" className="text-xs font-medium text-muted-foreground">Corporate email</label>
              <div className="mt-1 relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="login-email"
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
              <label htmlFor="login-password" className="text-xs font-medium text-muted-foreground">Password</label>
              <div className="mt-1 relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
            </div>
            {error && <div className="text-xs text-destructive">{error}</div>}
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

            {/* Rotating professional motivational quote */}
            <blockquote
              key={quote}
              className="text-center text-xs italic text-muted-foreground animate-fade-in min-h-[2.5rem] flex items-center justify-center px-2"
            >
              “{quotes[quote]}”
            </blockquote>

            {/* Discreet demo access */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="text-[11px] text-muted-foreground/70 hover:text-primary transition-colors underline underline-offset-2"
              >
                Demo Access — preview a role
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-[11px] text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            All access is logged. Misuse is subject to UBA InfoSec Policy.
          </div>
        </form>
      </main>

      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Demo Access
            </DialogTitle>
            <DialogDescription>
              Instantly preview CoreSphere from any role. Identity and permissions are
              resolved from the simulated UBA directory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {demoProfiles.map((p) => {
              const entry = findByEmail(p.email);
              return (
                <button
                  key={p.email}
                  onClick={() => signIn(p.email)}
                  className="flex items-center gap-3 rounded-md border bg-card hover:bg-muted transition-colors px-3 py-2.5 text-left"
                >
                  <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">
                    {entry?.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{p.label}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {entry?.name} • {entry?.department}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
