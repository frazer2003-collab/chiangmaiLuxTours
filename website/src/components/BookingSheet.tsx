"use client";

import { useEffect, useMemo, useState } from "react";
import { IconClose } from "./icons";
import { getTour } from "@/lib/tours";
import type { BookingStep } from "@/lib/types";

type Props = {
  open: boolean;
  tourId: string | null;
  onClose: () => void;
};

const steps: BookingStep[] = ["tour", "date", "details", "payment", "confirmed"];

export function BookingSheet({ open, tourId, onClose }: Props) {
  const tour = tourId ? getTour(tourId) : undefined;
  const [step, setStep] = useState<BookingStep>("tour");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (open && tourId) {
      setStep("date");
      setDate("");
      setPassengers(1);
      setName("");
      setEmail("");
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

  const stepIndex = steps.indexOf(step);

  const canContinue = useMemo(() => {
    if (step === "date") return Boolean(date);
    if (step === "details") return name.trim().length > 1 && email.includes("@");
    return true;
  }, [step, date, name, email]);

  if (!open || !tour) return null;

  function next() {
    if (step === "date") setStep("details");
    else if (step === "details") setStep("payment");
    else if (step === "payment") setStep("confirmed");
  }

  function back() {
    if (step === "details") setStep("date");
    else if (step === "payment") setStep("details");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close booking"
        className="absolute inset-0 bg-[#0f2740]/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.25rem] bg-[var(--chart-paper)] shadow-[0_24px_60px_-12px_rgba(15,39,64,0.35)] sm:rounded-[1.25rem]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--river-blue)]/15 px-5 py-4">
          <div>
            <p className="font-[family-name:var(--font-chart)] text-xs uppercase tracking-[0.18em] text-[var(--river-blue)]">
              Chart booking · Step {Math.min(stepIndex + 1, 4)} of 4
            </p>
            <h2 id="booking-title" className="mt-1 text-lg font-semibold text-[var(--ink)]">
              {tour.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--ink-muted)] transition hover:bg-[var(--river-blue)]/8 hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === "date" && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
                Demo dates only — admin will manage live availability later.
              </p>
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-[var(--ink)]">
                  Departure date
                </legend>
                <div className="grid gap-2">
                  {tour.demoDates.map((d) => (
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
                      <input
                        type="radio"
                        name="date"
                        value={d}
                        checked={date === d}
                        onChange={() => setDate(d)}
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
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
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full rounded-xl border border-[var(--river-blue)]/25 bg-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--river-blue)]/25 bg-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Email for confirmation
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--river-blue)]/25 bg-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
                />
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-dashed border-[var(--river-blue)]/35 bg-white p-4">
                <p className="text-sm font-medium text-[var(--ink)]">Payment placeholder</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                  No charge is processed in this version. When payment goes live, full amount will
                  be collected here. {tour.priceNote}
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
                Placeholder confirmation — email to <strong className="text-[var(--ink)]">{email}</strong>{" "}
                will be sent when transactional email is connected.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-[var(--river-blue)]/15 px-5 py-4">
          {step !== "confirmed" && step !== "date" && (
            <button
              type="button"
              onClick={back}
              className="rounded-full px-4 py-2.5 text-sm font-medium text-[var(--river-blue)] hover:bg-[var(--river-blue)]/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
            >
              Back
            </button>
          )}
          {step === "confirmed" ? (
            <button
              type="button"
              onClick={onClose}
              className="ml-auto flex-1 rounded-full bg-[var(--river-blue)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--river-blue-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
            >
              Done
            </button>
          ) : (
            <button
              type="button"
              disabled={!canContinue}
              onClick={next}
              className="ml-auto flex-1 rounded-full bg-[var(--marker-yellow)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition enabled:hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)]"
            >
              {step === "payment" ? "Complete booking (demo)" : "Continue"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
