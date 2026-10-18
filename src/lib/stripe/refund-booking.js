/**
 * Card refunds finish inside Stripe, so the booking can be marked refunded
 * immediately. PromptPay stays "to refund" while Stripe is waiting on the
 * guest's bank details or the transfer, matching Stripe's pending display.
 *
 * @param {string | null | undefined} paymentMethod
 * @param {string | null | undefined} refundStatus
 * @returns {"refunded" | "to_refund" | null}
 */
export function bookingStatusForStripeRefund(paymentMethod, refundStatus) {
  if (refundStatus === "failed" || refundStatus === "canceled") return null;
  if (refundStatus === "succeeded") return "refunded";
  // PromptPay, and any refund still waiting on a bank account, stays open
  // even if the payment method could not be read.
  if (paymentMethod === "promptpay" || refundStatus === "requires_action") return "to_refund";
  return "refunded";
}

/**
 * A paid booking has to go through Stripe first. Staff can set Refunded
 * themselves once the PromptPay refund is already waiting, or immediately
 * when the booking was never paid in Stripe.
 *
 * @param {string} previousStatus
 * @param {string} nextStatus
 * @param {boolean} hasStripePayment
 * @returns {"use_stripe" | "to_refund_from_stripe" | "refund_in_progress" | null}
 */
export function manualRefundBlockReason(previousStatus, nextStatus, hasStripePayment) {
  if (
    previousStatus === "to_refund" &&
    nextStatus !== "to_refund" &&
    nextStatus !== "refunded" &&
    nextStatus !== "cancelled"
  ) {
    return "refund_in_progress";
  }
  if (nextStatus === "to_refund" && previousStatus !== "to_refund") {
    return "to_refund_from_stripe";
  }
  if (
    nextStatus === "refunded" &&
    previousStatus !== "refunded" &&
    previousStatus !== "to_refund" &&
    hasStripePayment
  ) {
    return "use_stripe";
  }
  return null;
}
