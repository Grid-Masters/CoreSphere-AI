import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Award, Sparkles, Trophy, Upload } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard } from "@/components/ui-bits/Card";
import { Leaderboards } from "@/components/mission/Leaderboards";
import { ShiftScheduler } from "@/components/mission/ShiftScheduler";
import { useActiveUser } from "@/lib/active-user";
import { DEPARTMENTS_WITH_STAFF } from "@/lib/leaderboards";
import { champions, departmentalRecognition, spotlightStory, type ChampionCategory } from "@/lib/recognition";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/hall-of-fame")({
  head: () => ({
    meta: [
      { title: "Hall of Excellence — UBA CoreSphere" },
      { name: "description", content: "Celebrate champions of learning, operational readiness and continuous improvement across UBA Customer Fulfilment on CoreSphere." },
      { property: "og:title", content: "Hall of Excellence — UBA CoreSphere" },
      { property: "og:description", content: "Recognition wall, monthly ceremonies and departmental champions across UBA Customer Fulfilment." },
      { property: "og:url", content: "https://ubacoresphere-pulse.lovable.app/hall-of-fame" },
    ],
    links: [{ rel: "canonical", href: "https://ubacoresphere-pulse.lovable.app/hall-of-fame" }],
  }),
  component: HallOfExcellence,
});

const catTone: Record<ChampionCategory, string> = {
  "Learning Excellence": "from-primary/25 to-primary/5",
  "Operational Readiness": "from-[color:var(--success)]/25 to-[color:var(--success)]/5",
  "Continuous Improvement": "from-[color:var(--warning)]/25 to-[color:var(--warning)]/5",
};

type ArchiveRow = { id: string; month: string; category: string; department: string | null; winner_name: string; points: number; citation: string | null };
type PhotoRow = { subject_email: string; category: string; photo_path: string };

function HallOfExcellence() {
  const user = useActiveUser();
  const canManage = user.role === "ld" || user.role === "group_head" || user.role === "sysadmin";
  const showShifts = user.role === "team_lead";
  const dept = user.role === "team_lead" ? user.department : undefined;

  const champs = useMemo(() => champions(), []);
  const deptChampions = useMemo(() => departmentalRecognition(), []);

  const [archives, setArchives] = useState<ArchiveRow[]>([]);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const uploadRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [{ data: arch }, { data: photos }] = await Promise.all([
      supabase.from("recognition_archives").select("id,month,category,department,winner_name,points,citation").order("created_at", { ascending: false }).limit(24),
      supabase.from("recognition_photos").select("subject_email,category,photo_path"),
    ]);
    setArchives((arch as ArchiveRow[]) ?? []);
    const urls: Record<string, string> = {};
    for (const p of ((photos as PhotoRow[]) ?? [])) {
      const { data } = await supabase.storage.from("recognition").createSignedUrl(p.photo_path, 3600);
      if (data?.signedUrl) urls[`${p.category}:${p.subject_email}`] = data.signedUrl;
    }
    setPhotoUrls(urls);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const onUpload = useCallback(async (c: (typeof champs)[number], file: File) => {
    setBusy(c.category);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${c.category.replace(/\s+/g, "-").toLowerCase()}/${c.user.email}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("recognition").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { error: insErr } = await supabase.from("recognition_photos").insert({
        subject_email: c.user.email, category: c.category, photo_path: path, caption: c.user.name,
      });
      if (insErr) throw insErr;
      await load();
    } catch (e) {
      console.error("Recognition photo upload failed", e);
    } finally {
      setBusy(null);
    }
  }, [champs, load]);

  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recognition</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">CoreSphere Hall of Excellence</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Celebrating learning, readiness and continuous improvement across Customer Fulfilment.
        </p>
      </div>

      {/* 3D Recognition Wall */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {champs.map((c) => {
          const url = photoUrls[`${c.category}:${c.user.email}`];
          return (
            <div key={c.category} className={`relative rounded-2xl border p-5 shadow-sm bg-gradient-to-b ${catTone[c.category]} overflow-hidden`}>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.category}</div>
              <div className="mt-4 flex flex-col items-center text-center">
                <div className="relative" style={{ perspective: "600px" }}>
                  <div
                    className="h-28 w-28 rounded-full ring-4 ring-background shadow-xl overflow-hidden flex items-center justify-center bg-primary/15 text-primary text-2xl font-semibold"
                    style={{ transform: "rotateX(6deg)" }}
                  >
                    {url ? (
                      <img src={url} alt={c.user.name} className="h-full w-full object-cover" />
                    ) : (
                      c.user.initials
                    )}
                  </div>
                </div>
                <div className="mt-3 text-base font-semibold">{c.user.name}</div>
                <div className="text-xs text-muted-foreground">{c.user.department} • {c.user.roleLabel.split("•")[0].trim()}</div>
                <div className="mt-1 text-xs font-medium text-primary">{c.metricLabel}</div>
              </div>
              {canManage && (
                <div className="mt-4">
                  <input
                    ref={(el) => { uploadRefs.current[c.category] = el; }}
                    type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) void onUpload(c, f); e.target.value = ""; }}
                  />
                  <button
                    onClick={() => uploadRefs.current[c.category]?.click()}
                    disabled={busy === c.category}
                    className="w-full h-8 rounded-md border text-xs font-medium hover:bg-background/60 flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    <Upload className="h-3.5 w-3.5" /> {busy === c.category ? "Uploading…" : url ? "Replace photo" : "Upload photo"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CoreSphere Spotlight */}
      <PanelCard className="mb-4" title="CoreSphere Spotlight" description="Recognition stories generated from champion performance" action={<Sparkles className="h-4 w-4 text-primary" />}>
        <ul className="space-y-3">
          {champs.map((c) => (
            <li key={c.category} className="rounded-lg border bg-background p-3">
              <div className="text-xs font-semibold text-primary">{c.category} — {c.user.name}</div>
              <p className="text-sm text-muted-foreground mt-1">{spotlightStory(c)}</p>
            </li>
          ))}
        </ul>
      </PanelCard>

      <div className="grid lg:grid-cols-2 gap-4">
        <Leaderboards title="Group Leaderboard" />
        {dept ? <Leaderboards department={dept} /> : <Leaderboards department={DEPARTMENTS_WITH_STAFF[0]} />}
      </div>

      {/* Departmental Recognition incl. sub-units */}
      <PanelCard className="mt-4" title="Departmental Recognition" description="Champions by department and sub-unit" action={<Award className="h-4 w-4 text-muted-foreground" />}>
        <ul className="divide-y -my-2">
          {deptChampions.filter((d) => d.user).map((d) => (
            <li key={`${d.parent ?? ""}-${d.department}`} className={`py-3 flex items-center gap-3 ${d.isSubUnit ? "pl-6" : ""}`}>
              <span className={`text-sm ${d.isSubUnit ? "text-muted-foreground" : "font-medium"}`}>
                {d.isSubUnit ? `↳ ${d.department}` : d.department}
              </span>
              <span className="flex-1 text-sm text-right truncate">{d.user?.name}</span>
              <span className="text-xs text-muted-foreground tabular-nums w-24 text-right">{d.points.toLocaleString()} pts</span>
            </li>
          ))}
        </ul>
      </PanelCard>

      {/* Monthly Recognition Ceremony */}
      <div className="mt-4">
        <MonthlyCeremony archives={archives} canManage={canManage} onChanged={load} />
      </div>

      {showShifts && (
        <div className="mt-4">
          <ShiftScheduler user={user} />
        </div>
      )}
    </AppShell>
  );
}

function MonthlyCeremony({ archives, canManage, onChanged }: { archives: ArchiveRow[]; canManage: boolean; onChanged: () => void }) {
  const [form, setForm] = useState({ month: "", category: "Champion of the Month", department: "", winner_name: "", points: "", citation: "" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.month || !form.winner_name) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("recognition_archives").insert({
        month: form.month, category: form.category, department: form.department || null,
        winner_email: `${form.winner_name.replace(/\s+/g, ".").toLowerCase()}@ubagroup.com`,
        winner_name: form.winner_name, points: Number(form.points) || 0, citation: form.citation || null,
      });
      if (error) throw error;
      setForm({ month: "", category: "Champion of the Month", department: "", winner_name: "", points: "", citation: "" });
      onChanged();
    } catch (e) {
      console.error("Archive save failed", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PanelCard title="Monthly Recognition Ceremony" description="Archived monthly champions" action={<Trophy className="h-4 w-4 text-[color:var(--warning)]" />}>
      {canManage && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
          <input value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} placeholder="Month (e.g. May 2026)" className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
          <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Department (optional)" className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
          <input value={form.winner_name} onChange={(e) => setForm({ ...form, winner_name: e.target.value })} placeholder="Winner name" className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
          <input value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} placeholder="Pulse Points" inputMode="numeric" className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
          <input value={form.citation} onChange={(e) => setForm({ ...form, citation: e.target.value })} placeholder="Citation (optional)" className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
          <button onClick={save} disabled={saving} className="h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 sm:col-span-2 lg:col-span-1">
            {saving ? "Saving…" : "Add to archive"}
          </button>
        </div>
      )}
      {archives.length === 0 ? (
        <p className="text-sm text-muted-foreground">No ceremonies archived yet{canManage ? " — add the first above." : "."}</p>
      ) : (
        <ul className="divide-y -my-2">
          {archives.map((a) => (
            <li key={a.id} className="py-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-28 shrink-0">{a.month}</span>
                <span className="flex-1 text-sm font-medium">{a.winner_name}</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">{a.category}</span>
                <span className="text-xs text-muted-foreground tabular-nums w-20 text-right">{a.points.toLocaleString()} pts</span>
              </div>
              {a.citation && <p className="text-xs text-muted-foreground mt-1 pl-[7.75rem]">{a.citation}</p>}
            </li>
          ))}
        </ul>
      )}
    </PanelCard>
  );
}
