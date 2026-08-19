import { Suspense } from "react";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { BookingCancelledNotice } from "@/components/booking/BookingCancelledNotice";
import { LandingContent } from "@/components/LandingContent";
import { getCatalog } from "@/lib/tour-catalog";

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
