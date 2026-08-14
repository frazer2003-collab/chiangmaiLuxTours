"use client";

import { BookTourButton } from "@/components/booking/BookTourButton";
import { RoutePhoto } from "@/components/RoutePhoto";
import { BOOK_ROUTE_LABEL, anchorSection, btnBookRoute } from "@/lib/guest-ui";
import type { CatalogTour } from "@/lib/tour-catalog";

export function TourDetailPanel({ tour }: { tour: CatalogTour }) {
  const gallery = tour.gallery ?? [];

  return (
    <div
      id="route-detail"
      className={`mt-10 border-t border-[var(--river-blue)]/12 pt-10 sm:mt-12 sm:pt-12 ${anchorSection}`}
      aria-labelledby="route-detail-title"
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <RoutePhoto
            src={tour.image}
            alt={tour.imageAlt}
            className="mb-6 aspect-[16/10] rounded-2xl"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
          <h3
            id="route-detail-title"
            className="font-[family-name:var(--font-chart)] text-2xl tracking-[-0.02em] text-[var(--ink)] sm:text-3xl"
          >
            {tour.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{tour.routeDetail}</p>
          <p className="mt-1 text-sm font-medium text-[var(--river-blue)]">
            {tour.duration} · {tour.price}
          </p>

          {tour.overnightNote && (
            <p className="mt-4 rounded-xl border border-[var(--marker-yellow)]/40 bg-[var(--marker-yellow)]/10 px-4 py-3 text-sm leading-relaxed text-[var(--ink)]">
              {tour.overnightNote}
            </p>
          )}

          {gallery.length > 0 ? (
            <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {gallery.map((shot) => (
                <li key={shot.src}>
                  <RoutePhoto
                    src={shot.src}
                    alt={shot.alt}
                    className="aspect-[4/3] rounded-xl"
                    sizes="(min-width: 1024px) 18vw, 45vw"
                  />
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-[var(--ink)]">Itinerary</h4>
            <ol className="mt-3 space-y-2">
              {tour.itinerary.map((leg) => (
                <li key={leg.label} className="rounded-xl bg-white/80 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--river-blue)]">
                    {leg.label}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">{leg.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="rounded-2xl border border-[var(--river-blue)]/15 bg-white/90 p-5 sm:p-6">
          <p className="text-sm text-[var(--ink-muted)]">
            <span className="font-medium text-[var(--ink)]">Meeting point:</span> {tour.meetingPoint}
          </p>
          <h4 className="mt-5 text-sm font-semibold text-[var(--ink)]">Included</h4>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--ink-muted)]">
            {tour.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <BookTourButton tourId={tour.id} className={`mt-6 ${btnBookRoute}`}>
            {BOOK_ROUTE_LABEL}
          </BookTourButton>
        </aside>
      </div>
    </div>
  );
}
