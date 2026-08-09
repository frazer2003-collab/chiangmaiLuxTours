import { BookingProvider } from "@/components/booking/BookingProvider";
import { LandingContent } from "@/components/LandingContent";
import { getCatalogTours } from "@/lib/tour-catalog";

export default async function Home() {
  const catalogTours = await getCatalogTours();

  return (
    <BookingProvider catalogTours={catalogTours}>
      <LandingContent catalogTours={catalogTours} />
    </BookingProvider>
  );
}
