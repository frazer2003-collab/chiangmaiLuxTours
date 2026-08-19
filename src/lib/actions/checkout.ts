"use server";

import { submitBooking } from "@/lib/actions/booking";
import { getCatalog, getTourFromCatalog } from "@/lib/tour-catalog";
import { createServiceClient } from "@/lib/supabase/service";
import { isStripeConfigured, getSiteUrl, thbToStripeAmount } from "@/lib/stripe/env";
import { getStripe } from "@/lib/stripe/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { DATES_UNAVAILABLE } from "@/lib/guest-legal";

import type { PassengerFormState } from "@/lib/booking-passengers";

export type StartCheckoutResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; error: string };

export async function startStripeCheckout(input: {
  tourId: string;
  date: string;
  passengers: number;
  passengerForms: PassengerFormState[];
  email: string;
  allowedDates: string[];
}): Promise<StartCheckoutResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: DATES_UNAVAILABLE };
  }

  if (!isStripeConfigured()) {
    return {
      ok: false,
      error: "Online payment is not configured yet. Contact us by phone or email to reserve.",
    };
  }

  const { tours, inventoryLive } = await getCatalog();
  if (!inventoryLive) {
    return { ok: false, error: DATES_UNAVAILABLE };
  }

  const tour = getTourFromCatalog(tours, input.tourId);
  if (!tour) {
    return { ok: false, error: "That route is no longer available." };
  }

  const bookingResult = await submitBooking(input);
  if (!bookingResult.ok) {
    return { ok: false, error: bookingResult.error };
  }

  const passengerCount = Math.min(12, Math.max(1, Math.floor(input.passengers)));
  const unitBaht = tour.priceThb;
  const totalBaht = unitBaht * passengerCount;

  if (unitBaht <= 0 || totalBaht <= 0) {
    return { ok: false, error: "Could not calculate the trip price. Please contact us." };
  }

  const siteUrl = getSiteUrl();
  const stripe = getStripe();

  const dateLabel = new Date(input.date + "T12:00:00").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: input.email.trim().toLowerCase(),
      client_reference_id: bookingResult.bookingId,
      metadata: {
        booking_id: bookingResult.bookingId,
        tour_id: tour.id,
        travel_date: input.date,
        passengers: String(passengerCount),
      },
      line_items: [
        {
          quantity: passengerCount,
          price_data: {
            currency: "thb",
            unit_amount: thbToStripeAmount(unitBaht),
            product_data: {
              name: tour.name,
              description: `Departure ${dateLabel} · ${tour.routeDetail}`,
            },
          },
        },
      ],
      payment_method_types: ["card", "promptpay"],
      success_url: `${siteUrl}/booking/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?booking=cancelled`,
    });

    if (!session.url) {
      return { ok: false, error: "Could not start payment. Please try again." };
    }

    return { ok: true, checkoutUrl: session.url };
  } catch (error) {
    console.error("Stripe Checkout session failed:", error);

    try {
      const supabase = createServiceClient();
      await supabase.rpc("cancel_pending_booking", {
        p_booking_id: bookingResult.bookingId,
      });
    } catch {
      // Best-effort cleanup
    }

    return { ok: false, error: "Could not start payment. Please try again." };
  }
}

export type CheckoutSessionSummary = {
  paid: boolean;
  bookingId: string | null;
  tourName: string | null;
  email: string | null;
  totalThb: number | null;
};

export async function getCheckoutSessionSummary(
  sessionId: string,
): Promise<CheckoutSessionSummary | null> {
  if (!isStripeConfigured() || !sessionId) return null;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    const paid = session.payment_status === "paid";
    const bookingId =
      session.metadata?.booking_id ?? session.client_reference_id ?? null;
    const email = session.customer_details?.email ?? session.customer_email ?? null;

    let totalThb: number | null = null;
    if (session.amount_total != null) {
      totalThb = Math.round(session.amount_total / 100);
    }

    let tourName: string | null = null;
    const tourId = session.metadata?.tour_id;
    if (tourId) {
      const { tours } = await getCatalog();
      tourName = getTourFromCatalog(tours, tourId)?.name ?? null;
    }

    return { paid, bookingId, tourName, email, totalThb };
  } catch {
    return null;
  }
}
