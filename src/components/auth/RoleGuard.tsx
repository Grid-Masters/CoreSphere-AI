import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useActiveUser } from "@/lib/active-user";
import type { Role } from "@/lib/directory";

/**
 * Client-side authorization gate for privileged routes. Renders the protected
 * content only when the signed-in user's role is in `allow`; otherwise shows a
 * 403 panel. This complements (does not replace) database RLS, which remains
 * the server-authoritative protection for the underlying data.
 */
export function RoleGuard({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const user = useActiveUser();

  if (!allow.includes(user.role)) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto mt-16 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight mt-4">Access denied</h1>
          <p className="text-sm text-muted-foreground mt-2">
            You don't have permission to view this page. If you believe this is an
            error, contact your administrator.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center h-10 px-4 mt-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            Back to dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  return <>{children}</>;
}