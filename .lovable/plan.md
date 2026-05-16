# Goal
1. Add a dedicated "Bank Products & News" section to the dashboard (`/`) showcasing rotating promotional cards (product ads + bank news).
2. Add a small, persistent ticker bar pinned across every page that scrolls (rolls in/out) the user's pending activities, upcoming deadlines, and fresh announcements — with the source/author shown.

## Changes

### 1. Mock data — `src/lib/mock-data.ts`
Add two new exports (no business logic changes elsewhere):
- `bankPromotions`: array of `{ id, title, tagline, category ("Product" | "News" | "Campaign"), cta, accent }` — e.g. UBA LEO, Wema-style loans, NextGen account, "UBA wins Best Digital Bank 2026", etc.
- `tickerItems`: derived/static array of `{ id, kind ("deadline" | "assessment" | "memo" | "announcement"), text, from, due? }` — sourced from existing `memos`, `announcements`, and a couple of assessment deadlines.

### 2. New component — `src/components/PromotionsStrip.tsx`
- Horizontal scroll-snap carousel of 4–6 promo cards using `PanelCard` styling conventions.
- Each card: small category chip, title, one-line tagline, subtle gradient accent on the side, a "Learn more" link.
- Auto-advance every ~6s with pause-on-hover; manual prev/next chevrons; dots indicator.
- Uses semantic tokens only (`bg-card`, `text-primary`, `--gradient-primary` if defined, otherwise inline `from-primary to-primary/70`).

### 3. New component — `src/components/layout/ActivityTicker.tsx`
- Slim bar, height ~32px (`h-8`), full-width, sits directly under `TopBar` so it stays visible on every route (sticky).
- Left side: small pulsing dot + label "Live" / icon (`Bell` from lucide).
- Middle: a single `<div>` of items that animates with a CSS keyframe `marquee` (translateX from 100% → -100%) on a duplicated list for seamless looping. Pause on hover.
- Each item: kind icon + text + " — from {from}" + optional "(due {due})" — separated by a subtle vertical divider.
- Click on an item routes to the relevant page (`/memos`, `/assessments`, `/leadership`).
- Respects `prefers-reduced-motion` (falls back to a fade rotator).

### 4. Wire ticker into the shell — `src/components/layout/AppShell.tsx`
- Import `ActivityTicker` and render it between `<TopBar />` and `<main>` so it appears on every route (dashboard, knowledge hub, assessments, etc.).
- No layout-math changes; ticker is part of the normal flex column.

### 5. Add the promotions strip to the dashboard — `src/routes/index.tsx`
- Insert a new section titled "Products & News from UBA" between the existing `champions` grid and the "Recent Learning Activity" grid (creates the requested visual gap and a clear promotional zone).
- Renders `<PromotionsStrip />`.

### 6. Animation keyframes — `src/styles.css`
- Add `@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }` and a `.animate-marquee` utility (`animation: marquee 40s linear infinite`).
- Add `.animate-marquee:hover { animation-play-state: paused; }`.
- Add reduced-motion override that disables the marquee.

## Out of scope
- No backend, no real promotions CMS — all content is mock data.
- No changes to sidebar/topbar collapse behavior.
- No new routes; ticker items deep-link to existing routes only.

## Technical notes
- Marquee uses a duplicated child trick (`<div className="flex gap-8 animate-marquee"><Items/><Items aria-hidden/></div>`) for seamless loop without JS.
- Auto-advancing carousel uses `useEffect` + `setInterval`; cleans up on unmount; pauses when `document.hidden`.
- All colors via tokens (`bg-card`, `border`, `text-primary`, `text-muted-foreground`, `bg-primary/10`).
- Icons: `Sparkles`, `Newspaper`, `Tag`, `Bell`, `Clock`, `ChevronLeft`, `ChevronRight` (all already in `lucide-react`).
