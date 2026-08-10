import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";
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

  if (error) {
    console.error("confirm_booking_payment failed:", error.message);
    throw new Error("Database update failed");
  }

  return bookingId;
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
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
