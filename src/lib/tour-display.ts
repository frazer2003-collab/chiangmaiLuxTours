import { BOOK_ROUTE_LABEL } from "@/lib/guest-ui";
import type { CatalogTour } from "@/lib/tour-catalog";

const TIER_BADGES: Record<string, string> = {
  "chiang-mai-luang-prabang": "Premium slow boat · 2 days",
  "chiang-rai-luang-prabang": "Premium slow boat · 1 day",
  "chiang-khong-luang-prabang": "Slow boat · 1 day",
  "huay-xai-luang-prabang": "Slow boat · 1 day",
  "chiang-rai-slowboat-luang-prabang": "Van + slow boat · 2 days",
  "chiang-rai-train-luang-prabang": "Van + train · 1 day",
};

export function getTourTierBadge(tourId: string): string | null {
  return TIER_BADGES[tourId] ?? null;
}

export function chartHubLabel(tour: CatalogTour): string {
  if (tour.id === "chiang-rai-slowboat-luang-prabang") return "Chiang Rai · Slow boat";
  if (tour.id === "chiang-rai-train-luang-prabang") return "Chiang Rai · Train";
  if (tour.from === "Huay Xai") return "Huay Xai";
  return tour.from;
}

export function chartDotLabel(tour: CatalogTour): string {
  const hub = chartHubLabel(tour);
  if (hub.includes("·")) return hub.split("·")[1]?.trim() ?? hub;
  return hub;
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
