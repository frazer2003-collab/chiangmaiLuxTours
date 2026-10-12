import assert from "node:assert/strict";
import test from "node:test";
import {
  buildBookingEmail,
  shouldNotifyManualConfirmation,
} from "./booking-email.js";

const booking = {
  id: "booking-123",
  guest_name: "Test Guest",
  guest_email: "guest@example.com",
  travel_date: "2026-10-15",
  passengers: 2,
};

test("builds an immediate booking-received alert with a distinct idempotency key", () => {
  const email = buildBookingEmail({
    kind: "received",
    booking,
    routeName: "Chiang Rai to Vang Vieng",
    adminUrl: "https://www.mekong-transfer.com/admin",
  });

  assert.equal(email.idempotencyKey, "booking-received/booking-123");
  assert.match(email.subject, /^Booking received:/);
  assert.match(email.text, /Payment: Pending/);
});

test("builds a paid alert separately from the received alert", () => {
  const email = buildBookingEmail({
    kind: "paid",
    booking,
    routeName: "Chiang Rai to Vang Vieng",
    adminUrl: "https://www.mekong-transfer.com/admin",
  });

  assert.equal(email.idempotencyKey, "booking-paid/booking-123");
  assert.match(email.subject, /^Payment confirmed:/);
  assert.match(email.text, /Payment: Confirmed/);
});

test("only sends the manual-confirmation fallback on a new non-Stripe confirmation", () => {
  assert.equal(shouldNotifyManualConfirmation("pending", "confirmed", null), true);
  assert.equal(shouldNotifyManualConfirmation("confirmed", "confirmed", null), false);
  assert.equal(shouldNotifyManualConfirmation("pending", "confirmed", "pi_123"), false);
  assert.equal(shouldNotifyManualConfirmation("pending", "cancelled", null), false);
});
