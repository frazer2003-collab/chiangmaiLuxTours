# Stripe setup — mekong-transfer.com

Do this after https://mekong-transfer.com loads in the browser (see **DOMAIN_SETUP.md** first).

## 1. Vercel environment

**Settings → Environment Variables** (Production):

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://mekong-transfer.com` |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` or `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | From step 2 (`whsec_...`) |

Redeploy after changes.

## 2. Stripe webhook (`STRIPE_WEBHOOK_SECRET`)

1. [Stripe → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. **Add endpoint**
3. URL: **`https://mekong-transfer.com/api/webhooks/stripe`**
4. Events: `checkout.session.completed`, `checkout.session.expired`
5. Save → open endpoint → **Signing secret** → **Reveal** → copy `whsec_...`
6. Add to Vercel as `STRIPE_WEBHOOK_SECRET` → redeploy

## 3. Apple Pay domain

1. [Stripe → Payment methods → Apple Pay](https://dashboard.stripe.com/settings/payment_methods)
2. **Configure domains** → add **`mekong-transfer.com`**
3. Complete verification (DNS TXT or hosted file)

## 4. Payment methods

- Settings → Business → Thailand + THB
- Payment methods → Cards, **PromptPay**, **Apple Pay**

## 5. Supabase migration

Run if not applied:

`supabase/migrations/20260809140000_stripe_booking_confirm.sql`

## 6. Smoke test

1. Book on https://mekong-transfer.com
2. Pay (test card `4242 4242 4242 4242` in test mode)
3. Land on `/booking/complete`
4. Booking **confirmed** in `/admin`
