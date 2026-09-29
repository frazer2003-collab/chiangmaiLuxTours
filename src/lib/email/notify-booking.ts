import { createServiceClient } from "@/lib/supabase/service";
import { getCatalogTours, getTourFromCatalog } from "@/lib/tour-catalog";
import { PRODUCTION_SITE_URL } from "@/lib/site-url";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_NOTIFY_EMAIL = "thunniti2513@gmail.com";
const DEFAULT_FROM_EMAIL = "Mekong Transfer <bookings@mekong-transfer.com>";

type NotifyConfig = {
  apiKey: string;
  to: string;
  from: string;
};

function getNotifyConfig(): NotifyConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return {
    apiKey,
    to: process.env.BOOKING_NOTIFY_EMAIL?.trim() || DEFAULT_NOTIFY_EMAIL,
    from: process.env.BOOKING_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL,
  };
}

function formatTravelDate(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Emails staff that a website booking has been paid. Passport and ID numbers
 * stay in the admin panel — they are never put in an email.
 *
 * Returns normally when email is not configured, so a missing key never fails
 * a booking that Stripe has already charged. Throws when a configured send
 * fails, so the Stripe webhook returns 500 and Stripe retries.
 */
export async function notifyStaffOfPaidBooking(bookingId: string): Promise<void> {
  const config = getNotifyConfig();
  if (!config) {
    console.warn("Booking email not sent: RESEND_API_KEY is not set.");
    return;
  }

  const supabase = createServiceClient();
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("id, tour_id, travel_date, passengers, guest_name, guest_email, status")
    .eq("id", bookingId)
    .single();

  if (error || !booking) {
    throw new Error(`Could not load booking ${bookingId} for notification: ${error?.message ?? "not found"}`);
  }

  if (booking.status !== "confirmed") {
    console.warn(`Booking email not sent: booking ${bookingId} is ${booking.status}, not confirmed.`);
    return;
  }

  const tour = getTourFromCatalog(await getCatalogTours(), booking.tour_id);
  const routeName = tour?.name ?? booking.tour_id;
  const travelDate = formatTravelDate(booking.travel_date);
  const passengerLabel = booking.passengers === 1 ? "1 passenger" : `${booking.passengers} passengers`;

  const text = [
    "A new booking has been paid on the website.",
    "",
    `Guest: ${booking.guest_name}`,
    `Guest email: ${booking.guest_email}`,
    `Route: ${routeName}`,
    `Departure: ${travelDate}`,
    `Passengers: ${passengerLabel}`,
    `Reference: ${booking.id}`,
    "",
    `Open the admin: ${PRODUCTION_SITE_URL}/admin`,
  ].join("\n");

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      // Stripe can deliver the same webhook more than once; this keeps it to one email.
      "Idempotency-Key": `booking/${booking.id}`,
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: booking.guest_email,
      subject: `New booking: ${routeName} · ${travelDate}`,
      text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend rejected booking email (${response.status}): ${detail}`);
  }
}
