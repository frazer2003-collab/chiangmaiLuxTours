import test from "node:test";
import assert from "node:assert/strict";
import {
  buildRecurringSchedule,
  closedCapacity,
  validateBatchDates,
} from "./admin-date-schedule.js";

test("builds an inclusive recurring schedule for selected weekdays", () => {
  const result = buildRecurringSchedule({
    startDate: "2026-10-01",
    endDate: "2026-10-14",
    weekdays: [1, 3],
    existingDates: [],
  });

  assert.deepEqual(result, {
    ok: true,
    dates: ["2026-10-05", "2026-10-07", "2026-10-12", "2026-10-14"],
    newDates: ["2026-10-05", "2026-10-07", "2026-10-12", "2026-10-14"],
    duplicateDates: [],
  });
});

test("separates dates that already exist for the tour", () => {
  const result = buildRecurringSchedule({
    startDate: "2026-10-01",
    endDate: "2026-10-07",
    weekdays: [1, 3, 4],
    existingDates: ["2026-10-05"],
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.newDates, ["2026-10-01", "2026-10-07"]);
  assert.deepEqual(result.duplicateDates, ["2026-10-05"]);
});

test("rejects reversed ranges and ranges longer than one year", () => {
  assert.deepEqual(
    buildRecurringSchedule({
      startDate: "2026-10-10",
      endDate: "2026-10-01",
      weekdays: [1],
      existingDates: [],
    }),
    { ok: false, reason: "range" },
  );

  assert.deepEqual(
    buildRecurringSchedule({
      startDate: "2026-01-01",
      endDate: "2027-01-03",
      weekdays: [1],
      existingDates: [],
    }),
    { ok: false, reason: "too_long" },
  );
});

test("requires at least one weekday", () => {
  assert.deepEqual(
    buildRecurringSchedule({
      startDate: "2026-10-01",
      endDate: "2026-10-07",
      weekdays: [],
      existingDates: [],
    }),
    { ok: false, reason: "weekdays" },
  );
});

test("validates, sorts, and deduplicates server batch dates", () => {
  assert.deepEqual(
    validateBatchDates(
      ["2026-10-07", "2026-10-05", "2026-10-07"],
      "2026-10-01",
    ),
    { ok: true, dates: ["2026-10-05", "2026-10-07"] },
  );

  assert.deepEqual(validateBatchDates(["2026-09-30"], "2026-10-01"), {
    ok: false,
    reason: "past",
  });
});

test("closing a booked date leaves no sellable seats", () => {
  assert.equal(closedCapacity(0), 0);
  assert.equal(closedCapacity(7), 7);
});
