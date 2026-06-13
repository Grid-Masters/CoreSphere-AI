import { useSyncExternalStore } from "react";
import { directory, type DirectoryEntry } from "./directory";
import { supabase } from "@/integrations/supabase/client";

/**
 * Stable SSR/initial-client value. We always return `directory[0]` from
 * `getServerSnapshot` and the initial `getSnapshot` so the SSR-rendered
 * tree matches the first client render. After hydration we resolve the
 * real signed-in user from the Supabase session and notify subscribers,
 * which triggers a regular React re-render — not a hydration mismatch.
 */
const DEFAULT: DirectoryEntry = directory[0];
let _user: DirectoryEntry = DEFAULT;
const listeners = new Set<() => void>();
let _initialized = false;

export function getActiveUser(): DirectoryEntry {
  return _user;
}

export function getServerActiveUser(): DirectoryEntry {
  return DEFAULT;
}

function setFromEmail(email?: string | null) {
  const found = email
    ? directory.find((d) => d.email.toLowerCase() === email.toLowerCase())
    : undefined;
  const next = found ?? DEFAULT;
  if (next.email !== _user.email) {
    _user = next;
    listeners.forEach((fn) => fn());
  }
}

function init() {
  if (_initialized || typeof window === "undefined") return;
  _initialized = true;
  void supabase.auth.getUser().then(({ data }) => setFromEmail(data.user?.email));
  supabase.auth.onAuthStateChange((_event, session) =>
    setFromEmail(session?.user?.email),
  );
}

function subscribe(l: () => void) {
  init();
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useActiveUser(): DirectoryEntry {
  return useSyncExternalStore(subscribe, getActiveUser, getServerActiveUser);
}