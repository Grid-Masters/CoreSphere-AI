import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { demoProfiles } from "./demo-profiles";

/**
 * Server-side demo sign-in.
 *
 * The shared demo password is stored ONLY as a server-side secret
 * (`DEMO_PASSWORD`) and is never shipped in the client bundle. The client
 * requests a session for one of the allow-listed demo personas; the server
 * performs the password sign-in and returns the resulting session so the
 * browser can hydrate it via `supabase.auth.setSession()`.
 */
export const demoSignIn = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) => {
    if (!data || typeof data.email !== "string") {
      throw new Error("A demo email is required.");
    }
    return { email: data.email.trim().toLowerCase() };
  })
  .handler(async ({ data }) => {
    // Only allow the curated demo personas — never arbitrary accounts.
    const allowed = demoProfiles.some(
      (p) => p.email.toLowerCase() === data.email,
    );
    if (!allowed) {
      return { ok: false as const };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
    const DEMO_PASSWORD = process.env.DEMO_PASSWORD;
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY || !DEMO_PASSWORD) {
      throw new Error("Demo access is not configured.");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: DEMO_PASSWORD,
    });

    if (error || !signInData.session) {
      return { ok: false as const };
    }

    return {
      ok: true as const,
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
    };
  });