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
import {
  AdminSkeletonList,
  AdminSpinner,
  AdminStatusBanner,
} from "./AdminFeedback";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import { AdminDateInput } from "./AdminDateInput";
import { formatAdminDateRow } from "@/lib/admin-date-input";

type DateConfirm =
  | { kind: "close"; dateId: string }
  | { kind: "remove"; dateId: string }
  | null;

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
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingTour, setLoadingTour] = useState(false);
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<"add" | "reload" | "close" | "remove" | null>(
    null,
  );
  const [dateConfirm, setDateConfirm] = useState<DateConfirm>(null);

  const localeTag = locale === "th" ? "th-TH" : "en-GB";
  const dates = useMemo(() => datesByTour[tourId] ?? [], [datesByTour, tourId]);

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

  function handleAddDate() {
    setError(null);
    setSuccess(null);
    if (!newDate) {
      setError(tr("dateInvalid"));
      return;
    }
    setAction("add");
    startTransition(async () => {
      const result = await addTourDate({
        tourId,
        date: newDate,
        capacity: newCapacity,
      });
      setAction(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setNewDate("");
      setSuccess(tr("saved"));
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

  function handleRemoveClick(id: string, bookedCount: number) {
    if (bookedCount > 0) {
      setDateConfirm({ kind: "close", dateId: id });
      return;
    }
    setDateConfirm({ kind: "remove", dateId: id });
  }

  function confirmDateAction() {
    if (!dateConfirm) return;
    setError(null);
    setSuccess(null);

    if (dateConfirm.kind === "close") {
      setAction("close");
      startTransition(async () => {
        const closed = await closeTourDate({ id: dateConfirm.dateId });
        setAction(null);
        setDateConfirm(null);
        if (!closed.ok) setError(closed.error);
        else {
          setSuccess(tr("saved"));
          reloadDates(tourId);
        }
      });
      return;
    }

    setAction("remove");
    startTransition(async () => {
      const result = await removeTourDate({ id: dateConfirm.dateId, force: true });
      setAction(null);
      setDateConfirm(null);
      if (!result.ok) setError(result.error);
      else {
        setSuccess(tr("saved"));
        reloadDates(tourId);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-[var(--ink)]">{tr("selectTour")}</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tours.map((tour) => {
            const shortLabel = tour.name.replace(/→/g, "→\n").split("\n")[0]?.trim() ?? tour.from;
            return (
              <button
                key={tour.id}
                type="button"
                onClick={() => setTourId(tour.id)}
                className={`flex shrink-0 flex-col items-start rounded-xl px-3.5 py-2 text-left transition ${
                  tourId === tour.id
                    ? "bg-[var(--river-blue)] text-white"
                    : "bg-white text-[var(--ink-muted)] ring-1 ring-[var(--river-blue)]/15"
                }`}
              >
                <span className="text-sm font-medium leading-tight">{shortLabel}</span>
                <span className={`text-xs leading-tight ${tourId === tour.id ? "text-white/70" : "text-[var(--ink-muted)]"}`}>
                  {tour.duration}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 ring-1 ring-[var(--river-blue)]/10">
        <p className="text-sm font-medium text-[var(--ink)]">{tr("addDate")}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <AdminDateInput
            value={newDate}
            onChange={setNewDate}
            disabled={pending}
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
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--marker-yellow)] px-4 text-sm font-semibold text-[var(--ink)] disabled:opacity-50"
          >
            {action === "add" ? <AdminSpinner /> : null}
            {action === "add" ? tr("adding") : tr("addDate")}
          </button>
        </div>
      </div>

      {error ? (
        <AdminStatusBanner tone="error" message={error} onRetry={() => reloadDates(tourId)} />
      ) : null}
      {success ? <AdminStatusBanner tone="success" message={success} /> : null}

      {loadingTour ? (
        <AdminSkeletonList count={3} />
      ) : (
        <ul className="space-y-2">
          {dates.length === 0 ? (
            <li className="rounded-2xl bg-white px-4 py-8 text-center ring-1 ring-[var(--river-blue)]/10">
              <p className="text-sm font-medium text-[var(--ink)]">{tr("noDates")}</p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">{tr("noDatesHint")}</p>
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
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--ink)]">
                        {formatAdminDateRow(row.date, localeTag)}
                      </p>
                      <p className="text-sm text-[var(--ink-muted)]">
                        {row.booked_count} / {row.capacity} {tr("booked")}
                        {isFull ? ` · ${tr("full")}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="sr-only" htmlFor={`cap-${row.id}`}>
                        {tr("capacity")}
                      </label>
                      <input
                        id={`cap-${row.id}`}
                        type="number"
                        min={row.booked_count}
                        max={999}
                        value={capacityDrafts[row.id] ?? row.capacity}
                        onChange={(e) =>
                          setCapacityDrafts((prev) => ({ ...prev, [row.id]: Number(e.target.value) }))
                        }
                        disabled={pending}
                        className="min-h-11 w-20 rounded-lg border border-[var(--river-blue)]/20 px-2 py-1.5 text-center text-sm"
                      />
                      {capacityDrafts[row.id] != null && capacityDrafts[row.id] !== row.capacity ? (
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => handleCapacitySave(row.id)}
                          className="inline-flex min-h-9 items-center gap-1 rounded-full bg-[var(--river-blue)] px-3 text-xs font-semibold text-white disabled:opacity-50"
                        >
                          {savingCapId === row.id ? <AdminSpinner className="h-3 w-3 text-white" /> : null}
                          {tr("save")}
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => handleRemoveClick(row.id, row.booked_count)}
                      className="min-h-10 rounded-full px-3 text-sm font-medium text-[var(--river-blue)] hover:bg-[var(--river-blue)]/8 disabled:opacity-50"
                    >
                      {row.booked_count > 0 ? tr("closeDate") : tr("removeDate")}
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      )}
      <AdminConfirmDialog
        open={dateConfirm?.kind === "close"}
        title={tr("closeDateConfirmTitle")}
        message={tr("hasBookingsWarning")}
        hint={tr("closeDateHint")}
        confirmLabel={tr("closeDate")}
        variant="primary"
        pending={action === "close"}
        onCancel={() => {
          if (action !== "close") setDateConfirm(null);
        }}
        onConfirm={confirmDateAction}
      />
      <AdminConfirmDialog
        open={dateConfirm?.kind === "remove"}
        title={tr("removeDateConfirmTitle")}
        message={tr("removeDateConfirm")}
        confirmLabel={tr("removeDate")}
        variant="destructive"
        pending={action === "remove"}
        onCancel={() => {
          if (action !== "remove") setDateConfirm(null);
        }}
        onConfirm={confirmDateAction}
      />
    </div>
  );
}
