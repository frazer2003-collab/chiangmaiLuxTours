import type { AdminLocale } from "@/components/admin/i18n";
import { t } from "@/components/admin/i18n";

/** Map provider/auth errors to staff-facing copy; log raw message separately. */
export function mapLoginError(locale: AdminLocale, raw: string): string {
  const lower = raw.toLowerCase();

  if (
    lower.includes("invalid login") ||
    lower.includes("invalid credentials") ||
    lower.includes("invalid email or password")
  ) {
    return t(locale, "loginInvalidCredentials");
  }

  if (
    lower.includes("password") &&
    (lower.includes("short") ||
      lower.includes("least") ||
      lower.includes("characters") ||
      lower.includes("6 characters"))
  ) {
    return t(locale, "loginPasswordTooShort");
  }

  if (lower.includes("email not confirmed")) {
    return t(locale, "loginEmailNotConfirmed");
  }

  if (
    lower.includes("rate limit") ||
    lower.includes("too many requests") ||
    lower.includes("too many attempts")
  ) {
    return t(locale, "loginTooManyAttempts");
  }

  if (
    lower.includes("network") ||
    lower.includes("fetch failed") ||
    lower.includes("failed to fetch") ||
    lower.includes("doctype") ||
    lower.includes("not valid json")
  ) {
    return t(locale, "loginConnectionError");
  }

  return t(locale, "loginGenericError");
}
