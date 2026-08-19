"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { IconChevron, IconClose } from "./icons";
import { useCatalogTours, useInventoryLive } from "@/components/booking/BookingProvider";
import { getTourFromCatalog } from "@/lib/tour-catalog";
import { submitBooking } from "@/lib/actions/booking";
import { startStripeCheckout } from "@/lib/actions/checkout";
import { isSupabasePublicConfigured } from "@/lib/supabase/env";
import { isStripePublicConfigured } from "@/lib/stripe/env";
import { formatThbTotal } from "@/lib/stripe/env";
import {
  validateDate,
  validateEmail,
  validateGuestIdentity,
  validatePassengerForms,
  formatGuestFullName,
} from "@/lib/booking-validation";
import {
  emptyPassengerForm,
  resizePassengerForms,
  type PassengerFormState,
} from "@/lib/booking-passengers";
import { PassengerIdentityFields } from "@/components/PassengerIdentityFields";
import type { BookingStep } from "@/lib/types";
import { CONTACT, whatsappHref } from "@/lib/types";
import {
  CHANGE_CANCEL_SUMMARY,
  DATES_UNAVAILABLE,
  PASSPORT_PRIVACY_SUMMARY,
  PAY_NOW_HOLD,
} from "@/lib/guest-legal";
import Link from "next/link";

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
  const inventoryLive = useInventoryLive();
  const tour = tourId ? getTourFromCatalog(catalog, tourId) : undefined;
  const canBookOnline = isSupabasePublicConfigured() && inventoryLive;
  const canPayOnline = isStripePublicConfigured() && inventoryLive;
  const allowedDates = tour?.demoDates ?? [];
  const dateAvailability = tour?.availableDates ?? [];

  const [step, setStep] = useState<BookingStep>("tour");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [passengerForms, setPassengerForms] = useState<PassengerFormState[]>([
    emptyPassengerForm(),
  ]);
  const [email, setEmail] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [openCompanions, setOpenCompanions] = useState<number[]>([]);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const fieldClass =
    "w-full rounded-xl border border-[var(--river-blue)]/25 bg-white px-3 py-2.5 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]";

  const dateErrorId = useId();
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
    setPassengerForms((prev) => resizePassengerForms(prev, passengers));
  }, [passengers]);

  useEffect(() => {
    if (open && tourId) {
      setStep("date");
      setDate("");
      setPassengers(1);
      setPassengerForms([emptyPassengerForm()]);
      setEmail("");
      setShowErrors(false);
      setSubmitError(null);
      setSubmitting(false);
      setBookingId(null);
      setOpenCompanions([]);
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

  const detailsValidationError = useMemo(
    () => validatePassengerForms(passengerForms, passengers, email),
    [passengerForms, passengers, email],
  );

  const emailError =
    showErrors && step === "details" ? validateEmail(email) : null;

  const canContinue = useMemo(() => {
    if (step === "date") return !validateDate(date, allowedDates);
    if (step === "details") return !detailsValidationError;
    return true;
  }, [step, date, allowedDates, detailsValidationError]);

  const continueHint = useMemo(() => {
    if (canContinue || step === "confirmed" || step === "payment") return null;
    if (step === "date") return validateDate(date, allowedDates);
    if (step === "details") return detailsValidationError;
    return null;
  }, [canContinue, step, date, allowedDates, detailsValidationError]);

  const dateError =
    showErrors && step === "date" ? validateDate(date, allowedDates) : null;

  if (!open || !tour) return null;

  async function completeBooking() {
    if (!tour) return;
    setSubmitting(true);
    setSubmitError(null);

    if (canPayOnline) {
      const result = await startStripeCheckout({
        tourId: tour.id,
        date,
        passengers,
        passengerForms,
        email,
        allowedDates,
      });

      if (!result.ok) {
        setSubmitting(false);
        setSubmitError(result.error);
        return;
      }

      window.location.href = result.checkoutUrl;
      return;
    }

    const result = await submitBooking({
      tourId: tour.id,
      date,
      passengers,
      passengerForms,
      email,
      allowedDates,
    });

    setSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    setBookingId(result.bookingId);
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
      if (detailsValidationError) {
        setShowErrors(true);
        const invalidCompanions = passengerForms
          .slice(1, passengers)
          .flatMap((form, offset) =>
            validateGuestIdentity(form) ? [offset + 1] : [],
          );
        setOpenCompanions((prev) => [
          ...new Set([...prev, ...invalidCompanions]),
        ]);
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

  function updatePassenger(index: number, next: PassengerFormState) {
    setPassengerForms((prev) => {
      const copy = [...prev];
      copy[index] = next;
      return copy;
    });
    if (showErrors) setShowErrors(false);
  }

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
              Booking · Step {Math.min(stepIndex + 1, 4)} of 4
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
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
                    {inventoryLive
                      ? "No departure dates are open for this route right now. WhatsApp or email us to enquire."
                      : DATES_UNAVAILABLE}
                  </p>
                  <a
                    href={whatsappHref(
                      tour
                        ? `Hello Mekong Transfer — I want to book ${tour.name}.`
                        : undefined,
                    )}
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--river-blue)] underline-offset-2 hover:underline"
                  >
                    WhatsApp {CONTACT.phones[0]}
                  </a>
                </div>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
                    Choose an open departure. Remaining seats come from the live calendar.
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
            <div className="space-y-8">
              <div>
                <label htmlFor="passengers" className="mb-1.5 block text-sm font-medium">
                  Passengers
                </label>
                <select
                  id="passengers"
                  value={passengers}
                  onChange={(e) => {
                    const count = Math.min(
                      maxPassengers,
                      Math.max(1, Number(e.target.value)),
                    );
                    setPassengers(count);
                    setOpenCompanions((prev) => prev.filter((index) => index < count));
                    if (showErrors) setShowErrors(false);
                  }}
                  className={fieldClass}
                >
                  {passengerOptions.map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "passenger" : "passengers"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[var(--ink)]">Lead guest</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">
                    Passport details for the border crossing.
                  </p>
                </div>
                <PassengerIdentityFields
                  index={0}
                  value={passengerForms[0] ?? emptyPassengerForm()}
                  showErrors={showErrors}
                  onChange={(next) => updatePassenger(0, next)}
                />
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                    Confirmation email
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
                    className={fieldClass}
                  />
                  {emailError ? (
                    <p
                      id={emailErrorId}
                      role="alert"
                      className="mt-1.5 text-sm text-[var(--river-blue-deep)]"
                    >
                      {emailError}
                    </p>
                  ) : null}
                </div>
              </div>

              {passengers > 1 ? (
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-[var(--ink)]">
                    Other passengers
                  </h3>
                  {passengerForms.slice(1, passengers).map((passenger, offset) => {
                    const index = offset + 1;
                    const summaryName =
                      formatGuestFullName(passenger.familyName, passenger.givenName) ||
                      `Passenger ${index + 1}`;
                    const open = openCompanions.includes(index);
                    return (
                      <details
                        key={index}
                        open={open}
                        onToggle={(event) => {
                          const nextOpen = event.currentTarget.open;
                          setOpenCompanions((prev) => {
                            const has = prev.includes(index);
                            if (nextOpen === has) return prev;
                            return nextOpen
                              ? [...prev, index]
                              : prev.filter((item) => item !== index);
                          });
                        }}
                        className="group rounded-2xl border border-[var(--river-blue)]/15 bg-white px-4 py-3"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg py-1 font-medium text-[var(--ink)] marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)] [&::-webkit-details-marker]:hidden">
                          <span>{summaryName}</span>
                          <IconChevron className="h-4 w-4 shrink-0 text-[var(--river-blue)] transition group-open:rotate-180" />
                        </summary>
                        <div className="mt-4">
                          <PassengerIdentityFields
                            index={index}
                            value={passenger}
                            showErrors={showErrors}
                            onChange={(next) => updatePassenger(index, next)}
                          />
                        </div>
                      </details>
                    );
                  })}
                </div>
              ) : null}
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-4">
              {canPayOnline ? (
                <div className="rounded-xl border border-[var(--river-blue)]/20 bg-white p-4">
                  <p className="text-sm font-medium text-[var(--ink)]">Secure payment</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                    Pay with international cards or Thai PromptPay on Stripe&apos;s secure page.
                    Apple Pay can appear on supported devices.
                  </p>
                  <ul className="mt-3 space-y-1.5 text-xs text-[var(--ink-muted)]">
                    <li>Visa, Mastercard, Amex, and other cards</li>
                    <li>PromptPay for Thai bank apps</li>
                    <li>Apple Pay may appear on supported devices</li>
                  </ul>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {PAY_NOW_HOLD} {CHANGE_CANCEL_SUMMARY}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {PASSPORT_PRIVACY_SUMMARY}
                  </p>
                  <p className="mt-3 text-xs text-[var(--ink-muted)]">
                    <Link
                      href="/booking-terms"
                      className="font-medium text-[var(--river-blue)] underline-offset-2 hover:underline"
                    >
                      Booking terms
                    </Link>
                    {" · "}
                    <Link
                      href="/privacy"
                      className="font-medium text-[var(--river-blue)] underline-offset-2 hover:underline"
                    >
                      Privacy
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--river-blue)]/35 bg-white p-4">
                  <p className="text-sm font-medium text-[var(--ink)]">
                    {inventoryLive ? "Payment not connected" : "Online booking paused"}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {inventoryLive
                      ? "Online payment is not configured yet. WhatsApp or email us to reserve."
                      : DATES_UNAVAILABLE}
                  </p>
                  <a
                    href={whatsappHref(
                      tour
                        ? `Hello Mekong Transfer — I want to book ${tour.name}.`
                        : undefined,
                    )}
                    className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--river-blue)] underline-offset-2 hover:underline"
                  >
                    WhatsApp {CONTACT.phones[0]}
                  </a>
                </div>
              )}
              <dl className="space-y-2 rounded-xl bg-[var(--river-blue)]/6 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--ink-muted)]">Route</dt>
                  <dd className="text-right font-medium">{tour.route}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--ink-muted)]">Date</dt>
                  <dd className="font-medium">
                    {date
                      ? new Date(date + "T12:00:00").toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--ink-muted)]">Passengers</dt>
                  <dd className="font-medium">{passengers}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--ink-muted)]">Lead guest</dt>
                  <dd className="text-right font-medium">
                    {formatGuestFullName(
                      passengerForms[0]?.familyName ?? "",
                      passengerForms[0]?.givenName ?? "",
                    ) || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-[var(--river-blue)]/10 pt-2">
                  <dt className="font-semibold text-[var(--ink)]">Total</dt>
                  <dd className="font-semibold text-[var(--ink)]">
                    {formatThbTotal(tour.priceThb * passengers)}
                  </dd>
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
              {bookingId ? (
                <p className="break-all text-sm font-medium text-[var(--ink)]">
                  Reference {bookingId}
                </p>
              ) : null}
              <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
                Screenshot this reference. WhatsApp us with it so we can confirm your seats
                {email ? (
                  <>
                    {" "}
                    — we also have <strong className="text-[var(--ink)]">{email}</strong>
                  </>
                ) : null}
                .
              </p>
              <a
                href={whatsappHref(
                  `Hello Mekong Transfer — booking ${bookingId ?? "request"} for ${tour.name}.`,
                )}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--marker-yellow)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:brightness-95"
              >
                WhatsApp {CONTACT.phones[0]}
              </a>
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
                  (step === "payment" && !canBookOnline)
                }
                aria-describedby={continueHint ? continueHintId : undefined}
                className="ml-auto min-h-11 flex-1 rounded-full bg-[var(--marker-yellow)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)] disabled:opacity-50"
              >
                {step === "payment"
                  ? submitting
                    ? "Redirecting…"
                    : canPayOnline
                      ? "Pay now"
                      : canBookOnline
                        ? "Complete booking"
                        : "Unavailable"
                  : "Continue"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
