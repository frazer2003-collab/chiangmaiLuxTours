import type { GuestGender } from "@/lib/db/types";

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

/** Strip control characters and normalize whitespace for user-supplied text. */
export function sanitizeText(value: string, maxLength: number): string {
  return value.replace(CONTROL_CHARS, "").trim().slice(0, maxLength);
}

export function validateFamilyName(familyName: string): string | null {
  const trimmed = sanitizeText(familyName, 80);
  if (trimmed.length < 1) {
    return "Enter your family name (surname).";
  }
  return null;
}

export function validateGivenName(givenName: string): string | null {
  const trimmed = sanitizeText(givenName, 80);
  if (trimmed.length < 1) {
    return "Enter your given name (first name).";
  }
  return null;
}

/** @deprecated Use validateFamilyName + validateGivenName */
export function validateName(name: string): string | null {
  const trimmed = sanitizeText(name, 100);
  if (trimmed.length < 2) {
    return "Enter your full name (at least 2 characters).";
  }
  return null;
}

export function validateGender(gender: string): string | null {
  if (gender === "male" || gender === "female" || gender === "na") {
    return null;
  }
  return "Select male, female, or prefer not to say.";
}

export function validateIdNumber(idNumber: string): string | null {
  const trimmed = sanitizeText(idNumber, 40).replace(/\s+/g, "");
  if (trimmed.length < 4) {
    return "Enter your passport number or Thai ID.";
  }
  if (!/^[A-Za-z0-9-]+$/.test(trimmed)) {
    return "ID may only contain letters, numbers, and hyphens.";
  }
  return null;
}

export function validateNationality(nationality: string): string | null {
  const trimmed = sanitizeText(nationality, 60);
  if (trimmed.length < 2) {
    return "Enter your nationality.";
  }
  return null;
}

export function validateDateOfBirth(dob: string): string | null {
  if (!dob) {
    return "Enter your date of birth as DD/MM/YY.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return "Enter a valid date of birth as DD/MM/YY.";
  }

  const [year, month, day] = dob.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "Enter a valid date of birth.";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date >= today) {
    return "Date of birth must be in the past.";
  }

  const oldest = new Date();
  oldest.setFullYear(oldest.getFullYear() - 120);
  if (date < oldest) {
    return "Enter a realistic date of birth.";
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

export function validateGuestIdentity(input: {
  familyName: string;
  givenName: string;
  gender: string;
  idNumber: string;
  nationality: string;
  dateOfBirth: string;
}): string | null {
  return (
    validateFamilyName(input.familyName) ??
    validateGivenName(input.givenName) ??
    validateGender(input.gender) ??
    validateIdNumber(input.idNumber) ??
    validateNationality(input.nationality) ??
    validateDateOfBirth(input.dateOfBirth)
  );
}

export function validateGuestDetails(input: {
  familyName: string;
  givenName: string;
  gender: string;
  idNumber: string;
  nationality: string;
  dateOfBirth: string;
  email: string;
}): string | null {
  return validateGuestIdentity(input) ?? validateEmail(input.email);
}

export function validatePassengerForms(
  passengers: {
    familyName: string;
    givenName: string;
    gender: string;
    idNumber: string;
    nationality: string;
    dateOfBirth: string;
  }[],
  expectedCount: number,
  email: string,
): string | null {
  if (passengers.length !== expectedCount) {
    return "Enter details for every passenger.";
  }

  for (let i = 0; i < passengers.length; i++) {
    const err = validateGuestIdentity(passengers[i]);
    if (err) return `Passenger ${i + 1}: ${err}`;
  }

  const emailError = validateEmail(email);
  if (emailError) return emailError;

  return null;
}

/** v1 checkout: lead guest name + email only; passport details collected later. */
export function validateLeadGuestBooking(
  lead: { familyName: string; givenName: string },
  email: string,
): string | null {
  const nameError =
    validateFamilyName(lead.familyName) ?? validateGivenName(lead.givenName);
  if (nameError) return nameError;
  return validateEmail(email);
}

export function normalizeEmail(email: string): string {
  return sanitizeText(email, 254).toLowerCase();
}

export function normalizeName(name: string): string {
  return sanitizeText(name, 100);
}

export function normalizeGuestText(value: string, maxLength: number): string {
  return sanitizeText(value, maxLength);
}

export function normalizeIdNumber(idNumber: string): string {
  return sanitizeText(idNumber, 40).replace(/\s+/g, "").toUpperCase();
}

export function formatGuestFullName(familyName: string, givenName: string): string {
  return `${normalizeGuestText(familyName, 80)} ${normalizeGuestText(givenName, 80)}`.trim();
}

export function isGuestGender(value: string): value is GuestGender {
  return value === "male" || value === "female" || value === "na";
}

export function genderLabel(gender: GuestGender): string {
  if (gender === "male") return "Male";
  if (gender === "female") return "Female";
  return "Prefer not to say";
}
