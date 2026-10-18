export function bookingStatusForStripeRefund(
  paymentMethod: string | null | undefined,
  refundStatus: string | null | undefined,
): "refunded" | "to_refund" | null;

export function manualRefundBlockReason(
  previousStatus: string,
  nextStatus: string,
  hasStripePayment: boolean,
): "use_stripe" | "to_refund_from_stripe" | "refund_in_progress" | null;
