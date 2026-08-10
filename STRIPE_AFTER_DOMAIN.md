# Stripe setup — mekong-transfer.com

Production site: https://mekong-transfer.com

## Vercel environment (Production)

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://mekong-transfer.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR-PROJECT.supabase.co` (no `/rest/v1/`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase API settings |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase API settings |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` or `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | From webhook signing secret (`whsec_...`) |

Redeploy after any change.

## Stripe webhook

1. [Stripe → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. **Add endpoint** (or edit existing)
3. URL: **`https://mekong-transfer.com/api/webhooks/stripe`**
4. Subscribe to **all four** events:
   - `checkout.session.completed` — cards, Apple Pay (immediate)
   - `checkout.session.async_payment_succeeded` — **PromptPay** (required)
   - `checkout.session.async_payment_failed` — release seats if PromptPay fails
   - `checkout.session.expired` — release seats when checkout times out
5. Save → **Signing secret** → **Reveal** → copy `whsec_...`
6. Paste into Vercel as `STRIPE_WEBHOOK_SECRET` → redeploy

## Payment methods (Stripe Dashboard)

- **Settings → Business** — Thailand + THB
- **Settings → Payment methods** — Cards, **PromptPay**, **Apple Pay**
- **Apple Pay → Configure domains** — add `mekong-transfer.com` and complete verification

## Supabase

Run in SQL Editor if not applied:

`supabase/migrations/20260809140000_stripe_booking_confirm.sql`

**Authentication → URL Configuration:**

- Site URL: `https://mekong-transfer.com`
- Redirect URLs: `https://mekong-transfer.com/**`

## Smoke test

1. Open https://mekong-transfer.com → book a route
2. **Card test** (test mode): `4242 4242 4242 4242` · any future expiry · any CVC
3. Confirm redirect to `/booking/complete` with “Booking confirmed”
4. Check `/admin` — booking status **confirmed**
5. **PromptPay test** (test mode): choose PromptPay, complete QR flow; refresh complete page after ~1 min
6. In Stripe → Webhooks → your endpoint → **Event deliveries** — events should show `200 OK`

## Local webhooks

```powershell
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Use the CLI `whsec_...` in `.env.local` as `STRIPE_WEBHOOK_SECRET` and set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
