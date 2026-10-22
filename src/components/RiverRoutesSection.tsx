"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BookTourButton } from "@/components/booking/BookTourButton";
import { TourDetailPanel } from "@/components/TourDetailPanel";
import { TourTierBadge } from "@/components/TourTierBadge";
import { RoutePhoto } from "@/components/RoutePhoto";
import { btnBookRoute } from "@/lib/guest-ui";
import {
  chartDotLabel,
  getBookRouteLabel,
  isTourBookableOnline,
} from "@/lib/tour-display";
import type { CatalogTour } from "@/lib/tour-catalog";

function cardTitleParts(name: string): { route: string; tier: string | null } {
  const match = name.match(/^(.*)\s(\([^)]+\))$/);
  if (!match) return { route: name, tier: null };
  return { route: match[1], tier: match[2] };
}

export function RiverRoutesSection({
  tours,
  inventoryLive,
}: {
  tours: CatalogTour[];
  inventoryLive: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [selectedId, setSelectedId] = useState(tours[0]?.id ?? "");

  const scrollToTour = useCallback((tourId: string) => {
    const card = cardRefs.current.get(tourId);
    const container = scrollRef.current;
    if (!card || !container) return;

    setSelectedId(tourId);
    const offset = card.offsetLeft - container.offsetLeft;
    container.scrollTo({ left: offset, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-tour-card]"),
    );
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const id = best.target.getAttribute("data-tour-id");
        if (id) setSelectedId(id);
      },
      { root: container, threshold: [0.55, 0.7, 0.85] },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [tours]);

  const selectedTour = tours.find((t) => t.id === selectedId) ?? tours[0];

  return (
    <section
      id="tours"
      className={`relative border-b border-[var(--river-blue)]/10 bg-[var(--chart-paper)] py-5 sm:py-16 scroll-mt-[4.75rem]`}
    >
      <div className="chart-grid absolute inset-0 opacity-[0.35]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-2 max-w-2xl sm:mb-8">
          <h2 className="font-[family-name:var(--font-chart)] text-2xl tracking-[-0.02em] text-[var(--ink)] sm:text-4xl">
            River routes
          </h2>
          <p className="mt-3 hidden text-base leading-relaxed text-[var(--ink-muted)] sm:block">
            Six routes into Laos — by slow boat, van, or train, ending in Luang Prabang,
            Vang Vieng, or Vientiane.
          </p>
        </div>

        <div
          className="mb-6 hidden md:block"
          role="tablist"
          aria-label="Route chart"
        >
          <div className="relative pb-8">
            <div className="relative h-2 rounded-full bg-[var(--river-blue)]/10">
              {tours.map((tour) => {
                const isSelected = tour.id === selectedId;
                const left = `${((tour.chartPosition - 1) / Math.max(tours.length - 1, 1)) * 84 + 8}%`;
                return (
                  <button
                    key={tour.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-label={`Route ${tour.chartPosition}: ${tour.name}`}
                    onClick={() => {
                      setSelectedId(tour.id);
                      scrollToTour(tour.id);
                    }}
                    className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-[var(--chart-paper)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)] ${
                      isSelected ? "h-5 w-5" : "h-4 w-4"
                    }`}
                    style={{
                      left,
                      backgroundColor: isSelected
                        ? "var(--marker-yellow)"
                        : "color-mix(in srgb, var(--river-blue) 62%, white)",
                    }}
                  />
                );
              })}
            </div>
            {tours.map((tour) => {
              const isSelected = tour.id === selectedId;
              const left = `${((tour.chartPosition - 1) / Math.max(tours.length - 1, 1)) * 84 + 8}%`;
              return (
                <button
                  key={`${tour.id}-label`}
                  type="button"
                  onClick={() => {
                    setSelectedId(tour.id);
                    scrollToTour(tour.id);
                  }}
                  className={`absolute top-4 max-w-[5.5rem] -translate-x-1/2 text-center text-[10px] leading-tight transition ${
                    isSelected
                      ? "font-semibold text-[var(--ink)]"
                      : "font-medium text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                  style={{ left }}
                >
                  {chartDotLabel(tour)}
                </button>
              );
            })}
          </div>
          {selectedTour ? (
            <p className="text-sm font-medium text-[var(--river-blue)]" aria-live="polite">
              Viewing: {selectedTour.name}
            </p>
          ) : null}
        </div>

        <ul className="space-y-1 md:hidden" aria-label="All routes">
          {tours.map((tour) => {
            const isSelected = tour.id === selectedId;
            const title = cardTitleParts(tour.name);
            return (
              <li key={tour.id}>
                <article
                  onClick={() => setSelectedId(tour.id)}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-2 pr-3 shadow-[0_14px_30px_-18px_rgba(15,39,64,0.45)] ${
                    isSelected
                      ? "ring-2 ring-[var(--marker-yellow)]"
                      : "ring-1 ring-[var(--river-blue)]/15"
                  }`}
                >
                  <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl">
                    <RoutePhoto
                      src={tour.image}
                      alt=""
                      className="h-full w-full"
                      sizes="76px"
                    />
                    <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--marker-yellow)] text-[10px] font-bold text-[var(--ink)]">
                      {tour.chartPosition}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold leading-snug text-[var(--ink)]">{title.route}</h3>
                    <p className="mt-0.5 text-xs leading-snug text-[var(--ink-muted)]">
                      {title.tier ? `${title.tier.replace(/[()]/g, "")} · ` : ""}
                      <span className="font-semibold text-[var(--ink)]">{tour.price}</span>
                    </p>
                  </div>
                  <BookTourButton
                    tourId={tour.id}
                    tourName={tour.name}
                    bookable={isTourBookableOnline(tour, inventoryLive)}
                    className="pressable inline-flex min-h-11 shrink-0 items-center rounded-full bg-[var(--marker-yellow)] px-3 text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)]"
                  >
                    Book
                  </BookTourButton>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="hidden min-w-0 md:block">
            <div
              ref={scrollRef}
              className="grid grid-cols-2 gap-6 xl:grid-cols-3"
            >
              {tours.map((tour) => {
                const isSelected = tour.id === selectedId;
                const title = cardTitleParts(tour.name);
                return (
                  <article
                    key={tour.id}
                    id={tour.id}
                    ref={(node) => {
                      if (node) cardRefs.current.set(tour.id, node);
                      else cardRefs.current.delete(tour.id);
                    }}
                    data-tour-card
                    data-tour-id={tour.id}
                    onClick={() => setSelectedId(tour.id)}
                    className="cursor-pointer"
                  >
                    <div
                      className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_22px_44px_-18px_rgba(15,39,64,0.55)] transition ${
                        isSelected
                          ? "border-[var(--marker-yellow)] ring-2 ring-[var(--marker-yellow)]/70"
                          : "border-[var(--river-blue)]/18"
                      }`}
                    >
                      <div className="relative aspect-[4/3]">
                        <RoutePhoto
                          src={tour.image}
                          alt={tour.imageAlt}
                          className="h-full w-full"
                          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 44vw, 78vw"
                        />
                        <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--marker-yellow)] text-sm font-bold text-[var(--ink)] shadow-[0_8px_18px_-6px_rgba(15,39,64,0.65)]">
                          {tour.chartPosition}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <TourTierBadge tourId={tour.id} />
                        <h3 className="mt-2 text-lg font-semibold leading-snug text-[var(--ink)]">
                          <span className="block min-h-[1.6em]">{title.route}</span>
                          {title.tier ? <span className="block">{title.tier}</span> : null}
                        </h3>
                        <p className="mt-1 min-h-[2.85rem] text-sm leading-relaxed text-[var(--ink-muted)]">
                          {tour.tagline}
                        </p>
                        <div className="mt-auto flex flex-col pt-4">
                          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--river-blue)]">
                            {tour.duration}
                          </p>
                          <p className="mt-2 text-base font-semibold text-[var(--ink)]">
                            {tour.price}
                          </p>
                          <BookTourButton
                            tourId={tour.id}
                            tourName={tour.name}
                            bookable={isTourBookableOnline(tour, inventoryLive)}
                            className={`mt-5 ${btnBookRoute}`}
                          >
                            {getBookRouteLabel(tour, inventoryLive)}
                          </BookTourButton>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
        </div>

        {selectedTour ? (
          <TourDetailPanel tour={selectedTour} inventoryLive={inventoryLive} />
        ) : null}
      </div>
    </section>
  );
}
