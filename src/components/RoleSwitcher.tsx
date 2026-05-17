import { Check, ChevronDown, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { directory, roleLabels, type Role } from "@/lib/directory";
import { setActiveUser, useActiveUser } from "@/lib/active-user";

const ROLE_ORDER: Role[] = ["staff", "qa", "ld", "team_lead", "group_head"];

export function RoleSwitcher() {
  const user = useActiveUser();

  const grouped = ROLE_ORDER.map((role) => ({
    role,
    label: roleLabels[role],
    entries: directory.filter((d) => d.role === role),
  }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 sm:gap-3 h-10 pl-2 sm:pl-3 pr-2 rounded-md border bg-card hover:bg-muted transition-colors"
          aria-label="Switch demo user"
        >
          <div className="hidden sm:block text-right leading-tight">
            <div className="text-sm font-medium truncate max-w-[140px]">{user.name}</div>
            <div className="text-[11px] text-muted-foreground truncate max-w-[160px]">
              {user.roleLabel} • {user.department}
            </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
            {user.initials}
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          <UserCog className="h-3.5 w-3.5" /> Demo Role Switcher
        </DropdownMenuLabel>
        <div className="px-2 pb-2 text-[11px] text-muted-foreground">
          Instantly preview any dashboard. Identity, department and permissions
          are resolved from the simulated UBA directory.
        </div>
        <DropdownMenuSeparator />
        {grouped.map((g) => (
          <div key={g.role} className="py-1">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">
              {g.label}
            </DropdownMenuLabel>
            {g.entries.map((e) => {
              const active = e.email === user.email;
              return (
                <DropdownMenuItem
                  key={e.email}
                  onSelect={() => setActiveUser(e.email)}
                  className="flex items-start gap-3 py-2"
                >
                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold shrink-0">
                    {e.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{e.name}</span>
                      {active && <Check className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {e.roleLabel} • {e.department}
                    </div>
                    <div className="text-[10px] text-muted-foreground/70 truncate">
                      {e.email}
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}