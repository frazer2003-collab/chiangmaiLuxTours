import { BOOK_ROUTE_LABEL } from "@/lib/guest-ui";
import type { CatalogTour } from "@/lib/tour-catalog";

const TIER_BADGES: Record<string, string> = {
  "chiang-mai-luang-prabang": "Premium slow boat · 2 days",
  "chiang-rai-luang-prabang": "Premium slow boat · 1 day",
  "chiang-khong-luang-prabang": "Slow boat · 1 day",
  "huay-xai-luang-prabang": "Slow boat · 1 day",
  "chiang-rai-slowboat-luang-prabang": "Van + slow boat · 2 days",
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
 * Chart labels name whatever actually distinguishes a route: the departure hub
 * for the four original boat routes, and the mode or destination for the five
 * that all leave from Chiang Rai.
 */
const CHART_LABELS: Record<string, string> = {
  "chiang-mai-luang-prabang": "Chiang Mai",
  "chiang-rai-luang-prabang": "Chiang Rai",
  "chiang-khong-luang-prabang": "Chiang Khong",
  "huay-xai-luang-prabang": "Huay Xai",
  "chiang-rai-slowboat-luang-prabang": "Slow boat",
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

export function chartHubLabel(tour: CatalogTour): string {
  return CHART_LABELS[tour.id] ?? tour.from;
}

export function chartDotLabel(tour: CatalogTour): string {
  return chartHubLabel(tour);
}

/** Short badge for the mobile chart's destination marker. */
export function destinationCode(destination: string): string {
  return DESTINATION_CODES[destination] ?? destination.slice(0, 3).toUpperCase();
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
