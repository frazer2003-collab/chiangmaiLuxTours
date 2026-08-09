export function getStaffEmailAllowlist(): string[] {
  const raw = process.env.STAFF_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isStaffEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getStaffEmailAllowlist().includes(email.toLowerCase());
}

export function hasStaffRole(
  user: {
    email?: string | null;
    app_metadata?: Record<string, unknown>;
  } | null | undefined,
): boolean {
  if (!user) return false;
  if (user.app_metadata?.role === "staff") return true;
  return isStaffEmail(user.email);
}
