export type RecurringScheduleResult =
  | {
      ok: true;
      dates: string[];
      newDates: string[];
      duplicateDates: string[];
    }
  | { ok: false; reason: "range" | "too_long" | "weekdays" };

export function buildRecurringSchedule(input: {
  startDate: string;
  endDate: string;
  weekdays: number[];
  existingDates: string[];
}): RecurringScheduleResult;

export function validateBatchDates(
  inputDates: string[],
  today: string,
):
  | { ok: true; dates: string[] }
  | { ok: false; reason: "empty" | "too_many" | "invalid" | "past" };

export function closedCapacity(bookedCount: number): number;
