export function getStripeSecretKey(): string | undefined {
  return process.env.STRIPE_SECRET_KEY?.trim();
}

export function getStripeWebhookSecret(): string | undefined {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim();
}

export function getStripePublishableKey(): string | undefined {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
}

/** Server: secret key present (Checkout + webhooks). */
export function isStripeConfigured(): boolean {
  return Boolean(getStripeSecretKey());
}

/** Client-safe: publishable key exposed for UI hints. */
export function isStripePublicConfigured(): boolean {
  return Boolean(getStripePublishableKey());
}

export { getSiteUrl } from "@/lib/site-url";

/** Stripe amounts for THB are in satang (1/100 baht). */
export function thbToStripeAmount(baht: number): number {
  return Math.round(baht * 100);
}

export function formatThbTotal(baht: number): string {
  return `฿${baht.toLocaleString("en-US")}`;
}
