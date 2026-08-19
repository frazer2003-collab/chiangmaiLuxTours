import type { Metadata } from "next";
import { GuestLegalPage } from "@/components/GuestLegalPage";
import { CONTACT } from "@/lib/types";

export const metadata: Metadata = {
  title: "Privacy | Mekong Transfer",
  description: "How Mekong Transfer uses passenger details for bookings and border crossing.",
};

export default function PrivacyPage() {
  return (
    <GuestLegalPage title="Privacy">
      <p>
        We collect passenger family name, given name, gender, passport or Thai ID number,
        nationality, date of birth, and a confirmation email so we can complete the booking and
        the border passenger manifest.
      </p>
      <p>
        Payment is processed by Stripe. We do not store card numbers on this website.
      </p>
      <p>
        We use this information to hold seats, confirm payment, and operate the journey. We do
        not sell it. Staff who run the booking calendar can see it in the admin area.
      </p>
      <p>
        Questions about your details: email {CONTACT.email} or WhatsApp {CONTACT.phones[0]}.
        TAT Licence ID {CONTACT.licence}.
      </p>
    </GuestLegalPage>
  );
}
