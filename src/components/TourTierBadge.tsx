import { getTourTierBadge, isBudgetTour } from "@/lib/tour-display";

export function TourTierBadge({ tourId }: { tourId: string }) {
  const label = getTourTierBadge(tourId);
  if (!label) return null;

  const isBudget = isBudgetTour(tourId);

  return (
    <span
      className={`inline-flex max-w-full rounded-full px-2.5 py-0.5 text-xs font-semibold leading-snug ${
        isBudget
          ? "bg-[var(--marker-yellow)]/25 text-[var(--ink)]"
          : "bg-[var(--river-blue)]/10 text-[var(--river-blue-deep)]"
      }`}
    >
      {label}
    </span>
  );
}
