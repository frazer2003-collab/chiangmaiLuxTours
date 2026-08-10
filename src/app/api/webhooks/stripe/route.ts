import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";
import { getStripeWebhookSecret } from "@/lib/stripe/env";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const bookingId =
      session.metadata?.booking_id ?? session.client_reference_id ?? null;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? session.id;

    if (!bookingId) {
      console.error("Stripe checkout.session.completed missing booking_id");
      return NextResponse.json({ received: true });
    }

    try {
      const supabase = createServiceClient();
      const { error } = await supabase.rpc("confirm_booking_payment", {
        p_booking_id: bookingId,
        p_stripe_payment_id: paymentIntentId,
      });

      if (error) {
        console.error("confirm_booking_payment failed:", error.message);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
    } catch (error) {
      console.error("Webhook booking confirm error:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId =
      session.metadata?.booking_id ?? session.client_reference_id ?? null;

    if (bookingId) {
      try {
        const supabase = createServiceClient();
        await supabase.rpc("cancel_pending_booking", { p_booking_id: bookingId });
      } catch (error) {
        console.error("cancel_pending_booking on expire failed:", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
