import { useEffect, useState } from "react";

const VIDEO_KEY = "uba.coresphere.video-progress.v1";
const THEORY_KEY = "uba.coresphere.theory-progress.v1";

type Store = Record<string, number>;

function read(key: string): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function write(key: string, store: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent("coresphere-progress"));
  } catch {
    /* ignore */
  }
}

export function getProgress(key: string, sopId: string, fallback: number) {
  const store = read(key);
  return Math.max(store[sopId] ?? 0, fallback);
}

export function setProgress(key: string, sopId: string, value: number) {
  const store = read(key);
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  if ((store[sopId] ?? 0) >= clamped) return;
  store[sopId] = clamped;
  write(key, store);
}

function useStoredProgress(key: string, sopId: string, fallback: number) {
  const [value, setValue] = useState(fallback);
  useEffect(() => {
    setValue(getProgress(key, sopId, fallback));
    const onChange = () => setValue(getProgress(key, sopId, fallback));
    window.addEventListener("coresphere-progress", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("coresphere-progress", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [key, sopId, fallback]);

  const update = (next: number) => {
    setProgress(key, sopId, next);
    setValue((v) => Math.max(v, Math.min(100, Math.round(next))));
  };
  return [value, update] as const;
}

export const useVideoProgress = (sopId: string, fallback = 0) =>
  useStoredProgress(VIDEO_KEY, sopId, fallback);

export const useTheoryProgress = (sopId: string, fallback = 0) =>
  useStoredProgress(THEORY_KEY, sopId, fallback);

export { VIDEO_KEY, THEORY_KEY };