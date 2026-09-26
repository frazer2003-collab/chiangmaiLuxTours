"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BookTourButton } from "@/components/booking/BookTourButton";
import { TourDetailPanel } from "@/components/TourDetailPanel";
import { TourTierBadge } from "@/components/TourTierBadge";
import { RoutePhoto } from "@/components/RoutePhoto";
import { IconChevron } from "@/components/icons";
import { btnBookRoute } from "@/lib/guest-ui";
import {
  chartDotLabel,
  destinationCode,
  getBookRouteLabel,
  isTourBookableOnline,
} from "@/lib/tour-display";
import type { CatalogTour } from "@/lib/tour-catalog";

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
  const [hasScrolled, setHasScrolled] = useState(false);

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

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      if (container.scrollLeft > 8) setHasScrolled(true);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const selectedTour = tours.find((t) => t.id === selectedId) ?? tours[0];
  const destination = selectedTour?.to ?? "Luang Prabang";

  return (
    <section
      id="tours"
      className={`relative border-b border-[var(--river-blue)]/10 bg-[var(--chart-paper)] py-12 sm:py-16 scroll-mt-[4.75rem]`}
    >
      <div className="chart-grid absolute inset-0 opacity-[0.35]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-[family-name:var(--font-chart)] text-3xl tracking-[-0.02em] text-[var(--ink)] sm:text-4xl">
            River routes
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--ink-muted)]">
            Eight routes into Laos — by slow boat, van, or train, ending in Luang Prabang,
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
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-[var(--chart-paper)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)]"
                    style={{
                      left,
                      backgroundColor: isSelected
                        ? "var(--marker-yellow)"
                        : "color-mix(in srgb, var(--river-blue) 35%, white)",
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

        <div>
          <nav
            className="mobile-river-chart mb-4 md:hidden"
            aria-label="River route chart"
          >
            <div className="mobile-river-chart__track">
              {tours.map((tour, index) => {
                const isSelected = tour.id === selectedId;
                return (
                  <div key={tour.id} className="mobile-river-chart__leg">
                    {index > 0 ? (
                      <div className="mobile-river-chart__line" aria-hidden />
                    ) : null}
                    <button
                      type="button"
                      onClick={() => scrollToTour(tour.id)}
                      aria-pressed={isSelected}
                      aria-label={`Route ${tour.chartPosition}: ${tour.name}`}
                      className="pressable flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)]"
                    >
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${
                          isSelected
                            ? "bg-[var(--marker-yellow)] text-[var(--ink)] ring-4 ring-[var(--marker-yellow)]/35"
                            : "border-2 border-[var(--river-blue)]/25 bg-white text-[var(--river-blue)]"
                        }`}
                        aria-hidden
                      >
                        {tour.chartPosition}
                      </span>
                    </button>
                  </div>
                );
              })}
              <div className="mobile-river-chart__destination" aria-hidden>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--river-blue)]/30 bg-[var(--river-navy)] text-xs font-bold text-[var(--marker-yellow)]">
                  {destinationCode(destination)}
                </span>
                <span className="pr-1 text-xs font-semibold leading-tight text-[var(--ink-muted)]">
                  {destination}
                </span>
              </div>
            </div>
            {selectedTour ? (
              <p
                className="mt-2 text-sm font-medium text-[var(--river-blue)]"
                aria-live="polite"
              >
                Route {selectedTour.chartPosition} of {tours.length} · {selectedTour.name}
              </p>
            ) : null}
          </nav>

          <div className="min-w-0">
            <div
              ref={scrollRef}
              className="river-routes-carousel flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 xl:grid-cols-3 [&::-webkit-scrollbar]:hidden"
            >
              {tours.map((tour) => {
                const isSelected = tour.id === selectedId;
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
                    className="w-[min(85vw,20rem)] shrink-0 cursor-pointer snap-start md:w-auto"
                  >
                    <div
                      className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_14px_40px_-22px_rgba(27,61,92,0.45)] transition ${
                        isSelected
                          ? "border-[var(--marker-yellow)] ring-2 ring-[var(--marker-yellow)]/45"
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
                        <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--marker-yellow)] text-xs font-bold text-[var(--ink)] shadow-[0_6px_16px_-8px_rgba(15,39,64,0.55)]">
                          {tour.chartPosition}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <TourTierBadge tourId={tour.id} />
                        <h3 className="mt-2 text-lg font-semibold leading-snug text-[var(--ink)]">
                          {tour.name}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">
                          {tour.tagline}
                        </p>
                        <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--river-blue)]">
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
                  </article>
                );
              })}
              <div
                className="w-4 shrink-0 snap-none md:hidden"
                aria-hidden
              />
            </div>

            {!hasScrolled && tours.length > 1 && (
              <p
                className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[var(--ink-muted)] md:hidden"
              >
                {tours.length} routes — swipe to compare
                <IconChevron className="h-3.5 w-3.5 rotate-[-90deg]" />
              </p>
            )}
          </div>
        </div>

        {selectedTour ? (
          <TourDetailPanel tour={selectedTour} inventoryLive={inventoryLive} />
        ) : null}
      </div>
    </section>
  );
}
