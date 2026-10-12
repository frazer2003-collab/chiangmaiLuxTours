const APEX_HOST = "mekong-transfer.com";
const CANONICAL_HOST = "www.mekong-transfer.com";
const STRIPE_WEBHOOK_PATH = "/api/webhooks/stripe";

/**
 * Keeps Stripe's already-configured apex webhook URL working while sending
 * every normal page to the canonical www host.
 *
 * @param {string} requestUrl
 * @param {string | null} hostHeader
 * @returns {string | null}
 */
export function getCanonicalRedirectUrl(requestUrl, hostHeader) {
  const host = hostHeader?.split(":")[0]?.toLowerCase();
  if (host !== APEX_HOST) return null;

  const url = new URL(requestUrl);
  if (url.pathname === STRIPE_WEBHOOK_PATH) return null;

  url.hostname = CANONICAL_HOST;
  url.port = "";
  return url.toString();
}
