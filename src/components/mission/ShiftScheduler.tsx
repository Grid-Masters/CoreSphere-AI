import { useState } from "react";
import { CalendarClock, Plus, Trash2 } from "lucide-react";
import { PanelCard, StatusBadge } from "@/components/ui-bits/Card";
import { directory, type DirectoryEntry } from "@/lib/directory";
import { addShift, removeShift, useShifts, SHIFT_SLOTS, SHIFT_TIMES, type ShiftSlot } from "@/lib/shifts";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ShiftScheduler({ user }: { user: DirectoryEntry }) {
  const shifts = useShifts();
  const team = directory.filter((d) => d.reportsTo === user.email || d.department === user.department);
  const roster = team.length ? team : directory.filter((d) => d.role === "staff");

  const [staffEmail, setStaffEmail] = useState(roster[0]?.email ?? "");
  const [slot, setSlot] = useState<ShiftSlot>("Morning");
  const [day, setDay] = useState("Mon");

  const mine = shifts.filter((s) => roster.some((r) => r.email === s.staffEmail));

  const submit = () => {
    const staff = roster.find((r) => r.email === staffEmail);
    if (!staff) return;
    addShift({ staffEmail: staff.email, staffName: staff.name, slot, day, department: staff.department });
  };

  return (
    <PanelCard
      title="Shift Scheduler"
      description="Schedule weekly shifts — the Shift Hero badge is awarded only to scheduled staff"
      action={<CalendarClock className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="grid sm:grid-cols-4 gap-2">
        <select value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} className="h-9 px-2 rounded-md border border-input bg-background text-sm">
          {roster.map((r) => (
            <option key={r.email} value={r.email}>{r.name}</option>
          ))}
        </select>
        <select value={slot} onChange={(e) => setSlot(e.target.value as ShiftSlot)} className="h-9 px-2 rounded-md border border-input bg-background text-sm">
          {SHIFT_SLOTS.map((s) => (
            <option key={s} value={s}>{s} ({SHIFT_TIMES[s]})</option>
          ))}
        </select>
        <select value={day} onChange={(e) => setDay(e.target.value)} className="h-9 px-2 rounded-md border border-input bg-background text-sm">
          {DAYS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button onClick={submit} className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium inline-flex items-center justify-center gap-1.5 hover:bg-primary/90">
          <Plus className="h-3.5 w-3.5" /> Schedule
        </button>
      </div>

      {mine.length ? (
        <ul className="divide-y -my-2 mt-4">
          {mine.map((s) => (
            <li key={s.id} className="py-2.5 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold">
                {s.staffName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{s.staffName}</div>
                <div className="text-[11px] text-muted-foreground">{s.day} • {s.slot} ({SHIFT_TIMES[s.slot]})</div>
              </div>
              <StatusBadge status="On Duty" />
              <button onClick={() => removeShift(s.id)} className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground" aria-label="Remove shift">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 text-sm text-muted-foreground">No shifts scheduled yet. Add one above.</div>
      )}
    </PanelCard>
  );
}