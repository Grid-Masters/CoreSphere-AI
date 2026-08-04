// Mock shift scheduling store (localStorage-backed). Team Leads schedule weekly
// shifts; the Shift Hero badge is awarded only to scheduled staff. Demo only.

import { useSyncExternalStore } from "react";

export type ShiftSlot = "Morning" | "Afternoon" | "Night";

export type ShiftAssignment = {
  id: string;
  staffEmail: string;
  staffName: string;
  slot: ShiftSlot;
  day: string; // e.g. "Mon"
  department: string;
};

export const SHIFT_SLOTS: ShiftSlot[] = ["Morning", "Afternoon", "Night"];
export const SHIFT_TIMES: Record<ShiftSlot, string> = {
  Morning: "07:00 – 15:00",
  Afternoon: "15:00 – 23:00",
  Night: "23:00 – 07:00",
};

const KEY = "coresphere.shifts";
let _shifts: ShiftAssignment[] = [];
const listeners = new Set<() => void>();
const EMPTY_SHIFTS: ShiftAssignment[] = [];
let _hydrated = false;

function load(): ShiftAssignment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ShiftAssignment[]) : [];
  } catch {
    return [];
  }
}

function persist() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(_shifts));
  }
  listeners.forEach((l) => l());
}

export function addShift(a: Omit<ShiftAssignment, "id">) {
  _shifts = [..._shifts, { ...a, id: `sh-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }];
  persist();
}

export function removeShift(id: string) {
  _shifts = _shifts.filter((s) => s.id !== id);
  persist();
}

function subscribe(l: () => void) {
  if (!_hydrated && typeof window !== "undefined") {
    _hydrated = true;
    _shifts = load();
    queueMicrotask(() => listeners.forEach((fn) => fn()));
  }
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useShifts(): ShiftAssignment[] {
  return useSyncExternalStore(subscribe, () => _shifts, () => EMPTY_SHIFTS);
}

export function isScheduled(email: string): boolean {
  return _shifts.some((s) => s.staffEmail === email);
}