import test from "node:test";
import assert from "node:assert/strict";
import { getCanonicalRedirectUrl } from "./canonical-host.js";

test("keeps the apex Stripe webhook on the apex domain", () => {
  assert.equal(
    getCanonicalRedirectUrl(
      "https://mekong-transfer.com/api/webhooks/stripe",
      "mekong-transfer.com",
    ),
    null,
  );
});

test("redirects other apex requests to www and preserves path and query", () => {
  assert.equal(
    getCanonicalRedirectUrl(
      "https://mekong-transfer.com/booking-terms?from=email",
      "mekong-transfer.com",
    ),
    "https://www.mekong-transfer.com/booking-terms?from=email",
  );
});

test("does not redirect www or local development requests", () => {
  assert.equal(
    getCanonicalRedirectUrl(
      "https://www.mekong-transfer.com/admin",
      "www.mekong-transfer.com",
    ),
    null,
  );
  assert.equal(
    getCanonicalRedirectUrl("http://localhost:3000/admin", "localhost:3000"),
    null,
  );
});
