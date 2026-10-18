import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";
import { notifyStaffOfPaidBooking } from "@/lib/email/notify-booking";
import { setBookingStatus } from "@/lib/bookings/set-booking-status";
import type { DbBooking } from "@/lib/db/types";
import { getStripeWebhookSecret } from "@/lib/stripe/env";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

function getBookingId(session: Stripe.Checkout.Session): string | null {
  return session.metadata?.booking_id ?? session.client_reference_id ?? null;
}

function getPaymentReference(session: Stripe.Checkout.Session): string {
  return typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id ?? session.id;
}

async function confirmBookingPayment(session: Stripe.Checkout.Session): Promise<string | null> {
  const bookingId = getBookingId(session);
  if (!bookingId) {
    console.error("Stripe webhook missing booking_id on session", session.id);
    return null;
  }

  const supabase = createServiceClient();
  const { error } = await supabase.rpc("confirm_booking_payment", {
    p_booking_id: bookingId,
    p_stripe_payment_id: getPaymentReference(session),
  });

  // A Stripe retry after a failed email lands here with the booking already
  // confirmed; carry on so the notification still goes out.
  if (error && !error.message.includes("booking_not_pending")) {
    console.error("confirm_booking_payment failed:", error.message);
    throw new Error("Database update failed");
  }

  await notifyStaffOfPaidBooking(bookingId);

  return bookingId;
}

async function markSucceededRefund(refund: Stripe.Refund): Promise<void> {
  if (refund.status !== "succeeded") return;

  const bookingId = refund.metadata?.booking_id ?? null;
  const paymentIntentId =
    typeof refund.payment_intent === "string" ? refund.payment_intent : null;
  if (!bookingId && !paymentIntentId) return;

  const supabase = createServiceClient();
  const request = supabase.from("bookings").select("*");
  const { data, error } = await (bookingId
    ? request.eq("id", bookingId)
    : request.eq("stripe_payment_id", paymentIntentId)
  ).maybeSingle();

  if (error) throw new Error(error.message);
  if (!data || data.status === "refunded") return;

  const result = await setBookingStatus(supabase, data as DbBooking, {
    status: "refunded",
    internalNotes: data.internal_notes,
    refundNote: data.refund_note,
    stripeRefundId: refund.id,
  });
  if (!result.ok) throw new Error(result.error);
}

async function cancelPendingBooking(session: Stripe.Checkout.Session): Promise<void> {
  const bookingId = getBookingId(session);
  if (!bookingId) return;

  const supabase = createServiceClient();
  await supabase.rpc("cancel_pending_booking", { p_booking_id: bookingId });
}

export async function POST(request: Request) {
  const webhookSecret = getStripeWebhookSecret();
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;

      // Cards and Apple Pay are paid immediately; PromptPay completes via async_payment_succeeded.
      if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true });
      }

      await confirmBookingPayment(session);
    }

    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await cancelPendingBooking(session);
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      await cancelPendingBooking(session);
    }

    if (event.type === "refund.updated" || event.type === "refund.created") {
      await markSucceededRefund(event.data.object as Stripe.Refund);
    }
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
