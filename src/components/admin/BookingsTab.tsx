"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { tours } from "@/lib/tours";
import type { DbBooking, BookingStatus } from "@/lib/db/types";
import { fetchAdminBookings, updateBooking, markBookingRefunded } from "@/lib/actions/admin";
import { useAdminLocale } from "./AdminLocaleProvider";
import { StatusChip } from "./StatusChip";
import { IconClose } from "@/components/icons";

type Filter = "all" | "pending" | "upcoming";

function formatDisplayDate(iso: string, locale: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function tourName(id: string) {
  return tours.find((t) => t.id === id)?.name ?? id;
}

export function BookingsTab({ initialBookings }: { initialBookings: DbBooking[] }) {
  const { locale, tr } = useAdminLocale();
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState<Filter>("pending");
  const [selected, setSelected] = useState<DbBooking | null>(null);
  const [status, setStatus] = useState<BookingStatus>("pending");
  const [notes, setNotes] = useState("");
  const [refundNote, setRefundNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const localeTag = locale === "th" ? "th-TH" : "en-GB";
  const today = new Date().toISOString().slice(0, 10);

  const filtered = useMemo(() => {
    const sorted = [...bookings].sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (b.status === "pending" && a.status !== "pending") return 1;
      return b.created_at.localeCompare(a.created_at);
    });

    if (filter === "pending") {
      return sorted.filter((b) => b.status === "pending");
    }
    if (filter === "upcoming") {
      return sorted.filter(
        (b) =>
          b.travel_date >= today &&
          (b.status === "pending" || b.status === "confirmed"),
      );
    }
    return sorted;
  }, [bookings, filter, today]);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  useEffect(() => {
    if (!selected) return;
    setStatus(selected.status);
    setNotes(selected.internal_notes);
    setRefundNote(selected.refund_note);
    setMessage(null);
  }, [selected]);

  function refresh() {
    startTransition(async () => {
      const result = await fetchAdminBookings();
      if (result.ok && result.data) setBookings(result.data);
    });
  }

  function saveBooking() {
    if (!selected) return;
    startTransition(async () => {
      const result = await updateBooking({
        id: selected.id,
        status,
        internalNotes: notes,
        refundNote,
      });
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setMessage(tr("saved"));
      refresh();
      setSelected((prev) =>
        prev
          ? {
              ...prev,
              status,
              internal_notes: notes,
              refund_note: refundNote,
            }
          : null,
      );
    });
  }

  function refundBooking() {
    if (!selected) return;
    if (!window.confirm(tr("refundConfirm"))) return;
    startTransition(async () => {
      const result = await markBookingRefunded({
        id: selected.id,
        refundNote,
      });
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setStatus("refunded");
      setMessage(tr("saved"));
      refresh();
    });
  }

  const filters: { id: Filter; label: string; badge?: number }[] = [
    { id: "pending", label: tr("filterPending"), badge: pendingCount || undefined },
    { id: "upcoming", label: tr("upcoming") },
    { id: "all", label: tr("all") },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition ${
              filter === f.id
                ? "bg-[var(--river-blue)] text-white"
                : "bg-white text-[var(--ink-muted)] ring-1 ring-[var(--river-blue)]/15 hover:text-[var(--ink)]"
            }`}
          >
            {f.label}
            {f.badge ? (
              <span className="rounded-full bg-[var(--marker-yellow)] px-1.5 py-0.5 text-xs font-bold text-[var(--ink)]">
                {f.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white px-5 py-10 text-center ring-1 ring-[var(--river-blue)]/10">
          <p className="font-medium text-[var(--ink)]">{tr("noBookings")}</p>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">{tr("noBookingsHint")}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((booking) => (
            <li key={booking.id}>
              <button
                type="button"
                onClick={() => setSelected(booking)}
                className="w-full rounded-2xl bg-white px-4 py-3.5 text-left ring-1 ring-[var(--river-blue)]/10 transition hover:ring-[var(--river-blue)]/25"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--ink)]">
                      {booking.guest_name}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-[var(--ink-muted)]">
                      {tourName(booking.tour_id)}
                    </p>
                  </div>
                  <StatusChip status={booking.status} locale={locale} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[var(--ink-muted)]">
                  <span>{formatDisplayDate(booking.travel_date, localeTag)}</span>
                  <span>
                    {booking.passengers}{" "}
                    {booking.passengers === 1 ? tr("passenger") : tr("passengers")}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <button
            type="button"
            aria-label={tr("cancel")}
            className="absolute inset-0 bg-[var(--river-navy)]/50"
            onClick={() => setSelected(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-[var(--chart-paper)] shadow-[0_24px_60px_-12px_rgba(15,39,64,0.35)] sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[var(--river-blue)]/15 px-4 py-3">
              <div>
                <p className="text-lg font-semibold text-[var(--ink)]">
                  {selected.guest_name}
                </p>
                <p className="text-sm text-[var(--ink-muted)]">{selected.guest_email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full p-2 text-[var(--ink-muted)] hover:bg-[var(--river-blue)]/8"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-[var(--ink-muted)]">{tr("tours")}</dt>
                  <dd className="font-medium">{tourName(selected.tour_id)}</dd>
                </div>
                <div>
                  <dt className="text-[var(--ink-muted)]">{tr("dates")}</dt>
                  <dd className="font-medium">
                    {formatDisplayDate(selected.travel_date, localeTag)}
                  </dd>
                </div>
              </dl>

              <div>
                <p className="mb-2 text-sm font-medium">{tr("status")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["pending", "confirmed", "cancelled", "refunded"] as const).map(
                    (value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setStatus(value)}
                        className={`min-h-10 rounded-xl px-3 text-sm font-medium transition ${
                          status === value
                            ? "bg-[var(--river-blue)] text-white"
                            : "bg-white ring-1 ring-[var(--river-blue)]/15 text-[var(--ink-muted)]"
                        }`}
                      >
                        {tr(value)}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="admin-notes" className="mb-1.5 block text-sm font-medium">
                  {tr("notes")}
                </label>
                <textarea
                  id="admin-notes"
                  rows={3}
                  maxLength={500}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={tr("notesPlaceholder")}
                  className="w-full rounded-xl border border-[var(--river-blue)]/20 bg-white px-3 py-2.5 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
                />
              </div>

              <div>
                <label htmlFor="refund-note" className="mb-1.5 block text-sm font-medium">
                  {tr("refundNote")}
                </label>
                <textarea
                  id="refund-note"
                  rows={2}
                  maxLength={500}
                  value={refundNote}
                  onChange={(e) => setRefundNote(e.target.value)}
                  className="w-full rounded-xl border border-[var(--river-blue)]/20 bg-white px-3 py-2.5 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
                />
              </div>

              {message ? (
                <p className="text-sm text-[var(--river-blue-deep)]" role="status">
                  {message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 border-t border-[var(--river-blue)]/15 px-4 py-3">
              {selected.status !== "refunded" ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={refundBooking}
                  className="min-h-11 rounded-full bg-[var(--river-navy)]/10 px-4 text-sm font-semibold text-[var(--river-navy)] hover:bg-[var(--river-navy)]/15 disabled:opacity-50"
                >
                  {tr("refund")}
                </button>
              ) : null}
              <button
                type="button"
                disabled={pending}
                onClick={saveBooking}
                className="min-h-11 rounded-full bg-[var(--river-blue)] px-4 text-sm font-semibold text-white hover:bg-[var(--river-blue-deep)] disabled:opacity-50"
              >
                {tr("save")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
