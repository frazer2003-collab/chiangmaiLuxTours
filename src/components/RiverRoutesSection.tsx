"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BookTourButton } from "@/components/booking/BookTourButton";
import { TourDetailPanel } from "@/components/TourDetailPanel";
import { IconChevron } from "@/components/icons";
import { BOOK_ROUTE_LABEL, anchorSection, btnBookRoute } from "@/lib/guest-ui";
import type { CatalogTour } from "@/lib/tour-catalog";

function hubShort(from: string): string {
  if (from === "Huay Xai") return "Huay Xai";
  return from;
}

export function RiverRoutesSection({ tours }: { tours: CatalogTour[] }) {
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

  return (
    <section
      id="tours"
      className={`relative border-b border-[var(--river-blue)]/10 bg-[var(--chart-paper)] py-12 sm:py-16 ${anchorSection}`}
    >
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

        <div
          className="mb-10 hidden md:block"
          role="tablist"
          aria-label="Route chart"
        >
          <div className="relative h-2 rounded-full bg-[var(--river-blue)]/10">
            {tours.map((tour) => {
              const isSelected = tour.id === selectedId;
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
                    left: `${(tour.chartPosition - 1) * 28 + 8}%`,
                    backgroundColor: isSelected
                      ? "var(--marker-yellow)"
                      : "color-mix(in srgb, var(--river-blue) 35%, white)",
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 md:block">
          <nav
            className="mobile-river-chart shrink-0 md:hidden"
            aria-label="River route chart"
          >
            <ol className="flex flex-col">
              {tours.map((tour, index) => {
                const isSelected = tour.id === selectedId;
                return (
                  <li key={tour.id} className="mobile-river-chart__leg">
                    <button
                      type="button"
                      onClick={() => scrollToTour(tour.id)}
                      aria-pressed={isSelected}
                      aria-label={`Route ${tour.chartPosition}: ${tour.name}`}
                      className={`mobile-river-chart__waypoint group w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--river-blue)] ${
                        isSelected ? "mobile-river-chart__waypoint--active" : ""
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                          isSelected
                            ? "bg-[var(--marker-yellow)] text-[var(--ink)] ring-4 ring-[var(--marker-yellow)]/35"
                            : "border-2 border-[var(--river-blue)]/25 bg-white text-[var(--river-blue)] group-active:bg-[var(--chart-paper)]"
                        }`}
                        aria-hidden
                      >
                        {tour.chartPosition}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-xs font-semibold leading-tight ${
                            isSelected ? "text-[var(--ink)]" : "text-[var(--ink-muted)]"
                          }`}
                        >
                          {hubShort(tour.from)}
                        </span>
                        <span className="block truncate text-xs leading-tight text-[var(--ink-muted)]">
                          {tour.duration}
                        </span>
                      </span>
                    </button>
                    {index < tours.length - 1 && (
                      <div className="mobile-river-chart__line" aria-hidden />
                    )}
                  </li>
                );
              })}
            </ol>
            <div className="mobile-river-chart__destination" aria-hidden>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--river-blue)]/30 bg-[var(--river-navy)] text-xs font-bold text-[var(--marker-yellow)]">
                LP
              </span>
              <span className="text-xs font-semibold leading-tight text-[var(--ink-muted)]">
                Luang Prabang
              </span>
            </div>
          </nav>

          <div className="min-w-0 flex-1 md:w-auto">
            {selectedTour && (
              <p
                className="mb-3 text-xs font-medium text-[var(--river-blue)] md:hidden"
                aria-live="polite"
              >
                Viewing: {selectedTour.from} → Luang Prabang
              </p>
            )}

            <div
              ref={scrollRef}
              className="river-routes-carousel flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 scroll-ps-4 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden"
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
                    className="w-[min(78vw,17.5rem)] shrink-0 cursor-pointer snap-start md:w-auto"
                  >
                    <div
                      className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_14px_40px_-22px_rgba(27,61,92,0.45)] transition ${
                        isSelected
                          ? "border-[var(--marker-yellow)] ring-2 ring-[var(--marker-yellow)]/45"
                          : "border-[var(--river-blue)]/18"
                      }`}
                    >
                      <div className="relative aspect-[4/3] bg-[linear-gradient(145deg,var(--river-blue)_0%,var(--river-blue-deep)_55%,var(--river-navy)_100%)]">
                        <div className="absolute inset-0 flex items-end p-4">
                          <span className="rounded-md bg-black/35 px-2 py-1 text-xs font-medium uppercase tracking-wider text-white/90">
                            Photo placeholder
                          </span>
                        </div>
                        <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--marker-yellow)] text-xs font-bold text-[var(--ink)]">
                          {tour.chartPosition}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <h3 className="text-lg font-semibold leading-snug text-[var(--ink)]">
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
                        <BookTourButton tourId={tour.id} className={`mt-5 ${btnBookRoute}`}>
                          {BOOK_ROUTE_LABEL}
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
                aria-hidden
              >
                Swipe for more routes
                <IconChevron className="h-3.5 w-3.5 rotate-[-90deg]" />
              </p>
            )}
          </div>
        </div>

        {selectedTour ? <TourDetailPanel tour={selectedTour} /> : null}
      </div>
    </section>
  );
}
