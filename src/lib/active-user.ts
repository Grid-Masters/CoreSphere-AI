import { useSyncExternalStore } from "react";
import { directory, type DirectoryEntry } from "./directory";

const KEY = "coresphere.active-user";

/**
 * Stable SSR/initial-client value. We always return `directory[0]` from
 * `getServerSnapshot` and the initial `getSnapshot` so the SSR-rendered
 * tree matches the first client render. After hydration the
 * `onClientMount` effect swaps in the localStorage-persisted user and
 * notifies subscribers, which triggers a regular React re-render — not
 * a hydration mismatch.
 */
const DEFAULT: DirectoryEntry = directory[0];
let _user: DirectoryEntry = DEFAULT;
const listeners = new Set<() => void>();
let _mounted = false;

export function getActiveUser(): DirectoryEntry {
  return _user;
}

export function getServerActiveUser(): DirectoryEntry {
  return DEFAULT;
}

export function setActiveUser(email: string) {
  const found = directory.find((d) => d.email === email);
  if (!found) return;
  _user = found;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, email);
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  // First subscriber after hydration is a good signal to swap in the
  // persisted user (one-shot).
  if (!_mounted && typeof window !== "undefined") {
    _mounted = true;
    const saved = window.localStorage.getItem(KEY);
    const found = saved ? directory.find((d) => d.email === saved) : undefined;
    if (found && found.email !== _user.email) {
      _user = found;
      // Defer to next tick so the subscribing component finishes its
      // initial mount before being asked to re-render.
      queueMicrotask(() => listeners.forEach((fn) => fn()));
    }
  }
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useActiveUser(): DirectoryEntry {
  return useSyncExternalStore(subscribe, getActiveUser, getServerActiveUser);
}