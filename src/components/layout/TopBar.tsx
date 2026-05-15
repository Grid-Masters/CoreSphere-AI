import { Bell, Search, HelpCircle } from "lucide-react";
import { currentUser } from "@/lib/mock-data";

export function TopBar() {
  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 lg:px-6 flex items-center gap-4">
      <div className="flex-1 max-w-xl relative">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search SOPs, policies, memos, people…"
          className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="h-10 w-10 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
        </button>
        <button className="h-10 w-10 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
        </button>
        <div className="hidden sm:flex items-center gap-3 pl-3 ml-1 border-l">
          <div className="text-right leading-tight">
            <div className="text-sm font-medium">{currentUser.name}</div>
            <div className="text-[11px] text-muted-foreground">
              {currentUser.role} • {currentUser.department}
            </div>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
            {currentUser.initials}
          </div>
        </div>
      </div>
    </header>
  );
}