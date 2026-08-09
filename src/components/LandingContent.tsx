import Image from "next/image";
import Link from "next/link";
import { BookTourButton } from "@/components/booking/BookTourButton";
import { IconChevron, IconMapPin, IconShield } from "@/components/icons";
import { CONTACT } from "@/lib/tours";
import { SHARED_TOUR_INTRO } from "@/lib/types";
import type { CatalogTour } from "@/lib/tour-catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function LandingContent({
  catalogTours,
}: {
  catalogTours: CatalogTour[];
}) {
  const tours = catalogTours;
  const liveDates = isSupabaseConfigured();

  const hubs = tours.map((tour) => ({
    name: tour.from === "Huay Xai" ? "Huay Xai Village" : tour.from,
    note: tour.meetingPoint,
    price: tour.price,
  }));

  const faqs = [
  {
    q: "What should I bring on the river journey?",
    a: "Light luggage, sun protection, passport for border checks, and cash for stops en route. The Chiang Mai route includes one overnight.",
  },
  {
    q: "Are dates flexible?",
    a: liveDates
      ? "Available departure dates are shown when you book each route. Seats are limited — choose an open date in the booking flow."
      : "Demo dates are shown for layout only. Live availability will appear once admin is connected.",
  },
  {
    q: "Is payment secure?",
    a: "Payment is a placeholder in this version. No card is charged until a provider is connected.",
  },
  {
    q: "Where do I meet the boat?",
    a: "Each tour lists its departure hub — Chiang Mai, Chiang Rai, Chiang Khong, or Huay Xai Village. All routes finish in Luang Prabang.",
  },
];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--river-blue)]/12 bg-[var(--chart-paper)]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-h-11 items-center gap-3">
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
            className="inline-flex min-h-11 items-center rounded-full bg-[var(--marker-yellow)] px-5 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_8px_20px_-8px_rgba(242,201,76,0.8)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)]"
          >
            Book a tour
          </a>
        </div>
      </header>

      <main id="main">
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
              Cruise the Mighty Mekong
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/82 sm:text-lg">
              {SHARED_TOUR_INTRO}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#tours"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--marker-yellow)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
              Four departures on the chart — one route to Luang Prabang from each hub.
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
                  <div className="relative aspect-[4/3] bg-[linear-gradient(145deg,var(--river-blue)_0%,var(--river-blue-deep)_55%,var(--river-navy)_100%)]">
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
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--river-blue)]">
                      Premium · Special · Slow boat
                    </p>
                    <h3 className="mt-2 text-lg font-semibold leading-snug text-[var(--ink)]">{tour.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">{tour.tagline}</p>
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--river-blue)]">
                      {tour.duration}
                    </p>
                    <p className="mt-2 text-base font-semibold text-[var(--ink)]">{tour.price}</p>
                    <BookTourButton
                      tourId={tour.id}
                      className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--river-blue)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--river-blue-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
                    >
                      Book this route
                    </BookTourButton>
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
                {tour.posterTitle}
              </p>
              <h2 id={`detail-${tour.id}-title`} className="mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
                {tour.headline}
              </h2>
              <p className="mt-1 text-lg text-[var(--ink-muted)]">{tour.tagline}</p>
              <p className="mt-4 text-base leading-relaxed text-[var(--ink-muted)]">{tour.intro}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {tour.experiences.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-[var(--river-blue)]/12 bg-[var(--chart-paper)] p-4"
                  >
                    <h3 className="text-sm font-semibold text-[var(--ink)]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">{item.description}</p>
                  </div>
                ))}
              </div>

              <dl className="mt-8 space-y-4 rounded-2xl border border-[var(--river-blue)]/12 bg-[var(--chart-paper)] p-5">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--river-blue)]">Route</dt>
                  <dd className="mt-1 text-sm font-medium text-[var(--ink)]">{tour.routeDetail}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--river-blue)]">Perfect for</dt>
                  <dd className="mt-1 text-sm text-[var(--ink-muted)]">{tour.perfectFor}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--river-blue)]">Duration</dt>
                  <dd className="mt-1 text-sm text-[var(--ink-muted)]">
                    {tour.duration} · {tour.durationDetail}
                  </dd>
                </div>
              </dl>

              {tour.overnightNote && (
                <p className="mt-4 rounded-xl border border-[var(--marker-yellow)]/40 bg-[var(--marker-yellow)]/10 px-4 py-3 text-sm leading-relaxed text-[var(--ink)]">
                  {tour.overnightNote}
                </p>
              )}

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
              <div className="aspect-[16/10] rounded-xl bg-[linear-gradient(160deg,color-mix(in_srgb,var(--chart-paper)_80%,white)_0%,color-mix(in_srgb,var(--river-blue)_35%,white)_40%,var(--river-blue)_100%)]">
                <div className="flex h-full flex-col items-start justify-between p-4">
                  <span className="rounded-md bg-[var(--marker-yellow)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--ink)]">
                    Special · Slow boat
                  </span>
                  <div>
                    <p className="text-2xl font-semibold text-white">{tour.price}</p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-white/85">{tour.duration}</p>
                  </div>
                </div>
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="text-[var(--ink-muted)]">Route</dt>
                  <dd className="font-medium text-[var(--ink)]">{tour.routeDetail}</dd>
                </div>
                <div>
                  <dt className="text-[var(--ink-muted)]">Meeting point</dt>
                  <dd className="font-medium text-[var(--ink)]">{tour.meetingPoint}</dd>
                </div>
              </dl>
              <h3 className="mt-5 text-sm font-semibold text-[var(--ink)]">Included</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-[var(--ink-muted)]">
                {tour.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[var(--marker-yellow)]" aria-hidden>
                      ◆
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-[var(--ink-muted)]">
                We look forward to welcoming you aboard for an unforgettable journey on the Mekong River!
              </p>
              <BookTourButton
                tourId={tour.id}
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--marker-yellow)] px-4 py-3 text-sm font-semibold text-[var(--ink)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)]"
              >
                Book this tour
              </BookTourButton>
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
              ["Select route", "Pick your hub — Chiang Mai, Chiang Rai, Chiang Khong, or Huay Xai."],
              [
                "Choose date",
                liveDates
                  ? "Pick an open departure from live availability."
                  : "Demo dates shown until admin calendar is live.",
              ],
              ["Enter details", "Passengers, ID details for every traveller, and contact email."],
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
            Departure hubs for each route — all journeys finish in Luang Prabang.
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
                  <p className="mt-1 text-sm font-medium text-[var(--river-blue)]">{hub.price}</p>
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
                <summary className="cursor-pointer list-none rounded-lg py-1 font-medium text-[var(--ink)] marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)] [&::-webkit-details-marker]:hidden">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      </main>

      <footer className="bg-[var(--river-navy)] py-10 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          <div>
            <p className="text-lg font-semibold">Mekong Transfer</p>
            <p className="mt-1 text-sm text-white/75">The Best Travel Agency</p>
            <p className="mt-3 text-sm text-white/70">TAT Licence ID {CONTACT.licence}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90">Mobile &amp; WhatsApp</p>
            <ul className="mt-2 space-y-1 text-sm text-white/75">
              {CONTACT.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    className="hover:text-[var(--marker-yellow)]"
                  >
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-semibold text-white/90">Email</p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-1 block text-sm text-white/75 hover:text-[var(--marker-yellow)]"
            >
              {CONTACT.email}
            </a>
          </div>
          <p className="text-sm leading-relaxed text-white/65 sm:col-span-2 lg:col-span-1">
            Experience the Real Laos — premium slow boat routes from Chiang Mai, Chiang Rai,
            Chiang Khong, and Huay Xai to Luang Prabang.
          </p>
        </div>
      </footer>
    </>
  );
}
