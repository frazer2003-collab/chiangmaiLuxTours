import { tours as staticTours } from "@/lib/tours";
import type { Tour } from "@/lib/types";
import { createServiceClient } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  formatPriceThb,
  parsePriceThbFromLabel,
  type AvailableDate,
  type CatalogTourDate,
} from "@/lib/db/types";

export type CatalogTour = Tour & {
  priceThb: number;
  availableDates: CatalogTourDate[];
};

function buildFallbackCatalog(): CatalogTour[] {
  return staticTours.map((tour) => ({
    ...tour,
    priceThb: parsePriceThbFromLabel(tour.price),
    availableDates: tour.demoDates.map((date) => ({
      date,
      spotsLeft: 20,
      capacity: 20,
    })),
  }));
}

export async function getCatalogTours(): Promise<CatalogTour[]> {
  if (!isSupabaseConfigured()) {
    return buildFallbackCatalog();
  }

  try {
    const supabase = createServiceClient();
    const [toursRes, datesRes] = await Promise.all([
      supabase.from("tours").select("id, price_thb"),
      supabase
        .from("tour_dates")
        .select("id, tour_id, date, capacity, booked_count")
        .gte("date", new Date().toISOString().slice(0, 10))
        .order("date"),
    ]);

    if (toursRes.error) throw toursRes.error;
    if (datesRes.error) throw datesRes.error;

    const priceById = new Map(
      (toursRes.data ?? []).map((row) => [row.id, row.price_thb as number]),
    );

    const datesByTour = new Map<string, CatalogTourDate[]>();
    for (const row of datesRes.data ?? []) {
      const spotsLeft = Math.max(0, row.capacity - row.booked_count);
      if (spotsLeft <= 0) continue;
      const list = datesByTour.get(row.tour_id) ?? [];
      list.push({
        id: row.id,
        date: row.date,
        spotsLeft,
        capacity: row.capacity,
      });
      datesByTour.set(row.tour_id, list);
    }

    return staticTours.map((tour) => {
      const priceThb =
        priceById.get(tour.id) ?? parsePriceThbFromLabel(tour.price);
      const availableDates = datesByTour.get(tour.id) ?? [];
      return {
        ...tour,
        price: formatPriceThb(priceThb),
        priceThb,
        availableDates,
        demoDates: availableDates.map((d) => d.date),
      };
    });
  } catch {
    return buildFallbackCatalog();
  }
}

export function getTourFromCatalog(
  catalog: CatalogTour[],
  id: string,
): CatalogTour | undefined {
  return catalog.find((t) => t.id === id);
}
