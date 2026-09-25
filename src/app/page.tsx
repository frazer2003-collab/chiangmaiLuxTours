import { Suspense } from "react";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { BookingCancelledNotice } from "@/components/booking/BookingCancelledNotice";
import { LandingContent } from "@/components/LandingContent";
import { getCatalog } from "@/lib/tour-catalog";

// Seat availability changes as people book, and a Supabase outage at build
// time would otherwise freeze the page into its WhatsApp-only fallback until
// someone redeployed. Regenerating on an interval lets it recover on its own.
export const revalidate = 60;

export default async function Home() {
  const { tours, inventoryLive } = await getCatalog();

  return (
    <BookingProvider catalogTours={tours} inventoryLive={inventoryLive}>
      <Suspense fallback={null}>
        <BookingCancelledNotice />
      </Suspense>
      <LandingContent catalogTours={tours} inventoryLive={inventoryLive} />
    </BookingProvider>
  );
}
