import { useEffect, useSyncExternalStore } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Favorites (pinned pages) + Recently Used items + Notification read state.
// All personalization stored per-browser in localStorage — governance,
// security and mandatory notices are never affected.
// ─────────────────────────────────────────────────────────────────────────────

export type FavoriteEntry = { path: string; label: string; addedAt: number };
export type RecentEntry = { path: string; label: string; visitedAt: number };

const FAV_KEY = "coresphere.favorites.v1";
const RECENT_KEY = "coresphere.recent.v1";
const NOTIF_READ_KEY = "coresphere.notif.read.v1";
const NOTIF_PREFS_KEY = "coresphere.notif.prefs.v1";
const WIDGET_KEY = "coresphere.widgets.v1";

/**
 * Parsed snapshots are memoized per key so `useSyncExternalStore` receives a
 * referentially stable value between store notifications. Re-parsing on every
 * getSnapshot call returns a fresh object each render and sends React into an
 * infinite update loop.
 */
const _cache = new Map<string, { raw: string | null; value: unknown }>();

function invalidate(key: string) {
  _cache.delete(key);
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return fallback;
  }
  const hit = _cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: T = fallback;
  try {
    if (raw) value = JSON.parse(raw) as T;
  } catch {
    value = fallback;
  }
  _cache.set(key, { raw, value });
  return value;
}
function writeJSON(key: string, val: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* ignore quota */
  }
  invalidate(key);
  window.dispatchEvent(new CustomEvent("coresphere:prefs", { detail: key }));
}

function subscribeFactory(key: string) {
  return (cb: () => void) => {
    const listener = (e: Event) => {
      if ((e as CustomEvent).detail === key || (e as StorageEvent).key === key) {
        invalidate(key);
        cb();
      }
    };
    window.addEventListener("coresphere:prefs", listener);
    window.addEventListener("storage", listener);
    return () => {
      window.removeEventListener("coresphere:prefs", listener);
      window.removeEventListener("storage", listener);
    };
  };
}

// ── Favorites ────────────────────────────────────────────────────────────────
export function getFavorites(): FavoriteEntry[] {
  return readJSON<FavoriteEntry[]>(FAV_KEY, []);
}
export function toggleFavorite(path: string, label: string) {
  const list = getFavorites();
  const exists = list.find((f) => f.path === path);
  const next = exists
    ? list.filter((f) => f.path !== path)
    : [...list, { path, label, addedAt: Date.now() }];
  writeJSON(FAV_KEY, next);
}
export function isFavorite(path: string): boolean {
  return getFavorites().some((f) => f.path === path);
}
export function useFavorites(): FavoriteEntry[] {
  return useSyncExternalStore(
    subscribeFactory(FAV_KEY),
    () => getFavorites(),
    () => [] as FavoriteEntry[],
  );
}

// ── Recent items ─────────────────────────────────────────────────────────────
const MAX_RECENT = 10;
export function getRecent(): RecentEntry[] {
  return readJSON<RecentEntry[]>(RECENT_KEY, []);
}
export function recordRecent(path: string, label: string) {
  if (!path || path === "/login" || path === "/mfa") return;
  const list = getRecent().filter((r) => r.path !== path);
  const next = [{ path, label, visitedAt: Date.now() }, ...list].slice(0, MAX_RECENT);
  writeJSON(RECENT_KEY, next);
}
export function useRecent(): RecentEntry[] {
  return useSyncExternalStore(
    subscribeFactory(RECENT_KEY),
    () => getRecent(),
    () => [] as RecentEntry[],
  );
}

// ── Notification read state ──────────────────────────────────────────────────
export type NotifReadState = { readIds: string[] };
export function getNotifRead(): NotifReadState {
  return readJSON<NotifReadState>(NOTIF_READ_KEY, { readIds: [] });
}
export function markNotifRead(id: string) {
  const s = getNotifRead();
  if (s.readIds.includes(id)) return;
  writeJSON(NOTIF_READ_KEY, { readIds: [...s.readIds, id] });
}
export function markAllNotifRead(ids: string[]) {
  writeJSON(NOTIF_READ_KEY, { readIds: Array.from(new Set(ids)) });
}
export function useNotifRead(): NotifReadState {
  return useSyncExternalStore(
    subscribeFactory(NOTIF_READ_KEY),
    () => getNotifRead(),
    () => ({ readIds: [] as string[] }),
  );
}

// ── Notification preferences (mandatory categories cannot be muted) ──────────
export type NotifPrefs = { muted: string[] };
export const MANDATORY_NOTIF_CATEGORIES = ["security", "governance", "compliance"];
export function getNotifPrefs(): NotifPrefs {
  return readJSON<NotifPrefs>(NOTIF_PREFS_KEY, { muted: [] });
}
export function toggleMuteCategory(category: string) {
  if (MANDATORY_NOTIF_CATEGORIES.includes(category)) return;
  const p = getNotifPrefs();
  const muted = p.muted.includes(category)
    ? p.muted.filter((c) => c !== category)
    : [...p.muted, category];
  writeJSON(NOTIF_PREFS_KEY, { muted });
}
export function useNotifPrefs(): NotifPrefs {
  return useSyncExternalStore(
    subscribeFactory(NOTIF_PREFS_KEY),
    () => getNotifPrefs(),
    () => ({ muted: [] as string[] }),
  );
}

// ── Widget visibility (dashboard personalization) ────────────────────────────
export type WidgetPrefs = { hidden: string[] };
export function getWidgetPrefs(): WidgetPrefs {
  return readJSON<WidgetPrefs>(WIDGET_KEY, { hidden: [] });
}
export function toggleWidget(id: string) {
  const p = getWidgetPrefs();
  const hidden = p.hidden.includes(id)
    ? p.hidden.filter((x) => x !== id)
    : [...p.hidden, id];
  writeJSON(WIDGET_KEY, { hidden });
}
export function useWidgetPrefs(): WidgetPrefs {
  return useSyncExternalStore(
    subscribeFactory(WIDGET_KEY),
    () => getWidgetPrefs(),
    () => ({ hidden: [] as string[] }),
  );
}
export function useIsWidgetVisible(id: string): boolean {
  const p = useWidgetPrefs();
  return !p.hidden.includes(id);
}

// ── Hook: record the current route as a recent item ──────────────────────────
export function useRecordRoute(path: string, label: string) {
  useEffect(() => {
    recordRecent(path, label);
  }, [path, label]);
}