import { BookingProvider } from "@/components/booking/BookingProvider";
import { LandingContent } from "@/components/LandingContent";

export default function Home() {
  return (
    <BookingProvider>
      <LandingContent />
    </BookingProvider>
  );
}
