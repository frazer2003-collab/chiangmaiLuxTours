"use client";

import { useState, useTransition } from "react";
import { tours } from "@/lib/tours";
import { updateTourPrice } from "@/lib/actions/admin";
import { useAdminLocale } from "./AdminLocaleProvider";
import { AdminSpinner, AdminStatusBanner } from "./AdminFeedback";

export function ToursTab({
  initialPrices,
}: {
  initialPrices: Record<string, number>;
}) {
  const { tr } = useAdminLocale();
  const [prices, setPrices] = useState(initialPrices);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");
  const [pending, startTransition] = useTransition();
  const [savingTourId, setSavingTourId] = useState<string | null>(null);

  function save(tourId: string) {
    const raw = drafts[tourId] ?? String(prices[tourId] ?? "");
    const value = Number.parseInt(raw.replace(/[^\d]/g, ""), 10);
    if (!value || value <= 0) {
      setMessageTone("error");
      setMessage(tr("errorRetry"));
      return;
    }

    setSavingTourId(tourId);
    startTransition(async () => {
      const result = await updateTourPrice({ tourId, priceThb: value });
      setSavingTourId(null);
      if (!result.ok) {
        setMessageTone("error");
        setMessage(result.error);
        return;
      }
      setPrices((prev) => ({ ...prev, [tourId]: value }));
      setMessageTone("success");
      setMessage(tr("saved"));
    });
  }

  return (
    <div className="space-y-3">
      {message ? (
        <AdminStatusBanner tone={messageTone} message={message} />
      ) : null}
      <ul className="space-y-2">
        {tours.map((tour) => (
          <li
            key={tour.id}
            className="rounded-2xl bg-white px-4 py-4 ring-1 ring-[var(--river-blue)]/10"
          >
            <p className="font-semibold text-[var(--ink)]">{tour.name}</p>
            <p className="mt-0.5 text-sm text-[var(--ink-muted)]">{tour.duration}</p>
            <div className="mt-3 flex items-end gap-2">
              <div className="flex-1">
                <label
                  htmlFor={`price-${tour.id}`}
                  className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]"
                >
                  {tr("priceThb")}
                </label>
                <input
                  id={`price-${tour.id}`}
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={drafts[tour.id] ?? String(prices[tour.id] ?? "")}
                  onChange={(e) =>
                    setDrafts((prev) => ({ ...prev, [tour.id]: e.target.value }))
                  }
                  disabled={pending && savingTourId === tour.id}
                  className="min-h-11 w-full rounded-xl border border-[var(--river-blue)]/20 px-3 text-base disabled:opacity-60"
                />
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => save(tour.id)}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--river-blue)] px-4 text-sm font-semibold text-white hover:bg-[var(--river-blue-deep)] disabled:opacity-50"
              >
                {savingTourId === tour.id ? (
                  <AdminSpinner className="h-4 w-4 text-white" />
                ) : null}
                {savingTourId === tour.id ? tr("updating") : tr("updatePrice")}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
