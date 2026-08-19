import type { Metadata } from "next";
import { GuestLegalPage } from "@/components/GuestLegalPage";
import { CONTACT } from "@/lib/types";

export const metadata: Metadata = {
  title: "Booking terms | Mekong Transfer",
  description: "How payment, seat holds, and changes work for Mekong Transfer bookings.",
};

export default function BookingTermsPage() {
  return (
    <GuestLegalPage title="Booking terms">
      <p>
        Mekong Transfer (TAT Licence ID {CONTACT.licence}) sells slow-boat journeys from Chiang
        Mai, Chiang Rai, Chiang Khong, and Huay Xai to Luang Prabang.
      </p>
      <p>
        <strong className="font-semibold text-[var(--ink)]">Pay now</strong> holds your seats and
        opens Stripe Checkout. If you close Stripe without paying, those seats are released.
      </p>
      <p>
        After payment, screenshot your booking reference. To change or cancel, WhatsApp{" "}
        {CONTACT.phones[0]} or email {CONTACT.email} before departure. We handle that case by
        case. We do not promise an automatic refund or a fixed no-show fee.
      </p>
      <p>
        Open dates and remaining seats come from our live calendar. If dates cannot be loaded,
        online booking is paused — contact us to reserve.
      </p>
      <p>
        Passport or Thai ID details are required for the passenger manifest and border crossing.
        You are responsible for valid travel documents.
      </p>
    </GuestLegalPage>
  );
}
