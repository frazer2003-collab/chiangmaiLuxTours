import { getTourTierBadge } from "@/lib/tour-display";

export function TourTierBadge({ tourId }: { tourId: string }) {
  const label = getTourTierBadge(tourId);
  if (!label) return null;

  return (
    <span className="inline-flex max-w-full rounded-full bg-[var(--river-blue)]/10 px-2.5 py-0.5 text-xs font-semibold leading-snug text-[var(--river-blue-deep)]">
      {label}
    </span>
  );
}
