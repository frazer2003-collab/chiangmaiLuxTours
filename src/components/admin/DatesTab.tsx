"use client";

import { useMemo, useState, useTransition } from "react";
import { tours } from "@/lib/tours";
import { chartHubLabel } from "@/lib/tour-display";
import type { DbTourDate } from "@/lib/db/types";
import {
  addTourDates,
  fetchAdminTourDates,
  removeTourDates,
  updateTourDateCapacity,
} from "@/lib/actions/admin";
import { buildRecurringSchedule } from "@/lib/admin-date-schedule";
import { useAdminLocale } from "./AdminLocaleProvider";
import {
  AdminSkeletonList,
  AdminSpinner,
  AdminStatusBanner,
} from "./AdminFeedback";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import { AdminDateInput } from "./AdminDateInput";
import { formatAdminDateRow } from "@/lib/admin-date-input";

const INITIAL_VISIBLE_DATES = 8;
const WEEKDAYS = [1, 2, 3, 4, 5, 6, 0];

function fillCount(template: string, n: number) {
  return template.replace("{n}", String(n));
}

function fillVars(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template,
  );
}

function monthHeading(isoDate: string, localeTag: string) {
  return new Date(`${isoDate.slice(0, 7)}-01T12:00:00`).toLocaleDateString(localeTag, {
    month: "long",
    year: "numeric",
  });
}

export function DatesTab({
  initialDatesByTour,
}: {
  initialDatesByTour: Record<string, DbTourDate[]>;
}) {
  const { locale, tr } = useAdminLocale();
  const [tourId, setTourId] = useState(tours[0]?.id ?? "");
  const [showAllDates, setShowAllDates] = useState(false);
  const [datesByTour, setDatesByTour] = useState(initialDatesByTour);
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [weekdays, setWeekdays] = useState<number[]>(WEEKDAYS);
  const [newCapacity, setNewCapacity] = useState(20);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingTour, setLoadingTour] = useState(false);
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<"add" | "reload" | "remove" | null>(null);

  const localeTag = locale === "th" ? "th-TH" : "en-GB";
  const dates = useMemo(() => datesByTour[tourId] ?? [], [datesByTour, tourId]);
  const visibleDates = showAllDates ? dates : dates.slice(0, INITIAL_VISIBLE_DATES);
  const schedule = useMemo(
    () =>
      buildRecurringSchedule({
        startDate: rangeStart,
        endDate: rangeEnd,
        weekdays,
        existingDates: dates.map((row) => row.date),
      }),
    [dates, rangeEnd, rangeStart, weekdays],
  );
  const selectedRows = useMemo(
    () => dates.filter((row) => selectedIds.has(row.id)),
    [dates, selectedIds],
  );
  const selectedBooked = selectedRows.filter((row) => row.booked_count > 0).length;
  const selectedEmpty = selectedRows.length - selectedBooked;
  const dateGroups = useMemo(() => {
    const groups: { month: string; rows: DbTourDate[] }[] = [];
    for (const row of visibleDates) {
      const month = monthHeading(row.date, localeTag);
      const last = groups[groups.length - 1];
      if (last && last.month === month) last.rows.push(row);
      else groups.push({ month, rows: [row] });
    }
    return groups;
  }, [visibleDates, localeTag]);

  function handleTourChange(id: string) {
    setTourId(id);
    setShowAllDates(false);
    setSelectedIds(new Set());
    setBulkConfirmOpen(false);
    setRangeStart("");
    setRangeEnd("");
  }

  function reloadDates(id: string, mode: "reload" | "add" = "reload") {
    setError(null);
    setLoadingTour(true);
    setAction(mode);
    startTransition(async () => {
      const result = await fetchAdminTourDates(id);
      setLoadingTour(false);
      setAction(null);
      if (result.ok && result.data) {
        setDatesByTour((prev) => ({ ...prev, [id]: result.data! }));
        return;
      }
      setError(!result.ok ? result.error : tr("errorRetry"));
    });
  }

  function handleAddDates() {
    setError(null);
    setSuccess(null);
    if (!schedule.ok) {
      const key =
        schedule.reason === "weekdays"
          ? "selectWeekday"
          : schedule.reason === "too_long"
            ? "dateRangeTooLong"
            : "dateRangeInvalid";
      setError(tr(key));
      return;
    }
    if (schedule.newDates.length === 0) {
      setError(tr("noNewDates"));
      return;
    }
    setAction("add");
    startTransition(async () => {
      const result = await addTourDates({
        tourId,
        dates: schedule.newDates,
        capacity: newCapacity,
      });
      setAction(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setRangeStart("");
      setRangeEnd("");
      setSuccess(
        fillVars(tr("datesAdded"), {
          added: result.data?.added ?? schedule.newDates.length,
          skipped: result.data?.skipped ?? 0,
        }),
      );
      reloadDates(tourId, "add");
    });
  }

  const [capacityDrafts, setCapacityDrafts] = useState<Record<string, number>>({});
  const [savingCapId, setSavingCapId] = useState<string | null>(null);

  function handleCapacitySave(id: string) {
    const capacity = capacityDrafts[id];
    if (capacity == null) return;
    setError(null);
    setSuccess(null);
    setSavingCapId(id);
    startTransition(async () => {
      const result = await updateTourDateCapacity({ id, capacity });
      setSavingCapId(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setCapacityDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setSuccess(tr("saved"));
      reloadDates(tourId);
    });
  }

  function toggleWeekday(day: number) {
    setWeekdays((current) =>
      current.includes(day)
        ? current.filter((value) => value !== day)
        : WEEKDAYS.filter((value) => current.includes(value) || value === day),
    );
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectVisibleDates() {
    setSelectedIds((current) => {
      const next = new Set(current);
      const allVisibleSelected = visibleDates.every((row) => next.has(row.id));
      for (const row of visibleDates) {
        if (allVisibleSelected) next.delete(row.id);
        else next.add(row.id);
      }
      return next;
    });
  }

  function handleRemoveClick(id: string) {
    setSelectedIds(new Set([id]));
    setBulkConfirmOpen(true);
  }

  function confirmBulkRemove() {
    if (selectedIds.size === 0) return;
    setError(null);
    setSuccess(null);
    setAction("remove");
    startTransition(async () => {
      const result = await removeTourDates({ ids: [...selectedIds] });
      setAction(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setBulkConfirmOpen(false);
      setSelectedIds(new Set());
      setSuccess(
        fillVars(tr("datesRemoved"), {
          removed: result.data?.removed ?? selectedEmpty,
          closed: result.data?.closed ?? selectedBooked,
        }),
      );
      reloadDates(tourId);
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-[var(--ink)]">{tr("selectTour")}</p>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={tr("selectTour")}>
          {tours.map((tour) => {
            const selected = tourId === tour.id;
            const openCount = (datesByTour[tour.id] ?? []).filter(
              (row) => row.booked_count < row.capacity,
            ).length;
            return (
              <button
                key={tour.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => handleTourChange(tour.id)}
                className={`admin-pressable-wide flex min-h-14 flex-col items-start justify-center rounded-xl px-3 py-2.5 text-left ${
                  selected
                    ? "bg-[var(--river-blue)] text-white"
                    : "bg-white text-[var(--ink)] ring-1 ring-[var(--river-blue)]/15"
                }`}
              >
                <span className="text-sm font-semibold leading-tight">{chartHubLabel(tour)}</span>
                <span className={`mt-0.5 text-xs leading-tight ${selected ? "text-white/70" : "text-[var(--ink-muted)]"}`}>
                  {openCount === 1
                    ? tr("oneDateOpen")
                    : fillCount(tr("datesOpen"), openCount)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 ring-1 ring-[var(--river-blue)]/10">
        <div>
          <h2 className="text-base font-semibold text-[var(--ink)]">
            {tr("addSchedule")}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">
            {tr("addScheduleHint")}
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
              {tr("startDate")}
            </span>
            <AdminDateInput
              id="schedule-start"
              value={rangeStart}
              onChange={setRangeStart}
              disabled={pending}
              showHint={false}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
              {tr("endDate")}
            </span>
            <AdminDateInput
              id="schedule-end"
              value={rangeEnd}
              onChange={setRangeEnd}
              disabled={pending}
              showHint={false}
            />
          </label>
        </div>

        <fieldset className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <legend className="text-sm font-medium text-[var(--ink)]">
              {tr("repeatOn")}
            </legend>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                setWeekdays(weekdays.length === WEEKDAYS.length ? [] : WEEKDAYS)
              }
              className="admin-hit-44 text-sm font-semibold text-[var(--river-blue)] disabled:opacity-50"
            >
              {weekdays.length === WEEKDAYS.length
                ? tr("clearDays")
                : tr("everyDay")}
            </button>
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {WEEKDAYS.map((day) => {
              const active = weekdays.includes(day);
              const weekdayKeys = [
                "weekdaySun",
                "weekdayMon",
                "weekdayTue",
                "weekdayWed",
                "weekdayThu",
                "weekdayFri",
                "weekdaySat",
              ] as const;
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={active}
                  disabled={pending}
                  onClick={() => toggleWeekday(day)}
                  className={`admin-pressable flex min-h-11 items-center justify-center rounded-xl text-xs font-semibold ${
                    active
                      ? "bg-[var(--river-blue)] text-white"
                      : "bg-[var(--chart-paper)] text-[var(--ink-muted)] ring-1 ring-[var(--river-blue)]/15"
                  } disabled:opacity-50`}
                >
                  {tr(weekdayKeys[day])}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="mt-4 block sm:max-w-40">
          <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
            {tr("capacityPerDate")}
          </span>
          <input
            type="number"
            min={1}
            max={999}
            inputMode="numeric"
            value={newCapacity}
            onChange={(e) => setNewCapacity(Number(e.target.value))}
            disabled={pending}
            className="min-h-11 w-full rounded-xl border border-[var(--river-blue)]/20 px-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
          />
        </label>

        {schedule.ok ? (
          <div
            className="mt-4 rounded-xl bg-[var(--chart-paper)] p-3"
            aria-live="polite"
          >
            <p className="text-sm font-semibold text-[var(--ink)]">
              {fillCount(tr("schedulePreview"), schedule.newDates.length)}
            </p>
            {schedule.duplicateDates.length > 0 ? (
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                {fillCount(tr("existingDatesSkipped"), schedule.duplicateDates.length)}
              </p>
            ) : null}
            {schedule.newDates.length > 0 ? (
              <details className="mt-2">
                <summary className="admin-hit-44 flex cursor-pointer items-center text-sm font-semibold text-[var(--river-blue)]">
                  {tr("reviewDates")}
                </summary>
                <ul className="grid max-h-48 grid-cols-2 gap-x-4 gap-y-1 overflow-y-auto pb-1 text-sm text-[var(--ink-muted)] sm:grid-cols-3">
                  {schedule.newDates.map((date) => (
                    <li key={date}>{formatAdminDateRow(date, localeTag)}</li>
                  ))}
                </ul>
              </details>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          disabled={
            pending ||
            !schedule.ok ||
            schedule.newDates.length === 0 ||
            newCapacity < 1 ||
            newCapacity > 999
          }
          onClick={handleAddDates}
          className="admin-pressable-wide mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--marker-yellow)] px-4 text-sm font-semibold text-[var(--ink)] disabled:opacity-50 sm:w-auto"
        >
          {action === "add" ? <AdminSpinner /> : null}
          {action === "add"
            ? tr("adding")
            : schedule.ok
              ? schedule.newDates.length > 0
                ? fillCount(tr("addDates"), schedule.newDates.length)
                : tr("noNewDates")
              : tr("addDatesEmpty")}
        </button>
        <p className="mt-2 text-xs text-[var(--ink-muted)]">
          {tr("dateFormatHint")}
        </p>
      </div>

      {dates.length > 0 ? (
        <div className="sticky top-[4.75rem] z-10 rounded-2xl bg-[var(--chart-paper)]/95 p-2.5 shadow-[0_10px_30px_-20px_rgba(15,39,64,0.55)] ring-1 ring-[var(--river-blue)]/15 backdrop-blur">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={selectVisibleDates}
              className="admin-pressable min-h-11 rounded-full bg-white px-3 text-sm font-semibold text-[var(--river-blue)] ring-1 ring-[var(--river-blue)]/15 disabled:opacity-50"
            >
              {visibleDates.every((row) => selectedIds.has(row.id))
                ? tr("deselectVisible")
                : tr("selectVisible")}
            </button>
            <p className="mr-auto text-sm font-medium text-[var(--ink-muted)]">
              {fillCount(tr("datesSelected"), selectedIds.size)}
            </p>
            {selectedIds.size > 0 ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => setBulkConfirmOpen(true)}
                className="admin-pressable min-h-11 rounded-full bg-[var(--river-navy)] px-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                {fillCount(tr("removeSelected"), selectedIds.size)}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {error ? (
        <AdminStatusBanner tone="error" message={error} onRetry={() => reloadDates(tourId)} />
      ) : null}
      {success ? <AdminStatusBanner tone="success" message={success} /> : null}

      {loadingTour ? (
        <AdminSkeletonList count={3} />
      ) : (
        <div className="space-y-4">
          {dates.length === 0 ? (
            <div className="rounded-2xl bg-white px-4 py-8 text-center ring-1 ring-[var(--river-blue)]/10">
              <p className="text-sm font-medium text-[var(--ink)]">{tr("noDates")}</p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">{tr("noDatesHint")}</p>
            </div>
          ) : (
            <>
              {dateGroups.map((group) => (
                <section key={group.month}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--river-blue)]">
                    {group.month}
                  </h3>
                  <ul className="space-y-2">
                    {group.rows.map((row) => {
                      const isFull = row.booked_count >= row.capacity;
                      const dirty =
                        capacityDrafts[row.id] != null &&
                        capacityDrafts[row.id] !== row.capacity;
                      return (
                        <li
                          key={row.id}
                          className={`rounded-2xl bg-white px-3 py-3 ring-1 ${
                            selectedIds.has(row.id)
                              ? "ring-2 ring-[var(--river-blue)]"
                              : "ring-[var(--river-blue)]/10"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <label className="flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl hover:bg-[var(--river-blue)]/8">
                              <input
                                type="checkbox"
                                checked={selectedIds.has(row.id)}
                                onChange={() => toggleSelected(row.id)}
                                disabled={pending}
                                className="h-5 w-5 accent-[var(--river-blue)]"
                              />
                              <span className="sr-only">
                                {fillVars(tr("selectDate"), {
                                  date: formatAdminDateRow(row.date, localeTag),
                                })}
                              </span>
                            </label>
                            <div className="min-w-0">
                              <p className="font-semibold text-[var(--ink)]">
                                {formatAdminDateRow(row.date, localeTag)}
                              </p>
                              <p className="text-sm text-[var(--ink-muted)]">
                                {row.booked_count} / {row.capacity} {tr("booked")}
                                {isFull ? ` · ${tr("full")}` : ""}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1.5">
                              <label className="sr-only" htmlFor={`cap-${row.id}`}>
                                {tr("capacity")}
                              </label>
                              <input
                                id={`cap-${row.id}`}
                                type="number"
                                inputMode="numeric"
                                min={row.booked_count}
                                max={999}
                                value={capacityDrafts[row.id] ?? row.capacity}
                                onChange={(e) =>
                                  setCapacityDrafts((prev) => ({
                                    ...prev,
                                    [row.id]: Number(e.target.value),
                                  }))
                                }
                                disabled={pending}
                                className="min-h-11 w-16 rounded-lg border border-[var(--river-blue)]/20 px-2 text-center text-base"
                              />
                              <button
                                type="button"
                                disabled={pending || !dirty}
                                onClick={() => handleCapacitySave(row.id)}
                                className="admin-pressable inline-flex min-h-11 min-w-14 items-center justify-center gap-1 rounded-full bg-[var(--river-blue)] px-3 text-sm font-semibold text-white disabled:opacity-30"
                              >
                                {savingCapId === row.id ? (
                                  <AdminSpinner className="h-3 w-3 text-white" />
                                ) : null}
                                {tr("save")}
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() => handleRemoveClick(row.id)}
                              className="admin-pressable min-h-11 rounded-full px-3 text-sm font-medium text-[var(--river-blue)] hover:bg-[var(--river-blue)]/8 disabled:opacity-50"
                            >
                              {row.booked_count > 0 ? tr("closeDate") : tr("removeDate")}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
              {!showAllDates && dates.length > INITIAL_VISIBLE_DATES ? (
                <button
                  type="button"
                  onClick={() => setShowAllDates(true)}
                  className="admin-pressable-wide min-h-11 w-full rounded-full bg-white text-sm font-semibold text-[var(--river-blue)] ring-1 ring-[var(--river-blue)]/15"
                >
                  {fillCount(tr("showAllDates"), dates.length)}
                </button>
              ) : null}
            </>
          )}
        </div>
      )}
      <AdminConfirmDialog
        open={bulkConfirmOpen}
        title={tr("removeDatesConfirmTitle")}
        message={fillVars(tr("removeDatesConfirm"), {
          removed: selectedEmpty,
          closed: selectedBooked,
        })}
        hint={selectedBooked > 0 ? tr("removeDatesHint") : undefined}
        confirmLabel={fillCount(tr("removeSelected"), selectedIds.size)}
        variant="destructive"
        pending={action === "remove"}
        onCancel={() => {
          if (action !== "remove") setBulkConfirmOpen(false);
        }}
        onConfirm={confirmBulkRemove}
      />
    </div>
  );
}
