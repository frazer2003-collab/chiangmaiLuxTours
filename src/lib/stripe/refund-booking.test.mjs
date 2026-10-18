import assert from "node:assert/strict";
import test from "node:test";
import {
  bookingStatusForStripeRefund,
  manualRefundBlockReason,
} from "./refund-booking.js";

test("marks a card refund refunded while Stripe is still finishing it", () => {
  assert.equal(bookingStatusForStripeRefund("card", "pending"), "refunded");
  assert.equal(bookingStatusForStripeRefund("card", "succeeded"), "refunded");
});

test("keeps a PromptPay refund as to refund until Stripe succeeds", () => {
  assert.equal(bookingStatusForStripeRefund("promptpay", "requires_action"), "to_refund");
  assert.equal(bookingStatusForStripeRefund("promptpay", "pending"), "to_refund");
  assert.equal(bookingStatusForStripeRefund("promptpay", "succeeded"), "refunded");
});

test("does not change the booking when Stripe rejects the refund", () => {
  assert.equal(bookingStatusForStripeRefund("promptpay", "failed"), null);
  assert.equal(bookingStatusForStripeRefund("card", "canceled"), null);
});

test("keeps a refund that still needs the guest bank account as to refund", () => {
  assert.equal(bookingStatusForStripeRefund("card", "requires_action"), "to_refund");
  assert.equal(bookingStatusForStripeRefund(null, "requires_action"), "to_refund");
});

test("does not let staff reopen seats while a PromptPay refund is still outstanding", () => {
  assert.equal(manualRefundBlockReason("to_refund", "confirmed", true), "refund_in_progress");
  assert.equal(manualRefundBlockReason("to_refund", "cancelled", true), null);
  assert.equal(manualRefundBlockReason("to_refund", "refunded", true), null);
});

test("lets staff mark refunded only after a PromptPay refund is waiting, or when there is no Stripe payment", () => {
  assert.equal(manualRefundBlockReason("confirmed", "refunded", true), "use_stripe");
  assert.equal(manualRefundBlockReason("to_refund", "refunded", true), null);
  assert.equal(manualRefundBlockReason("confirmed", "refunded", false), null);
  assert.equal(manualRefundBlockReason("confirmed", "to_refund", false), "to_refund_from_stripe");
});
