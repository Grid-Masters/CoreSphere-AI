import { useSyncExternalStore } from "react";
import { directory, type DirectoryEntry } from "./directory";

const KEY = "coresphere.active-user";

function load(): DirectoryEntry {
  if (typeof window === "undefined") return directory[0];
  const saved = window.localStorage.getItem(KEY);
  return directory.find((d) => d.email === saved) ?? directory[0];
}

let _user: DirectoryEntry = load();
const listeners = new Set<() => void>();

export function getActiveUser(): DirectoryEntry {
  return _user;
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
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useActiveUser(): DirectoryEntry {
  return useSyncExternalStore(subscribe, getActiveUser, getActiveUser);
}