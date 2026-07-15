import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

// ---------------- Network classification ----------------
// Compares the caller's IP against the CIDRs stored in trusted_networks.
// Returns { classification, ip }. Falls back to "external" if IP or DB is unavailable.
function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    const v = Number(p);
    if (!Number.isInteger(v) || v < 0 || v > 255) return null;
    n = (n << 8) + v;
  }
  return n >>> 0;
}
function ipInCidr(ip: string, cidr: string): boolean {
  const [base, bitsStr] = cidr.split("/");
  const bits = Number(bitsStr);
  const ipN = ipv4ToInt(ip);
  const baseN = ipv4ToInt(base ?? "");
  if (ipN === null || baseN === null || !Number.isInteger(bits) || bits < 0 || bits > 32) return false;
  if (bits === 0) return true;
  const mask = (~0 << (32 - bits)) >>> 0;
  return (ipN & mask) === (baseN & mask);
}

export const classifyNetwork = createServerFn({ method: "GET" }).handler(async () => {
  let ip: string | null = null;
  try {
    ip = getRequestIP({ xForwardedFor: true }) ?? getRequestHeader("x-forwarded-for") ?? null;
    if (ip && ip.includes(",")) ip = ip.split(",")[0].trim();
  } catch {
    ip = null;
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    return { classification: "external" as const, ip };
  }
  const key = SUPABASE_PUBLISHABLE_KEY;
  const supa = createClient<Database>(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data } = await supa.from("trusted_networks").select("cidr").eq("is_active", true);
  const cidrs = (data ?? []).map((r) => r.cidr);

  let classification: "internal" | "external" = "external";
  if (ip && cidrs.some((c) => ipInCidr(ip!, c))) classification = "internal";
  return { classification, ip };
});

// ---------------- Audit logging ----------------
export const logAuditEvent = createServerFn({ method: "POST" })
  .inputValidator((data: {
    event_type: string;
    outcome: "success" | "failure";
    action?: string;
    user_email?: string;
    role?: string;
    session_id?: string | null;
    device?: string;
    browser?: string;
    network_classification?: string;
    metadata?: Record<string, unknown>;
  }) => data)
  .handler(async ({ data }) => {
    let ip: string | null = null;
    try {
      ip = getRequestIP({ xForwardedFor: true }) ?? null;
      if (ip && ip.includes(",")) ip = ip.split(",")[0].trim();
    } catch {
      ip = null;
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Best-effort lookup of user_id from email if present
    let user_id: string | null = null;
    if (data.user_email) {
      const { data: u } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", data.user_email)
        .maybeSingle();
      user_id = u?.id ?? null;
    }
    await supabaseAdmin.from("audit_events").insert({
      user_id,
      user_email: data.user_email ?? null,
      role: data.role ?? null,
      session_id: data.session_id ?? null,
      event_type: data.event_type,
      outcome: data.outcome,
      action: data.action ?? null,
      device: data.device ?? null,
      browser: data.browser ?? null,
      ip_address: ip,
      network_classification: data.network_classification ?? null,
      metadata: (data.metadata ?? {}) as never,
    });
    return { ok: true as const };
  });

// ---------------- Session lifecycle ----------------
export const createSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    device?: string;
    browser?: string;
    network_classification: "internal" | "external";
    mfa_verified: boolean;
  }) => data)
  .handler(async ({ data, context }) => {
    let ip: string | null = null;
    try {
      ip = getRequestIP({ xForwardedFor: true }) ?? null;
      if (ip && ip.includes(",")) ip = ip.split(",")[0].trim();
    } catch {
      ip = null;
    }
    const { data: row, error } = await context.supabase
      .from("user_sessions")
      .insert({
        user_id: context.userId,
        device: data.device ?? null,
        browser: data.browser ?? null,
        ip_address: ip,
        network_classification: data.network_classification,
        mfa_verified: data.mfa_verified,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { session_id: row.id };
  });

export const touchSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { session_id: string }) => data)
  .handler(async ({ data, context }) => {
    await context.supabase
      .from("user_sessions")
      .update({ last_activity_at: new Date().toISOString() })
      .eq("id", data.session_id)
      .eq("user_id", context.userId);
    return { ok: true as const };
  });

export const endSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { session_id: string }) => data)
  .handler(async ({ data, context }) => {
    await context.supabase
      .from("user_sessions")
      .update({ ended_at: new Date().toISOString() })
      .eq("id", data.session_id)
      .eq("user_id", context.userId);
    return { ok: true as const };
  });

// ---------------- MFA verification (hard-token secure-pass) ----------------
// The UBA hard-token generates a rolling 6-digit code; server-side we accept a
// well-formed 6-digit numeric string against an active token registration.
// Real cryptographic validation would call the bank's token server.
export const verifyHardToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { code: string; session_id: string }) => {
    if (!/^\d{6}$/.test(data.code)) throw new Error("Enter the 6-digit code from your hard token.");
    if (!data.session_id) throw new Error("Missing session context.");
    return data;
  })
  .handler(async ({ data, context }) => {
    const { data: token } = await context.supabase
      .from("hard_tokens")
      .select("id, is_active")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!token || !token.is_active) {
      return { ok: false as const, reason: "no_token" };
    }
    await context.supabase
      .from("user_sessions")
      .update({ mfa_verified: true, last_activity_at: new Date().toISOString() })
      .eq("id", data.session_id)
      .eq("user_id", context.userId);
    return { ok: true as const };
  });