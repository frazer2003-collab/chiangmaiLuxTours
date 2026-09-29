const DAY_MS = 86_400_000;
const MAX_RANGE_DAYS = 366;

/**
 * @param {string} value
 */
function parseIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10) === value ? date : null;
}

/**
 * @param {{
 *   startDate: string;
 *   endDate: string;
 *   weekdays: number[];
 *   existingDates: string[];
 * }} input
 * @returns {
 *   | { ok: true; dates: string[]; newDates: string[]; duplicateDates: string[] }
 *   | { ok: false; reason: "range" | "too_long" | "weekdays" }
 * }
 */
export function buildRecurringSchedule(input) {
  const start = parseIsoDate(input.startDate);
  const end = parseIsoDate(input.endDate);
  if (!start || !end || end < start) return { ok: false, reason: "range" };

  const spanDays = Math.floor((end.getTime() - start.getTime()) / DAY_MS) + 1;
  if (spanDays > MAX_RANGE_DAYS) return { ok: false, reason: "too_long" };

  const weekdays = new Set(
    input.weekdays.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6),
  );
  if (weekdays.size === 0) return { ok: false, reason: "weekdays" };

  const existing = new Set(input.existingDates);
  const dates = [];
  const newDates = [];
  const duplicateDates = [];

  for (
    let timestamp = start.getTime();
    timestamp <= end.getTime();
    timestamp += DAY_MS
  ) {
    const date = new Date(timestamp);
    if (!weekdays.has(date.getUTCDay())) continue;
    const iso = date.toISOString().slice(0, 10);
    dates.push(iso);
    if (existing.has(iso)) duplicateDates.push(iso);
    else newDates.push(iso);
  }

  return { ok: true, dates, newDates, duplicateDates };
}

/**
 * @param {string[]} inputDates
 * @param {string} today
 * @returns {
 *   | { ok: true; dates: string[] }
 *   | { ok: false; reason: "empty" | "too_many" | "invalid" | "past" }
 * }
 */
export function validateBatchDates(inputDates, today) {
  const dates = [...new Set(inputDates)].sort();
  if (dates.length === 0) return { ok: false, reason: "empty" };
  if (dates.length > MAX_RANGE_DAYS) return { ok: false, reason: "too_many" };
  if (dates.some((date) => !parseIsoDate(date))) {
    return { ok: false, reason: "invalid" };
  }
  if (dates.some((date) => date < today)) return { ok: false, reason: "past" };
  return { ok: true, dates };
}

/**
 * A closed departure keeps its bookings but has no remaining availability.
 * @param {number} bookedCount
 */
export function closedCapacity(bookedCount) {
  return Math.max(0, Math.floor(bookedCount));
}
