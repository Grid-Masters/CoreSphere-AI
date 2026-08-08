/**
 * Server-only network classification helpers.
 *
 * The trusted-network CIDR list is confidential: it is read here with the
 * server-only privileged Supabase client and NEVER returned to the browser.
 * Callers receive only the resulting classification.
 */
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";

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

export function requestIp(): string | null {
  try {
    let ip = getRequestIP({ xForwardedFor: true }) ?? getRequestHeader("x-forwarded-for") ?? null;
    if (ip && ip.includes(",")) ip = ip.split(",")[0].trim();
    return ip;
  } catch {
    return null;
  }
}

/** Fail-closed: anything not provably inside a trusted CIDR is "external". */
export async function classifyRequestNetwork(): Promise<{
  classification: "internal" | "external";
  ip: string | null;
}> {
  const ip = requestIp();
  if (!ip) return { classification: "external", ip: null };
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("trusted_networks")
      .select("cidr")
      .eq("is_active", true);
    const match = (data ?? []).some((r) => ipInCidr(ip, r.cidr));
    return { classification: match ? "internal" : "external", ip };
  } catch {
    return { classification: "external", ip };
  }
}
