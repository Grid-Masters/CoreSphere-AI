import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { CoreSphereAI } from "@/components/CoreSphereAI";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8 max-w-[1500px] mx-auto w-full">{children}</div>
        </main>
      </div>
      <CoreSphereAI />
    </div>
  );
}