import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "auto";
const KEY = "coresphere.theme";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "auto";
  const v = window.localStorage.getItem(KEY);
  return v === "light" || v === "dark" || v === "auto" ? v : "auto";
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = mode === "dark" || (mode === "auto" && prefersDark);
  root.classList.toggle("dark", isDark);
  root.dataset.theme = mode;
}

export function setTheme(mode: ThemeMode) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, mode);
  }
  applyTheme(mode);
  // Notify listeners (e.g. ThemePicker in another tab/component)
  window.dispatchEvent(new CustomEvent("coresphere:theme", { detail: mode }));
}

export function useTheme(): [ThemeMode, (m: ThemeMode) => void] {
  const [mode, setMode] = useState<ThemeMode>("auto");

  useEffect(() => {
    setMode(getStoredTheme());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<ThemeMode>).detail;
      if (detail) setMode(detail);
    };
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onMQ = () => {
      if (getStoredTheme() === "auto") applyTheme("auto");
    };
    window.addEventListener("coresphere:theme", onChange);
    mq.addEventListener?.("change", onMQ);
    return () => {
      window.removeEventListener("coresphere:theme", onChange);
      mq.removeEventListener?.("change", onMQ);
    };
  }, []);

  return [mode, setTheme];
}

/**
 * Inline script executed before React hydration to set the .dark class
 * based on the stored preference. Prevents flash-of-incorrect-theme.
 */
export const themeBootstrapScript = `
(function(){try{var k='coresphere.theme';var v=localStorage.getItem(k)||'auto';var d=v==='dark'||(v==='auto'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.classList.add('dark');r.dataset.theme=v;}catch(e){}})();
`.trim();