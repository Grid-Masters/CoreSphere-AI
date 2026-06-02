import { useCallback, useEffect, useState } from "react";
import { getActiveUser } from "./active-user";

/**
 * Acknowledgement persistence. The platform uses a client-side mock identity
 * (see active-user.ts), so user actions are persisted to localStorage keyed by
 * the active user's email. This matches the "mock metrics, persist user
 * actions" data-backing model.
 */
const KEY = "coresphere.acknowledgements.v1";
const EVT = "coresphere-ack";

export type AckRecord = {
  targetId: string;
  targetKind: string;
  userEmail: string;
  acknowledgedAt: string;
};

type Store = Record<string, AckRecord>; // key: `${userEmail}::${targetId}`

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function write(store: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    /* ignore */
  }
}

function compound(email: string, targetId: string) {
  return `${email}::${targetId}`;
}

export function isAcknowledged(targetId: string, email = getActiveUser().email): boolean {
  return Boolean(read()[compound(email, targetId)]);
}

export function acknowledge(targetId: string, targetKind = "memo") {
  const email = getActiveUser().email;
  const store = read();
  const k = compound(email, targetId);
  if (store[k]) return;
  store[k] = { targetId, targetKind, userEmail: email, acknowledgedAt: new Date().toISOString() };
  write(store);
}

export function allAcks(): AckRecord[] {
  return Object.values(read());
}

/** How many distinct users have acknowledged a given target. */
export function ackCountFor(targetId: string): number {
  return allAcks().filter((a) => a.targetId === targetId).length;
}

export function useAcknowledged(targetId: string) {
  const [acked, setAcked] = useState(false);
  useEffect(() => {
    const sync = () => setAcked(isAcknowledged(targetId));
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [targetId]);
  const confirm = useCallback((kind?: string) => acknowledge(targetId, kind), [targetId]);
  return [acked, confirm] as const;
}

/** Reactive list of all acknowledgements (leader view). */
export function useAllAcks(): AckRecord[] {
  const [list, setList] = useState<AckRecord[]>([]);
  useEffect(() => {
    const sync = () => setList(allAcks());
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return list;
}