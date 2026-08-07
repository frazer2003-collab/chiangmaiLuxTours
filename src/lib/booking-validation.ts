const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

/** Strip control characters and normalize whitespace for user-supplied text. */
export function sanitizeText(value: string, maxLength: number): string {
  return value.replace(CONTROL_CHARS, "").trim().slice(0, maxLength);
}

export function validateName(name: string): string | null {
  const trimmed = sanitizeText(name, 100);
  if (trimmed.length < 2) {
    return "Enter your full name (at least 2 characters).";
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const trimmed = sanitizeText(email, 254);
  if (!trimmed) {
    return "Enter an email address for your confirmation.";
  }
  if (trimmed.length > 254) {
    return "Email address is too long.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Enter a valid email address (e.g. name@example.com).";
  }
  return null;
}

export function validateDate(date: string, allowedDates?: string[]): string | null {
  if (!date) {
    return "Select a departure date to continue.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return "Select a valid departure date.";
  }
  if (allowedDates && !allowedDates.includes(date)) {
    return "Select one of the available departure dates.";
  }
  return null;
}

export function normalizeEmail(email: string): string {
  return sanitizeText(email, 254).toLowerCase();
}

export function normalizeName(name: string): string {
  return sanitizeText(name, 100);
}
