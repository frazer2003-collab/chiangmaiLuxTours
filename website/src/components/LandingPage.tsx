"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BookingSheet } from "./BookingSheet";
import { IconBoat, IconChevron, IconMapPin, IconShield } from "./icons";
import { tours } from "@/lib/tours";

const hubs = [
  { name: "Chiang Mai", note: "Transfer hub" },
  { name: "Chiang Rai", note: "Transfer hub" },
  { name: "Chiang Khong", note: "Thai border pier" },
  { name: "Huay Xai Village", note: "Laos departure" },
];

const faqs = [
  {
    q: "What should I bring on the slow boat?",
    a: "Light luggage, sun protection, cash for Pak Beng overnight, and your passport for border checks.",
  },
  {
    q: "Are dates flexible?",
    a: "Demo dates are shown for layout only. Live availability will be managed in the admin area.",
  },
  {
    q: "Is payment secure?",
    a: "Payment is a placeholder in this version. No card is charged until a provider is connected.",
  },
  {
    q: "Where do I meet the boat?",
    a: "Each tour lists its meeting point. Connection packages include ground transfer from your chosen hub.",
  },
];

export function LandingPage() {
  const [bookingTourId, setBookingTourId] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  function openBooking(tourId: string) {
    setBookingTourId(tourId);
    setBookingOpen(true);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--river-blue)]/12 bg-[var(--chart-paper)]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="#" className="flex items-center gap-3">
            <Image
              src="/logo.jpeg"
              alt="Mekong Transfer"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full ring-2 ring-[var(--marker-yellow)]"
              priority
            />
            <span className="hidden text-sm font-semibold tracking-tight text-[var(--ink)] sm:block">
              Mekong Transfer
            </span>
          </Link>
          <a
            href="#tours"
            className="rounded-full bg-[var(--marker-yellow)] px-4 py-2 text-sm font-semibold text-[var(--ink)] shadow-[0_8px_20px_-8px_rgba(242,201,76,0.8)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)]"
          >
            Book a tour
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[var(--river-navy)] text-white">
        <div className="chart-grid absolute inset-0 opacity-[0.08]" aria-hidden />
        <svg
          className="absolute bottom-0 left-0 w-full text-[var(--river-blue)]/40"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0,80 C240,20 480,100 720,60 C960,20 1200,90 1440,40 L1440,120 L0,120 Z"
          />
        </svg>
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
          <div className="max-w-2xl">
            <h1 className="font-[family-name:var(--font-chart)] text-[clamp(2rem,6vw,3.25rem)] leading-[1.05] tracking-[-0.03em] text-balance">
              Book your Mekong slow boat journey
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/82 sm:text-lg">
              Licensed river passages on the Huay Xai ↔ Luang Prabang corridor. Read the route,
              pick your leg, and reserve online.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#tours"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--marker-yellow)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Choose a route
                <IconChevron className="h-4 w-4" />
              </a>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs font-medium text-white/90">
                <IconShield className="h-4 w-4 text-[var(--marker-yellow)]" />
                TAT Licence ID 21/01279
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tours" className="relative border-b border-[var(--river-blue)]/10 bg-[var(--chart-paper)] py-12 sm:py-16">
        <div className="chart-grid absolute inset-0 opacity-[0.35]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 max-w-2xl">
            <h2 className="font-[family-name:var(--font-chart)] text-3xl tracking-[-0.02em] text-[var(--ink)] sm:text-4xl">
              River routes
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--ink-muted)]">
              Four passages on the chart — tap a waypoint to read the leg and book.
            </p>
          </div>

          <div className="mb-10 hidden h-2 rounded-full bg-[var(--river-blue)]/10 md:block">
            <div className="relative h-full">
              {tours.map((tour) => (
                <span
                  key={tour.id}
                  className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[var(--marker-yellow)] ring-4 ring-[var(--chart-paper)]"
                  style={{ left: `${(tour.chartPosition - 1) * 28 + 8}%` }}
                  aria-hidden
                />
              ))}
            </div>
          </div>

          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 xl:grid-cols-4">
            {tours.map((tour) => (
              <article
                key={tour.id}
                id={tour.id}
                className="w-[min(85vw,320px)] shrink-0 snap-start md:w-auto"
              >
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--river-blue)]/18 bg-white shadow-[0_14px_40px_-22px_rgba(27,61,92,0.45)]">
                  <div className="relative aspect-[4/3] bg-[linear-gradient(145deg,#2a6dad_0%,#1a4a75_55%,#0f2740_100%)]">
                    <div className="absolute inset-0 flex items-end p-4">
                      <span className="rounded-md bg-black/35 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-white/90">
                        Photo placeholder
                      </span>
                    </div>
                    <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--marker-yellow)] text-xs font-bold text-[var(--ink)]">
                      {tour.chartPosition}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="text-lg font-semibold leading-snug text-[var(--ink)]">{tour.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{tour.tagline}</p>
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--river-blue)]">
                      {tour.duration}
                    </p>
                    <button
                      type="button"
                      onClick={() => openBooking(tour.id)}
                      className="mt-5 w-full rounded-full bg-[var(--river-blue)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--river-blue-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
                    >
                      Book this route
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {tours.map((tour) => (
        <section
          key={`detail-${tour.id}`}
          className="border-b border-[var(--river-blue)]/10 bg-white py-12 sm:py-14"
          aria-labelledby={`detail-${tour.id}-title`}
        >
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="font-[family-name:var(--font-chart)] text-sm uppercase tracking-[0.16em] text-[var(--river-blue)]">
                Waypoint {tour.chartPosition}
              </p>
              <h2 id={`detail-${tour.id}-title`} className="mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
                {tour.name}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--ink-muted)]">{tour.tagline}</p>

              <ul className="mt-6 space-y-2">
                {tour.highlights.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-[var(--ink)]">
                    <IconBoat className="mt-0.5 h-4 w-4 shrink-0 text-[var(--river-blue)]" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--ink)]">
                  Itinerary
                </h3>
                <ol className="mt-3 space-y-3">
                  {tour.itinerary.map((leg) => (
                    <li key={leg.label} className="rounded-xl bg-[var(--chart-paper)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--river-blue)]">
                        {leg.label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">{leg.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <aside className="rounded-2xl border border-[var(--river-blue)]/15 bg-[var(--chart-paper)] p-5 sm:p-6">
              <div className="aspect-[16/10] rounded-xl bg-[linear-gradient(160deg,#dbeafe_0%,#93c5fd_40%,#2563a8_100%)]">
                <div className="flex h-full items-end p-3">
                  <span className="rounded bg-white/80 px-2 py-1 text-[11px] font-medium text-[var(--ink-muted)]">
                    Tour photo placeholder
                  </span>
                </div>
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="text-[var(--ink-muted)]">Route</dt>
                  <dd className="font-medium text-[var(--ink)]">{tour.route}</dd>
                </div>
                <div>
                  <dt className="text-[var(--ink-muted)]">Meeting point</dt>
                  <dd className="font-medium text-[var(--ink)]">{tour.meetingPoint}</dd>
                </div>
                <div>
                  <dt className="text-[var(--ink-muted)]">Pricing</dt>
                  <dd className="font-medium text-[var(--ink)]">{tour.priceNote}</dd>
                </div>
              </dl>
              <ul className="mt-4 space-y-1.5 text-sm text-[var(--ink-muted)]">
                {tour.includes.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => openBooking(tour.id)}
                className="mt-6 w-full rounded-full bg-[var(--marker-yellow)] py-3 text-sm font-semibold text-[var(--ink)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)]"
              >
                Book this tour
              </button>
            </aside>
          </div>
        </section>
      ))}

      <section className="border-b border-[var(--river-blue)]/10 bg-[var(--chart-paper)] py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-chart)] text-3xl tracking-[-0.02em] text-[var(--ink)]">
            How booking works
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Select route", "Pick one of four river passages on the chart."],
              ["Choose date", "Demo dates shown until admin calendar is live."],
              ["Enter details", "Passengers and email for your confirmation."],
              ["Pay online", "Placeholder checkout — no charge in v1."],
            ].map(([title, body]) => (
              <li key={title} className="rounded-2xl border border-[var(--river-blue)]/15 bg-white p-5">
                <h3 className="font-semibold text-[var(--ink)]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-[var(--river-blue)]/10 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-chart)] text-3xl tracking-[-0.02em] text-[var(--ink)]">
            Meeting points
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--ink-muted)]">
            Hubs from our existing schedule materials — transfers connect you to the river.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {hubs.map((hub) => (
              <li
                key={hub.name}
                className="flex items-start gap-3 rounded-2xl bg-[var(--chart-paper)] p-4"
              >
                <IconMapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--marker-yellow)]" />
                <div>
                  <p className="font-semibold text-[var(--ink)]">{hub.name}</p>
                  <p className="text-sm text-[var(--ink-muted)]">{hub.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-[var(--river-blue)]/10 bg-[var(--chart-paper)] py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-chart)] text-3xl tracking-[-0.02em] text-[var(--ink)]">
            Questions
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-[var(--river-blue)]/15 bg-white px-5 py-4"
              >
                <summary className="cursor-pointer list-none font-medium text-[var(--ink)] marker:content-none [&::-webkit-details-marker]:hidden">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[var(--river-navy)] py-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="text-lg font-semibold">Mekong Transfer</p>
            <p className="mt-1 text-sm text-white/75">The Best Travel Agency</p>
            <p className="mt-3 text-sm text-white/70">TAT Licence ID 21/01279</p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/65">
            Placeholder contact — connect phone, LINE, and email when ready. Booking checkout is
            demo-only until payment goes live.
          </p>
        </div>
      </footer>

      <BookingSheet
        open={bookingOpen}
        tourId={bookingTourId}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}
