import { createServiceClient } from "@/lib/supabase/service";
import { getCatalogTours, getTourFromCatalog } from "@/lib/tour-catalog";
import { PRODUCTION_SITE_URL } from "@/lib/site-url";
import {
  buildBookingEmail,
  type BookingEmailKind,
} from "@/lib/email/booking-email";

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

/**
 * Emails staff without including passport or ID numbers. Throws when a
 * configured send fails so callers can decide whether to retry or continue.
 */
async function sendBookingNotification(
  bookingId: string,
  kind: BookingEmailKind,
): Promise<void> {
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

  if (kind !== "received" && booking.status !== "confirmed") {
    console.warn(`Booking email not sent: booking ${bookingId} is ${booking.status}, not confirmed.`);
    return;
  }

  const tour = getTourFromCatalog(await getCatalogTours(), booking.tour_id);
  const routeName = tour?.name ?? booking.tour_id;
  const email = buildBookingEmail({
    kind,
    booking,
    routeName,
    adminUrl: `${PRODUCTION_SITE_URL}/admin`,
  });

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": email.idempotencyKey,
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: booking.guest_email,
      subject: email.subject,
      text: email.text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend rejected booking email (${response.status}): ${detail}`);
  }
}

export async function notifyStaffOfBookingReceived(bookingId: string): Promise<void> {
  await sendBookingNotification(bookingId, "received");
}

export async function notifyStaffOfPaidBooking(bookingId: string): Promise<void> {
  await sendBookingNotification(bookingId, "paid");
}

export async function notifyStaffOfManualConfirmation(bookingId: string): Promise<void> {
  await sendBookingNotification(bookingId, "manual");
}
