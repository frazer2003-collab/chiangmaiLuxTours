/** Format typed digits as DD/MM/YY while the user enters a date. */
export function formatAdminDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 6);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** Parse DD/MM/YY to ISO yyyy-mm-dd, or null when incomplete/invalid. */
export function parseAdminDateInput(display: string): string | null {
  const match = display.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const yy = Number(match[3]);
  const year = yy >= 70 ? 1900 + yy : 2000 + yy;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** ISO yyyy-mm-dd → DD/MM/YY for display. */
export function isoToAdminDateDisplay(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year.slice(-2)}`;
}

/** ISO yyyy-mm-dd → weekday + DD/MM/YY for list rows. */
export function formatAdminDateRow(iso: string, locale: string): string {
  const display = isoToAdminDateDisplay(iso);
  if (!display) return iso;

  const parsed = parseAdminDateInput(display);
  if (!parsed) return display;

  const weekday = new Date(parsed + "T12:00:00").toLocaleDateString(locale, {
    weekday: "short",
  });
  return `${weekday} · ${display}`;
}
