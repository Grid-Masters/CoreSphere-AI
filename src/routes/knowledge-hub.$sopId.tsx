import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Clock,
  ListChecks,
  GitBranch,
  MessageSquare,
  CheckCircle2,
  Volume2,
  VolumeX,
  Maximize2,
  BookOpen,
  PlayCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard, ProgressBar, StatusBadge } from "@/components/ui-bits/Card";
import { sops, currentUser, overallProgress } from "@/lib/mock-data";
import { useTheoryProgress, useVideoProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/knowledge-hub/$sopId")({
  head: ({ params }) => ({
    meta: [{ title: `${params.sopId} — UBA CoreSphere` }],
  }),
  component: SopDetail,
  notFoundComponent: () => (
    <AppShell>
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold">SOP not found</h2>
        <Link to="/knowledge-hub" className="text-primary text-sm hover:underline mt-2 inline-block">
          Back to Knowledge Hub
        </Link>
      </div>
    </AppShell>
  ),
  loader: ({ params }) => {
    const s = sops.find((x) => x.id === params.sopId);
    if (!s) throw notFound();
    return s;
  },
});

function SopDetail() {
  const sop = Route.useLoaderData();
  const [tab, setTab] = useState<"theory" | "video">("theory");
  const [theoryPct, setTheoryPct] = useTheoryProgress(sop.id, sop.theoryProgress);
  const [videoPct] = useVideoProgress(sop.id, sop.videoProgress);
  const overall = overallProgress({ theoryProgress: theoryPct, videoProgress: videoPct });

  return (
    <AppShell>
      <Link
        to="/knowledge-hub"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Knowledge Hub
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {sop.category} • {sop.department}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">{sop.title}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{sop.summary}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <StatusBadge status={sop.status} />
            <span className="text-[11px] text-muted-foreground">Updated {sop.updated}</span>
            <span className="text-[11px] text-muted-foreground">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" /> View-only
            </span>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4 min-w-[220px]">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Overall progress
          </div>
          <div className="text-2xl font-semibold mt-1 tabular-nums">{overall}%</div>
          <div className="mt-3 space-y-2">
            <div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground inline-flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> Theory
                </span>
                <span className="tabular-nums font-medium">{theoryPct}%</span>
              </div>
              <ProgressBar value={theoryPct} tone="success" />
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground inline-flex items-center gap-1">
                  <PlayCircle className="h-3 w-3" /> Video
                </span>
                <span className="tabular-nums font-medium">{videoPct}%</span>
              </div>
              <ProgressBar value={videoPct} tone="primary" />
            </div>
          </div>
          <button
            onClick={() => setTheoryPct(100)}
            disabled={theoryPct >= 100}
            className="mt-3 w-full h-9 text-sm rounded-md bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="h-4 w-4" />
            {theoryPct >= 100 ? "Theory complete" : "Mark theory complete"}
          </button>
        </div>
      </div>

      <div className="mt-6 border-b flex gap-1">
        {(
          [
            { id: "theory" as const, label: "Theory Guide" },
            { id: "video" as const, label: "Video Lecture" },
          ]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 h-10 text-sm border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? "border-primary text-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "theory" ? <TheoryTab /> : <VideoTab sopId={sop.id} title={sop.title} fallback={sop.videoProgress} />}
    </AppShell>
  );
}

function TheoryTab() {
  return (
    <div className="grid lg:grid-cols-3 gap-4 mt-6">
      <div className="lg:col-span-2 space-y-4">
        <PanelCard title="Process Overview">
          <div className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground/90">
            <p>
              This SOP defines the end-to-end process, control points, and escalation paths required
              to operate within UBA's enterprise risk and customer experience standards. All
              activities must be logged, time-stamped, and traceable to an authorised operator.
            </p>
            <p>
              Operators are required to validate customer identity using the approved 3-step
              verification before initiating any account-impacting action. Deviations require Team
              Lead authorisation and must be captured in the daily exception log.
            </p>
          </div>
        </PanelCard>

        <PanelCard title="Process Flow" action={<GitBranch className="h-4 w-4 text-muted-foreground" />}>
          <ol className="space-y-3">
            {[
              "Authenticate caller using 3-step verification",
              "Capture intent and classify into approved category",
              "Action request within authorised limits",
              "Document outcome in core system + audit log",
              "Acknowledge customer with reference number",
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                  {i + 1}
                </div>
                <div className="text-sm pt-1">{step}</div>
              </li>
            ))}
          </ol>
        </PanelCard>

        <PanelCard title="Recommended Scripts" action={<MessageSquare className="h-4 w-4 text-muted-foreground" />}>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-md bg-muted/50 border border-dashed">
              "Thank you for calling UBA. May I please confirm your full name and account number for
              verification?"
            </div>
            <div className="p-3 rounded-md bg-muted/50 border border-dashed">
              "I understand your concern. To resolve this securely, I'll be initiating a card block
              right away. You'll receive an SMS confirmation within 60 seconds."
            </div>
          </div>
        </PanelCard>
      </div>

      <div className="space-y-4">
        <PanelCard title="Escalation Path" action={<AlertTriangle className="h-4 w-4 text-[color:var(--warning)]" />}>
          <ol className="space-y-2 text-sm">
            <li className="flex justify-between"><span>L1 — Team Lead</span><span className="text-muted-foreground">5 min</span></li>
            <li className="flex justify-between"><span>L2 — Supervisor</span><span className="text-muted-foreground">15 min</span></li>
            <li className="flex justify-between"><span>L3 — Unit Head</span><span className="text-muted-foreground">1 hr</span></li>
            <li className="flex justify-between"><span>L4 — Group Head</span><span className="text-muted-foreground">4 hr</span></li>
          </ol>
        </PanelCard>

        <PanelCard title="SLA Timelines" action={<Clock className="h-4 w-4 text-muted-foreground" />}>
          <ul className="text-sm space-y-2">
            <li className="flex justify-between"><span>First response</span><span className="font-medium tabular-nums">≤ 30s</span></li>
            <li className="flex justify-between"><span>Resolution (Tier 1)</span><span className="font-medium tabular-nums">≤ 5 min</span></li>
            <li className="flex justify-between"><span>Resolution (Tier 2)</span><span className="font-medium tabular-nums">≤ 4 hrs</span></li>
            <li className="flex justify-between"><span>Customer follow-up</span><span className="font-medium tabular-nums">≤ 24 hrs</span></li>
          </ul>
        </PanelCard>

        <PanelCard title="Compliance Notes" action={<ShieldCheck className="h-4 w-4 text-[color:var(--success)]" />}>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li className="flex gap-2"><ListChecks className="h-4 w-4 mt-0.5 text-foreground" />CBN consumer protection guidelines apply.</li>
            <li className="flex gap-2"><ListChecks className="h-4 w-4 mt-0.5 text-foreground" />Never request full PIN or OTP from customer.</li>
            <li className="flex gap-2"><ListChecks className="h-4 w-4 mt-0.5 text-foreground" />Audit trail mandatory; retain 7 years.</li>
          </ul>
        </PanelCard>
      </div>
    </div>
  );
}

function VideoTab({ sopId, title, fallback }: { sopId: string; title: string; fallback: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [videoPct, setVideoPct] = useVideoProgress(sopId, fallback);
  const lastWriteRef = useRef(0);
  const resumeOfferedRef = useRef(false);
  const [resumeAt, setResumeAt] = useState<number | null>(null);

  // Block right-click & common shortcuts (best-effort)
  useEffect(() => {
    const block = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["s", "u", "p"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", block);
    return () => window.removeEventListener("keydown", block);
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "00:00";
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const r = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${r}`;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4 mt-6">
      <div className="lg:col-span-2">
        <div
          className="relative rounded-xl overflow-hidden border bg-black aspect-video group select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
            preload="metadata"
            playsInline
            controlsList="nodownload noremoteplayback noplaybackrate"
            disablePictureInPicture
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onLoadedMetadata={(e) => {
              const d = e.currentTarget.duration;
              setDuration(d);
              if (!resumeOfferedRef.current && videoPct > 5 && videoPct < 95 && isFinite(d)) {
                setResumeAt((videoPct / 100) * d);
                resumeOfferedRef.current = true;
              }
            }}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              setCurrent(v.currentTime);
              const pct = v.duration ? (v.currentTime / v.duration) * 100 : 0;
              setProgress(pct);
              if (pct - lastWriteRef.current >= 1 || pct >= 90) {
                lastWriteRef.current = pct;
                setVideoPct(pct >= 90 ? 100 : pct);
              }
            }}
            onEnded={() => setVideoPct(100)}
          />

          {/* Center play overlay */}
          {!playing && (
            <button
              onClick={toggle}
              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] z-20"
            >
              <span className="h-16 w-16 rounded-full bg-white/95 text-primary flex items-center justify-center hover:scale-105 transition-transform shadow-2xl">
                <Play className="h-7 w-7 fill-current" />
              </span>
            </button>
          )}

          {/* Tags */}
          <div className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-wider bg-black/60 text-white px-2 py-1 rounded backdrop-blur inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Secure Stream
          </div>
          <div className="absolute top-3 right-3 z-10 text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-1 rounded font-semibold">
            Internal Use Only
          </div>
          {videoPct >= 100 && (
            <div className="absolute top-12 right-3 z-20 text-[10px] uppercase tracking-wider bg-[color:var(--success)] text-white px-2 py-1 rounded font-semibold inline-flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Lecture Completed
            </div>
          )}

          {/* Repeating watermark grid (forensic) */}
          <div
            aria-hidden
            className="absolute inset-0 z-10 pointer-events-none overflow-hidden text-white/10 select-none"
          >
            <div className="absolute inset-[-25%] grid grid-cols-3 gap-10 rotate-[-22deg] text-[11px] font-semibold tracking-widest">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className="whitespace-nowrap">
                  UBA • {currentUser.email} • {new Date().toISOString().slice(0, 10)}
                </span>
              ))}
            </div>
          </div>

          {/* Custom controls */}
          <div className="absolute bottom-0 inset-x-0 z-20 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={toggle}
                className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              </button>
              <button
                onClick={() => {
                  const v = videoRef.current;
                  if (!v) return;
                  v.muted = !v.muted;
                  setMuted(v.muted);
                }}
                className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <div className="text-[11px] tabular-nums text-white/80">
                {fmt(current)} / {fmt(duration)}
              </div>
              <div className="ml-auto text-[11px] font-medium truncate max-w-[40%]">{title}</div>
              <button
                onClick={() => videoRef.current?.requestFullscreen?.()}
                className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
            <div
              className="h-1 w-full rounded-full bg-white/20 overflow-hidden cursor-pointer"
              onClick={(e) => {
                const v = videoRef.current;
                if (!v || !duration) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                v.currentTime = pct * duration;
              }}
            >
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        {resumeAt !== null && (
          <button
            onClick={() => {
              const v = videoRef.current;
              if (v && resumeAt !== null) {
                v.currentTime = resumeAt;
                v.play();
              }
              setResumeAt(null);
            }}
            className="mt-3 w-full text-xs h-9 rounded-md border border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 inline-flex items-center justify-center gap-2"
          >
            <Play className="h-3.5 w-3.5 fill-current" /> Resume from {fmt(resumeAt)}
          </button>
        )}
        <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Lock className="h-3 w-3" /> Download, screen recording, and sharing are disabled by
            policy.
          </span>
          <span className="tabular-nums">Watched: {videoPct}%</span>
        </div>
      </div>
      <div className="space-y-4">
        <PanelCard title="Trainer">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
              OA
            </div>
            <div>
              <div className="text-sm font-medium">Olamide Akande</div>
              <div className="text-[11px] text-muted-foreground">Senior L&D Facilitator</div>
            </div>
          </div>
        </PanelCard>
        <PanelCard title="Timestamps">
          <ul className="text-sm space-y-2">
            {[
              ["00:00", "Introduction & objectives"],
              ["03:12", "Verification process"],
              ["08:45", "Decision tree walkthrough"],
              ["15:20", "Common exceptions"],
              ["20:10", "Q&A and recap"],
            ].map(([t, l]) => (
              <li key={t} className="flex gap-3">
                <span className="text-primary font-medium tabular-nums">{t}</span>
                <span className="text-muted-foreground">{l}</span>
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>
    </div>
  );
}