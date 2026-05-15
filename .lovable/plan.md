## Goal

1. Track Theory progress and Video progress separately per SOP (today there's one combined `progress`).
2. Update video watch progress automatically as the user plays the lecture (counts as "complete" once ≥ 90% watched).
3. Refine the Knowledge Hub thumbnails: keep the category filter, and add a soft drop shadow beneath each thumbnail card so they lift off the page.

## Changes

### 1. Data model — `src/lib/mock-data.ts`
- Replace `SOP.progress` with `theoryProgress` and `videoProgress` (0–100).
- Seed sensible mock values for each SOP (e.g. theory 70 / video 40).
- Add a small helper `overallProgress(sop) = round((theory + video) / 2)` for places that still want a single number (dashboard widgets, hub card).

### 2. Persisted video progress — new `src/lib/video-progress.ts`
- Lightweight `localStorage`-backed store: `getVideoProgress(sopId)`, `setVideoProgress(sopId, pct)`.
- Keyed by `uba.coresphere.video-progress.v1`. Pure client, no backend.
- Exported hook `useVideoProgress(sopId, fallback)` returning `[progress, setProgress]` with effect-based persistence.

### 3. Knowledge Hub list — `src/routes/knowledge-hub.index.tsx`
- Show two slim progress bars on each card: **Theory** and **Video** (each labelled, with %).
- Video % reads from `useVideoProgress(sop.id, sop.videoProgress)` so freshly watched videos reflect immediately.
- Add a shadow under each thumbnail card: replace `shadow-sm hover:shadow-lg` with `shadow-md hover:shadow-xl shadow-black/5` plus a subtle ground shadow (`after:` pseudo or wrapping div with `bg-foreground/5 blur-md` offset below). Keep existing category filter chips untouched.

### 4. SOP detail — `src/routes/knowledge-hub.$sopId.tsx`
- Header progress widget becomes two stacked bars (Theory %, Video %) plus the combined number.
- **Theory tab**: "Mark section complete" sets theory progress to 100 (local state via the same store under a `theory-progress` key — mirrors video store).
- **Video tab**: in `onTimeUpdate`, compute `pct = currentTime / duration * 100`, only update store when it increases by ≥ 1% to avoid thrash, and clamp to 100. When `pct ≥ 90`, mark video as complete (store value 100) and show a small "Lecture completed" badge near the controls.
- Show a "Resume from mm:ss" hint when stored progress > 5% and < 95% on mount; clicking it seeks the video.

### 5. Anywhere else referencing `sop.progress`
- Dashboard / score-buddy / etc.: swap to `overallProgress(sop)` helper. Quick grep + targeted edits only.

## Technical notes

- All persistence is `localStorage` only — fits the existing mock-data architecture; no Cloud changes.
- Shadow styling uses Tailwind utilities + design tokens (`shadow-black/5`) — no new CSS variables required.
- `useVideoProgress` writes are throttled by the ≥1% delta check; `useEffect` cleanup not needed because writes are synchronous.
- Type updates to `SOP` are non-breaking once all consumers are migrated in the same change.

## Out of scope

- Server-side persistence of progress.
- Analytics events / audit logging of completions.
- Changes to the secure video player chrome (controls, watermark) beyond the new completion badge and resume hint.