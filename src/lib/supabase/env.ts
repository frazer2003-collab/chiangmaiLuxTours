export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
}

export function getSupabaseAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
}

export function isValidSupabaseProjectUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

/** Browser + server: anon key and project URL (embedded at build time on client). */
export function isSupabasePublicConfigured(): boolean {
  return Boolean(
    isValidSupabaseProjectUrl(getSupabaseUrl()) && getSupabaseAnonKey(),
  );
}

/** Server only: includes service role for bookings/admin APIs. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    isSupabasePublicConfigured() && getSupabaseServiceRoleKey(),
  );
}

export function describeSupabaseConfigProblem(): string | null {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    return "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them in Vercel and redeploy.";
  }
  if (!isValidSupabaseProjectUrl(url)) {
    return `NEXT_PUBLIC_SUPABASE_URL must be https://YOUR-PROJECT.supabase.co (got "${url}").`;
  }
  return null;
}
