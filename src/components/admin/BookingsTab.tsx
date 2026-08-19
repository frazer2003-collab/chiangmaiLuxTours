"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { tours } from "@/lib/tours";
import type { DbBooking, BookingStatus, GuestGender } from "@/lib/db/types";
import { getBookingPassengers } from "@/lib/booking-passengers";
import { fetchAdminBookings, updateBooking, markBookingRefunded } from "@/lib/actions/admin";
import { useAdminLocale } from "./AdminLocaleProvider";
import { StatusChip } from "./StatusChip";
import { IconClose } from "@/components/icons";
import {
  AdminSkeletonList,
  AdminSpinner,
  AdminStatusBanner,
} from "./AdminFeedback";
import { AdminConfirmDialog } from "./AdminConfirmDialog";

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

function adminGenderLabel(
  tr: (key: import("./i18n").TranslationKey) => string,
  gender: GuestGender | undefined,
): string {
  if (gender === "male") return tr("genderMale");
  if (gender === "female") return tr("genderFemale");
  if (gender === "na") return tr("genderNa");
  return "—";
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
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<"save" | "refund" | null>(null);
  const [refundConfirmOpen, setRefundConfirmOpen] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const localeTag = locale === "th" ? "th-TH" : "en-GB";
  const today = new Date().toISOString().slice(0, 10);

  type BookingGroup = { label: string; items: DbBooking[] };

  const { groups, flatFiltered } = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const tomorrowIso = tomorrow.toISOString().slice(0, 10);
    const nextWeekIso = nextWeek.toISOString().slice(0, 10);

    const base = [...bookings];

    const applyFilter = (list: DbBooking[]) => {
      if (filter === "pending") return list.filter((b) => b.status === "pending");
      if (filter === "upcoming")
        return list.filter(
          (b) => b.travel_date >= today && (b.status === "pending" || b.status === "confirmed"),
        );
      return list;
    };

    const pool = applyFilter(base);

    const urgencySort = (a: DbBooking, b: DbBooking) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (b.status === "pending" && a.status !== "pending") return 1;
      return a.travel_date.localeCompare(b.travel_date);
    };

    const todayGroup = pool.filter((b) => b.travel_date === today).sort(urgencySort);
    const nextGroup = pool
      .filter((b) => b.travel_date >= tomorrowIso && b.travel_date < nextWeekIso)
      .sort(urgencySort);
    const laterGroup = pool
      .filter((b) => b.travel_date >= nextWeekIso)
      .sort(urgencySort);
    const pastGroup = pool
      .filter((b) => b.travel_date < today)
      .sort((a, b) => b.travel_date.localeCompare(a.travel_date));

    const result: BookingGroup[] = [];
    if (todayGroup.length) result.push({ label: tr("groupToday"), items: todayGroup });
    if (nextGroup.length) result.push({ label: tr("groupNextDepartures"), items: nextGroup });
    if (laterGroup.length) result.push({ label: tr("groupLater"), items: laterGroup });
    if (pastGroup.length) result.push({ label: tr("groupPast"), items: pastGroup });

    return { groups: result, flatFiltered: pool };
  }, [bookings, filter, today, tr]);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  useEffect(() => {
    if (!selected) return;
    setStatus(selected.status);
    setNotes(selected.internal_notes);
    setRefundNote(selected.refund_note);
    setMessage(null);
  }, [selected]);

  function refresh(options?: { showSkeleton?: boolean }) {
    const showSkeleton = options?.showSkeleton ?? true;
    setFetchError(null);
    if (showSkeleton) setRefreshing(true);
    startTransition(async () => {
      const result = await fetchAdminBookings();
      if (showSkeleton) setRefreshing(false);
      if (result.ok && result.data) {
        setBookings(result.data);
        setLastRefreshed(new Date());
        return;
      }
      setFetchError(!result.ok ? result.error : tr("errorRetry"));
    });
  }

  function saveBooking() {
    if (!selected) return;
    setAction("save");
    startTransition(async () => {
      const result = await updateBooking({
        id: selected.id,
        status,
        internalNotes: notes,
        refundNote,
      });
      setAction(null);
      if (!result.ok) {
        setMessageTone("error");
        setMessage(result.error);
        return;
      }
      setMessageTone("success");
      setMessage(tr("saved"));
      refresh({ showSkeleton: false });
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
    setAction("refund");
    startTransition(async () => {
      const result = await markBookingRefunded({
        id: selected.id,
        refundNote,
      });
      setAction(null);
      setRefundConfirmOpen(false);
      if (!result.ok) {
        setMessageTone("error");
        setMessage(result.error);
        return;
      }
      setStatus("refunded");
      setMessageTone("success");
      setMessage(tr("saved"));
      refresh({ showSkeleton: false });
    });
  }

  const filters: { id: Filter; label: string; badge?: number }[] = [
    { id: "pending", label: tr("filterPending"), badge: pendingCount || undefined },
    { id: "upcoming", label: tr("upcoming") },
    { id: "all", label: tr("all") },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
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
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--ink-muted)]">
            {lastRefreshed.toLocaleTimeString(localeTag, { hour: "2-digit", minute: "2-digit" })}
          </span>
          <button
            type="button"
            onClick={() => refresh()}
            disabled={refreshing || pending}
            className="inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 text-sm font-medium text-[var(--river-blue)] ring-1 ring-[var(--river-blue)]/15 hover:bg-[var(--river-blue)]/8 disabled:opacity-50"
          >
            {refreshing ? <AdminSpinner className="h-4 w-4" /> : null}
            {refreshing ? tr("refreshing") : tr("refreshList")}
          </button>
        </div>
      </div>

      {fetchError ? (
        <AdminStatusBanner tone="error" message={fetchError} onRetry={refresh} />
      ) : null}

      {refreshing ? (
        <AdminSkeletonList count={3} />
      ) : flatFiltered.length === 0 ? (
        <div className="rounded-2xl bg-white px-5 py-10 text-center ring-1 ring-[var(--river-blue)]/10">
          <p className="font-medium text-[var(--ink)]">{tr("noBookings")}</p>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">{tr("noBookingsHint")}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map((group) => (
            <section key={group.label}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--river-blue)]">
                {group.label}
              </h3>
              <ul className="space-y-2">
                {group.items.map((booking) => (
                  <li key={booking.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(booking)}
                      className={`w-full rounded-2xl bg-white px-4 py-3.5 text-left ring-1 transition hover:ring-[var(--river-blue)]/25 ${
                        booking.status === "pending" && booking.travel_date <= today
                          ? "ring-[var(--marker-yellow)]/60"
                          : "ring-[var(--river-blue)]/10"
                      }`}
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
            </section>
          ))}
        </div>
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
            aria-busy={pending}
            aria-modal="true"
            role="dialog"
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
                <div>
                  <dt className="text-[var(--ink-muted)]">{tr("passengers")}</dt>
                  <dd className="font-medium">{selected.passengers}</dd>
                </div>
                <div>
                  <dt className="text-[var(--ink-muted)]">{tr("email")}</dt>
                  <dd className="font-medium break-all">{selected.guest_email}</dd>
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
                  rows={2}
                  maxLength={500}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={tr("notesPlaceholder")}
                  className="w-full rounded-xl border border-[var(--river-blue)]/20 bg-white px-3 py-2.5 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
                />
              </div>

              {(status === "refunded" || selected.status === "refunded" || selected.refund_note) ? (
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
              ) : null}

              <details className="group rounded-2xl bg-white ring-1 ring-[var(--river-blue)]/10">
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-[var(--ink)] marker:content-none [&::-webkit-details-marker]:hidden">
                  {tr("guestDetails")} · {selected.passengers} {selected.passengers === 1 ? tr("passenger") : tr("passengers")}
                  <svg className="h-4 w-4 shrink-0 text-[var(--river-blue)] transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </summary>
                <div className="space-y-3 px-4 pb-4">
                  {getBookingPassengers(selected).map((passenger, index) => (
                    <div
                      key={index}
                      className="rounded-xl bg-[var(--chart-paper)] p-3"
                    >
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--river-blue)]">
                        {tr("passengerNumber").replace("{n}", String(index + 1))}
                        {index === 0 ? " · Lead" : ""}
                      </p>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <dt className="text-[var(--ink-muted)]">{tr("familyName")}</dt>
                          <dd className="font-medium">{passenger.family_name || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-[var(--ink-muted)]">{tr("givenName")}</dt>
                          <dd className="font-medium">{passenger.given_name || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-[var(--ink-muted)]">{tr("gender")}</dt>
                          <dd className="font-medium">{adminGenderLabel(tr, passenger.gender)}</dd>
                        </div>
                        <div>
                          <dt className="text-[var(--ink-muted)]">{tr("nationality")}</dt>
                          <dd className="font-medium">{passenger.nationality || "—"}</dd>
                        </div>
                        <div className="col-span-2">
                          <dt className="text-[var(--ink-muted)]">{tr("idNumber")}</dt>
                          <dd className="font-medium break-all">{passenger.id_number || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-[var(--ink-muted)]">{tr("dateOfBirth")}</dt>
                          <dd className="font-medium">
                            {passenger.date_of_birth
                              ? formatDisplayDate(passenger.date_of_birth, localeTag)
                              : "—"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  ))}
                </div>
              </details>

              {message ? (
                <AdminStatusBanner
                  tone={messageTone}
                  message={message}
                />
              ) : null}
            </div>

            <div className="flex flex-col gap-2 border-t border-[var(--river-blue)]/15 px-4 py-3">
              {selected.status !== "refunded" ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setRefundConfirmOpen(true)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--river-navy)]/10 px-4 text-sm font-semibold text-[var(--river-navy)] hover:bg-[var(--river-navy)]/15 disabled:opacity-50"
                >
                  {action === "refund" ? <AdminSpinner /> : null}
                  {action === "refund" ? tr("saving") : tr("refund")}
                </button>
              ) : null}
              <button
                type="button"
                disabled={pending}
                onClick={saveBooking}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--river-blue)] px-4 text-sm font-semibold text-white hover:bg-[var(--river-blue-deep)] disabled:opacity-50"
              >
                {action === "save" ? <AdminSpinner className="h-4 w-4 text-white" /> : null}
                {action === "save" ? tr("saving") : tr("save")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AdminConfirmDialog
        open={refundConfirmOpen}
        title={tr("refundConfirmTitle")}
        message={tr("refundConfirm")}
        confirmLabel={tr("refund")}
        variant="destructive"
        pending={action === "refund"}
        onCancel={() => {
          if (action !== "refund") setRefundConfirmOpen(false);
        }}
        onConfirm={refundBooking}
      />
    </div>
  );
}
