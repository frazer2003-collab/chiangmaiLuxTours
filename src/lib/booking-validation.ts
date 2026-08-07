export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return "Enter your full name (at least 2 characters).";
  }
  if (trimmed.length > 100) {
    return "Name must be 100 characters or fewer.";
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return "Enter an email address for your confirmation.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Enter a valid email address (e.g. name@example.com).";
  }
  return null;
}

export function validateDate(date: string): string | null {
  if (!date) {
    return "Select a departure date to continue.";
  }
  return null;
}
