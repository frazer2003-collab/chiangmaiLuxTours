import { BOOK_ROUTE_LABEL } from "@/lib/guest-ui";
import type { CatalogTour } from "@/lib/tour-catalog";

const TIER_BADGES: Record<string, string> = {
  "chiang-rai-luang-prabang": "Luxury slow boat · 2 days",
  "chiang-rai-slowboat-luang-prabang": "Local boat · 2 days",
  "chiang-khong-luang-prabang": "Luxury slow boat · 2 days",
  "chiang-rai-train-luang-prabang": "Van + train · 1 day",
  "chiang-rai-train-vang-vieng": "Van + train · 1 day",
  "chiang-rai-train-vientiane": "Van + train · 1 day",
};

const BUDGET_TOUR_IDS = new Set([
  "chiang-rai-slowboat-luang-prabang",
  "chiang-rai-train-luang-prabang",
  "chiang-rai-train-vang-vieng",
  "chiang-rai-train-vientiane",
]);

/**
 * Chart labels name whatever distinguishes a route: the boat type when two
 * Chiang Rai boats share a destination, otherwise the hub or train destination.
 */
const CHART_LABELS: Record<string, string> = {
  "chiang-rai-luang-prabang": "Luxury boat",
  "chiang-rai-slowboat-luang-prabang": "Local boat",
  "chiang-khong-luang-prabang": "Chiang Khong",
  "chiang-rai-train-luang-prabang": "Train · Luang Prabang",
  "chiang-rai-train-vang-vieng": "Train · Vang Vieng",
  "chiang-rai-train-vientiane": "Train · Vientiane",
};

const DESTINATION_CODES: Record<string, string> = {
  "Luang Prabang": "LP",
  "Vang Vieng": "VV",
  Vientiane: "VTE",
};

export function getTourTierBadge(tourId: string): string | null {
  return TIER_BADGES[tourId] ?? null;
}

export function isBudgetTour(tourId: string): boolean {
  return BUDGET_TOUR_IDS.has(tourId);
}

export function chartHubLabel(tour: { id: string; from: string }): string {
  return CHART_LABELS[tour.id] ?? tour.from;
}

export function chartDotLabel(tour: CatalogTour): string {
  return chartHubLabel(tour);
}

/** Short badge for the mobile chart's destination marker. */
export function destinationCode(destination: string): string {
  return DESTINATION_CODES[destination] ?? destination.slice(0, 3).toUpperCase();
}

/**
 * Route label for staff pickers. Several routes share Chiang Rai or Luang
 * Prabang, so the transport tier is what staff need to tell them apart.
 */
export function adminRouteLabel(tour: { id: string; from: string; to: string }): string {
  const tier = TIER_BADGES[tour.id];
  const route = `${tour.from} → ${tour.to}`;
  return tier ? `${route} · ${tier}` : route;
}

export function tourHasOpenDates(tour: CatalogTour): boolean {
  const dates = tour.availableDates?.length
    ? tour.availableDates.map((d) => d.date)
    : tour.demoDates;
  return (dates?.length ?? 0) > 0;
}

export function isTourBookableOnline(tour: CatalogTour, inventoryLive: boolean): boolean {
  return inventoryLive && tourHasOpenDates(tour);
}

export function getBookRouteLabel(tour: CatalogTour, inventoryLive: boolean): string {
  if (!inventoryLive) return "WhatsApp to enquire";
  if (!tourHasOpenDates(tour)) return "Check availability";
  return BOOK_ROUTE_LABEL;
}
