"use client";

import { useMemo, useState, useTransition } from "react";
import { tours } from "@/lib/tours";
import type { DbTourDate } from "@/lib/db/types";
import {
  addTourDate,
  closeTourDate,
  fetchAdminTourDates,
  removeTourDate,
  updateTourDateCapacity,
} from "@/lib/actions/admin";
import { useAdminLocale } from "./AdminLocaleProvider";

function formatDate(iso: string, locale: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function DatesTab({
  initialDatesByTour,
}: {
  initialDatesByTour: Record<string, DbTourDate[]>;
}) {
  const { locale, tr } = useAdminLocale();
  const [tourId, setTourId] = useState(tours[0]?.id ?? "");
  const [datesByTour, setDatesByTour] = useState(initialDatesByTour);
  const [newDate, setNewDate] = useState("");
  const [newCapacity, setNewCapacity] = useState(20);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const localeTag = locale === "th" ? "th-TH" : "en-GB";
  const dates = useMemo(() => datesByTour[tourId] ?? [], [datesByTour, tourId]);

  function reloadDates(id: string) {
    startTransition(async () => {
      const result = await fetchAdminTourDates(id);
      if (result.ok && result.data) {
        setDatesByTour((prev) => ({ ...prev, [id]: result.data! }));
      }
    });
  }

  function handleAddDate() {
    setError(null);
    startTransition(async () => {
      const result = await addTourDate({
        tourId,
        date: newDate,
        capacity: newCapacity,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setNewDate("");
      reloadDates(tourId);
    });
  }

  function handleCapacityChange(id: string, capacity: number) {
    startTransition(async () => {
      const result = await updateTourDateCapacity({ id, capacity });
      if (!result.ok) setError(result.error);
      else reloadDates(tourId);
    });
  }

  function handleRemove(id: string, bookedCount: number) {
    if (bookedCount > 0) {
      const ok = window.confirm(tr("hasBookingsWarning"));
      if (!ok) return;
      startTransition(async () => {
        const closed = await closeTourDate({ id });
        if (!closed.ok) setError(closed.error);
        else reloadDates(tourId);
      });
      return;
    }
    if (!window.confirm(tr("removeDateConfirm"))) return;
    startTransition(async () => {
      const result = await removeTourDate({ id, force: true });
      if (!result.ok) setError(result.error);
      else reloadDates(tourId);
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-[var(--ink)]">{tr("selectTour")}</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tours.map((tour) => (
            <button
              key={tour.id}
              type="button"
              onClick={() => setTourId(tour.id)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                tourId === tour.id
                  ? "bg-[var(--river-blue)] text-white"
                  : "bg-white text-[var(--ink-muted)] ring-1 ring-[var(--river-blue)]/15"
              }`}
            >
              {tour.from}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 ring-1 ring-[var(--river-blue)]/10">
        <p className="text-sm font-medium text-[var(--ink)]">{tr("addDate")}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="min-h-11 w-full rounded-xl border border-[var(--river-blue)]/20 px-3 text-base"
          />
          <input
            type="number"
            min={1}
            max={999}
            value={newCapacity}
            onChange={(e) => setNewCapacity(Number(e.target.value))}
            aria-label={tr("capacity")}
            className="min-h-11 w-full rounded-xl border border-[var(--river-blue)]/20 px-3 text-base sm:w-24"
          />
          <button
            type="button"
            disabled={pending || !newDate}
            onClick={handleAddDate}
            className="min-h-11 rounded-full bg-[var(--marker-yellow)] px-4 text-sm font-semibold text-[var(--ink)] disabled:opacity-50"
          >
            {tr("addDate")}
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-[var(--river-blue-deep)]" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="space-y-2">
        {dates.length === 0 ? (
          <li className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-[var(--ink-muted)] ring-1 ring-[var(--river-blue)]/10">
            {tr("addDate")}
          </li>
        ) : (
          dates.map((row) => {
            const isFull = row.booked_count >= row.capacity;
            return (
              <li
                key={row.id}
                className="rounded-2xl bg-white px-4 py-3 ring-1 ring-[var(--river-blue)]/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">
                      {formatDate(row.date, localeTag)}
                    </p>
                    <p className="text-sm text-[var(--ink-muted)]">
                      {row.booked_count} / {row.capacity} {tr("booked")}
                      {isFull ? ` · ${tr("full")}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="sr-only" htmlFor={`cap-${row.id}`}>
                      {tr("capacity")}
                    </label>
                    <input
                      id={`cap-${row.id}`}
                      type="number"
                      min={row.booked_count}
                      max={999}
                      defaultValue={row.capacity}
                      onBlur={(e) =>
                        handleCapacityChange(row.id, Number(e.target.value))
                      }
                      className="w-16 rounded-lg border border-[var(--river-blue)]/20 px-2 py-1.5 text-center text-sm"
                    />
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => handleRemove(row.id, row.booked_count)}
                    className="min-h-9 rounded-full px-3 text-sm font-medium text-[var(--river-blue)] hover:bg-[var(--river-blue)]/8"
                  >
                    {row.booked_count > 0 ? tr("closeDate") : tr("removeDate")}
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
