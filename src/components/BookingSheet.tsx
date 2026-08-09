"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { IconClose } from "./icons";
import { useCatalogTours } from "@/components/booking/BookingProvider";
import { getTourFromCatalog } from "@/lib/tour-catalog";
import { submitBooking } from "@/lib/actions/booking";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  validateDate,
  validateEmail,
  validateName,
} from "@/lib/booking-validation";
import type { BookingStep } from "@/lib/types";

type Props = {
  open: boolean;
  tourId: string | null;
  onClose: () => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

const steps: BookingStep[] = ["tour", "date", "details", "payment", "confirmed"];
const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function BookingSheet({ open, tourId, onClose, returnFocusRef }: Props) {
  const catalog = useCatalogTours();
  const tour = tourId ? getTourFromCatalog(catalog, tourId) : undefined;
  const liveBooking = isSupabaseConfigured();
  const allowedDates = tour?.demoDates ?? [];
  const dateAvailability = tour?.availableDates ?? [];

  const [step, setStep] = useState<BookingStep>("tour");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const dateErrorId = useId();
  const nameErrorId = useId();
  const emailErrorId = useId();
  const continueHintId = useId();

  const maxPassengers = useMemo(() => {
    const slot = dateAvailability.find((d) => d.date === date);
    const spots = slot?.spotsLeft ?? 6;
    return Math.min(6, Math.max(1, spots));
  }, [date, dateAvailability]);

  useEffect(() => {
    if (passengers > maxPassengers) {
      setPassengers(maxPassengers);
    }
  }, [maxPassengers, passengers]);

  useEffect(() => {
    if (open && tourId) {
      setStep("date");
      setDate("");
      setPassengers(1);
      setName("");
      setEmail("");
      setShowErrors(false);
      setSubmitError(null);
      setSubmitting(false);
    }
  }, [open, tourId]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current =
      returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    function getFocusableElements() {
      if (!dialogRef.current) return [] as HTMLElement[];
      return Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      const target = returnFocusRef?.current ?? previouslyFocused.current;
      target?.focus?.();
    };
  }, [open, handleClose, returnFocusRef]);

  const stepIndex = steps.indexOf(step);

  const dateError =
    showErrors && step === "date" ? validateDate(date, allowedDates) : null;
  const nameError =
    showErrors && step === "details" ? validateName(name) : null;
  const emailError =
    showErrors && step === "details" ? validateEmail(email) : null;

  const canContinue = useMemo(() => {
    if (step === "date") return !validateDate(date, allowedDates);
    if (step === "details") {
      return !validateName(name) && !validateEmail(email);
    }
    return true;
  }, [step, date, name, email, allowedDates]);

  const continueHint = useMemo(() => {
    if (canContinue || step === "confirmed" || step === "payment") return null;
    if (step === "date") return validateDate(date, allowedDates);
    if (step === "details") {
      return validateName(name) ?? validateEmail(email);
    }
    return null;
  }, [canContinue, step, date, name, email, allowedDates]);

  if (!open || !tour) return null;

  async function completeBooking() {
    if (!tour) return;
    setSubmitting(true);
    setSubmitError(null);

    const result = await submitBooking({
      tourId: tour.id,
      date,
      passengers,
      name,
      email,
      allowedDates,
    });

    setSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    setStep("confirmed");
  }

  function next() {
    if (!tour) return;
    if (step === "date") {
      if (validateDate(date, allowedDates)) {
        setShowErrors(true);
        return;
      }
      setShowErrors(false);
      setStep("details");
      return;
    }
    if (step === "details") {
      if (validateName(name) || validateEmail(email)) {
        setShowErrors(true);
        return;
      }
      setShowErrors(false);
      setStep("payment");
      return;
    }
    if (step === "payment") {
      void completeBooking();
    }
  }

  function back() {
    setShowErrors(false);
    setSubmitError(null);
    if (step === "details") setStep("date");
    else if (step === "payment") setStep("details");
  }

  const passengerOptions = Array.from({ length: maxPassengers }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close booking"
        className="absolute inset-0 bg-[var(--river-navy)]/55 backdrop-blur-[2px]"
        onClick={handleClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.25rem] bg-[var(--chart-paper)] shadow-[0_24px_60px_-12px_rgba(15,39,64,0.35)] sm:rounded-[1.25rem]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--river-blue)]/15 px-5 py-4">
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-chart)] text-xs uppercase tracking-[0.18em] text-[var(--river-blue)]">
              Chart booking · Step {Math.min(stepIndex + 1, 4)} of 4
            </p>
            <h2
              id="booking-title"
              className="mt-1 text-lg font-semibold text-[var(--ink)]"
            >
              {tour.name}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Close booking"
            className="rounded-full p-2.5 text-[var(--ink-muted)] transition hover:bg-[var(--river-blue)]/8 hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === "date" && (
            <div className="space-y-4">
              {allowedDates.length === 0 ? (
                <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
                  No departure dates are open for this route right now. Contact us by phone or
                  email to enquire.
                </p>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
                    {liveBooking
                      ? "Choose an available departure. Seats update in real time."
                      : "Demo dates only — connect Supabase admin for live availability."}
                  </p>
                  <fieldset>
                    <legend className="mb-2 text-sm font-medium text-[var(--ink)]">
                      Departure date
                    </legend>
                    <div
                      className="grid gap-2"
                      role="radiogroup"
                      aria-invalid={dateError ? true : undefined}
                      aria-describedby={dateError ? dateErrorId : undefined}
                    >
                      {allowedDates.map((d) => {
                        const slot = dateAvailability.find((s) => s.date === d);
                        const spots = slot?.spotsLeft;
                        return (
                          <label
                            key={d}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                              date === d
                                ? "border-[var(--marker-yellow)] bg-[var(--marker-yellow)]/15 font-medium"
                                : "border-[var(--river-blue)]/20 bg-white hover:border-[var(--river-blue)]/40"
                            }`}
                          >
                            <span>
                              {new Date(d + "T12:00:00").toLocaleDateString("en-GB", {
                                weekday: "short",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                            {spots != null ? (
                              <span className="text-xs text-[var(--ink-muted)]">
                                {spots} left
                              </span>
                            ) : null}
                            <input
                              type="radio"
                              name="date"
                              value={d}
                              checked={date === d}
                              onChange={() => {
                                setDate(d);
                                setShowErrors(false);
                              }}
                              className="sr-only"
                            />
                          </label>
                        );
                      })}
                    </div>
                    {dateError && (
                      <p
                        id={dateErrorId}
                        role="alert"
                        className="mt-2 text-sm text-[var(--river-blue-deep)]"
                      >
                        {dateError}
                      </p>
                    )}
                  </fieldset>
                </>
              )}
            </div>
          )}

          {step === "details" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="passengers" className="mb-1.5 block text-sm font-medium">
                  Passengers
                </label>
                <select
                  id="passengers"
                  value={passengers}
                  onChange={(e) =>
                    setPassengers(Math.min(maxPassengers, Math.max(1, Number(e.target.value))))
                  }
                  className="w-full rounded-xl border border-[var(--river-blue)]/25 bg-white px-3 py-2.5 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
                >
                  {passengerOptions.map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "passenger" : "passengers"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (showErrors) setShowErrors(false);
                  }}
                  aria-invalid={nameError ? true : undefined}
                  aria-describedby={nameError ? nameErrorId : undefined}
                  className="w-full rounded-xl border border-[var(--river-blue)]/25 bg-white px-3 py-2.5 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
                />
                {nameError && (
                  <p id={nameErrorId} role="alert" className="mt-1.5 text-sm text-[var(--river-blue-deep)]">
                    {nameError}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Email for confirmation
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (showErrors) setShowErrors(false);
                  }}
                  aria-invalid={emailError ? true : undefined}
                  aria-describedby={emailError ? emailErrorId : undefined}
                  className="w-full rounded-xl border border-[var(--river-blue)]/25 bg-white px-3 py-2.5 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
                />
                {emailError && (
                  <p id={emailErrorId} role="alert" className="mt-1.5 text-sm text-[var(--river-blue-deep)]">
                    {emailError}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-dashed border-[var(--river-blue)]/35 bg-white p-4">
                <p className="text-sm font-medium text-[var(--ink)]">Payment placeholder</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                  No charge is processed in this version. When payment goes live, full amount will
                  be collected here. Listed price: {tour.price}
                </p>
              </div>
              <dl className="space-y-2 rounded-xl bg-[var(--river-blue)]/6 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--ink-muted)]">Route</dt>
                  <dd className="text-right font-medium">{tour.route}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--ink-muted)]">Date</dt>
                  <dd className="font-medium">{date}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--ink-muted)]">Passengers</dt>
                  <dd className="font-medium">{passengers}</dd>
                </div>
              </dl>
              {submitError ? (
                <p className="text-sm text-[var(--river-blue-deep)]" role="alert">
                  {submitError}
                </p>
              ) : null}
            </div>
          )}

          {step === "confirmed" && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--marker-yellow)] text-[var(--ink)]">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[var(--ink)]">Booking recorded</h3>
              <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
                {liveBooking ? (
                  <>
                    Your request is saved. Confirmation email to{" "}
                    <strong className="text-[var(--ink)]">{email}</strong> will follow when
                    transactional email is connected.
                  </>
                ) : (
                  <>
                    Placeholder confirmation — email to{" "}
                    <strong className="text-[var(--ink)]">{email}</strong> will be sent when
                    booking storage is connected.
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-[var(--river-blue)]/15 px-5 py-4">
          {continueHint && (
            <p id={continueHintId} className="text-sm text-[var(--ink-muted)]">
              {continueHint}
            </p>
          )}
          <div className="flex gap-3">
            {step !== "confirmed" && step !== "date" && (
              <button
                type="button"
                onClick={back}
                disabled={submitting}
                className="min-h-11 rounded-full px-4 py-2.5 text-sm font-medium text-[var(--river-blue)] hover:bg-[var(--river-blue)]/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)] disabled:opacity-50"
              >
                Back
              </button>
            )}
            {step === "confirmed" ? (
              <button
                type="button"
                onClick={handleClose}
                className="ml-auto min-h-11 flex-1 rounded-full bg-[var(--river-blue)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--river-blue-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
              >
                Done
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                disabled={
                  submitting ||
                  (step === "date" && allowedDates.length === 0) ||
                  (step === "payment" && !liveBooking)
                }
                aria-describedby={continueHint ? continueHintId : undefined}
                className="ml-auto min-h-11 flex-1 rounded-full bg-[var(--marker-yellow)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)] disabled:opacity-50"
              >
                {step === "payment"
                  ? submitting
                    ? "Saving…"
                    : liveBooking
                      ? "Complete booking"
                      : "Complete booking (demo)"
                  : "Continue"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
