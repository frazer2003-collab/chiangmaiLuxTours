import { Suspense } from "react";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { BookingCancelledNotice } from "@/components/booking/BookingCancelledNotice";
import { LandingContent } from "@/components/LandingContent";
import { getCatalogTours } from "@/lib/tour-catalog";

export default async function Home() {
  const catalogTours = await getCatalogTours();

  return (
    <BookingProvider catalogTours={catalogTours}>
      <Suspense fallback={null}>
        <BookingCancelledNotice />
      </Suspense>
      <LandingContent catalogTours={catalogTours} />
    </BookingProvider>
  );
}
