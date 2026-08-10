import Image from "next/image";
import Link from "next/link";
import { RiverRoutesSection } from "@/components/RiverRoutesSection";
import { IconChevron, IconMapPin, IconShield } from "@/components/icons";
import { btnNavPill } from "@/lib/guest-ui";
import { CONTACT } from "@/lib/tours";
import { SHARED_TOUR_INTRO } from "@/lib/types";
import type { CatalogTour } from "@/lib/tour-catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isStripePublicConfigured } from "@/lib/stripe/env";

export function LandingContent({
  catalogTours,
}: {
  catalogTours: CatalogTour[];
}) {
  const tours = catalogTours;
  const liveDates = isSupabaseConfigured();
  const stripePay = isStripePublicConfigured();

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
    a: stripePay
      ? "Yes. Checkout runs on Stripe with international cards, Apple Pay, and Thai PromptPay. We never store your card details."
      : "Online payment will be processed securely via Stripe once connected. Until then, contact us to reserve.",
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
            <span className="max-w-[9rem] truncate text-xs font-semibold tracking-tight text-[var(--ink)] sm:max-w-none sm:text-sm">
              Mekong Transfer
            </span>
          </Link>
          <a href="#tours" className={btnNavPill}>
            See routes
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

      <RiverRoutesSection tours={tours} />

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
              ["Enter details", "Passport details for every passenger, plus confirmation email."],
              ["Pay online", stripePay ? "Card, Apple Pay, or PromptPay via Stripe Checkout." : "Placeholder checkout until Stripe is connected."],
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
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg py-1 font-medium text-[var(--ink)] marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)] [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <IconChevron className="h-4 w-4 shrink-0 text-[var(--river-blue)] transition group-open:rotate-180" />
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
