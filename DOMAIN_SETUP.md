# Connect mekong-transfer.com to Vercel

Your site is deployed on Vercel as **chiangmai-lux-tours**. This guide connects your custom domain.

**Primary URL:** https://mekong-transfer.com  
**Also add:** www.mekong-transfer.com (redirects to apex)

---

## Step 1 — Add domain in Vercel

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → project **chiangmai-lux-tours**
2. **Settings → Domains**
3. Add `mekong-transfer.com` → Continue
4. Add `www.mekong-transfer.com` → set to redirect to `mekong-transfer.com`

Vercel shows **DNS records** to copy. Keep that tab open.

---

## Step 2 — DNS at your registrar

Log in where you bought the domain (Namecheap, GoDaddy, Cloudflare, etc.) → **DNS** for `mekong-transfer.com`.

### Option A — Vercel nameservers (easiest)

At your registrar, change nameservers to Vercel’s (shown in the Domains panel), e.g.:

- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

Vercel then manages all records. Done after propagation (often 5–30 minutes, up to 48h).

### Option B — Keep registrar DNS (manual records)

| Host | Type | Value |
|------|------|--------|
| `@` (root) | **A** | `76.76.21.21` |
| `www` | **CNAME** | `cname.vercel-dns.com` |

Remove conflicting A/CNAME records for `@` and `www` first.

**Cloudflare:** set proxy to **DNS only** (grey cloud) until SSL is valid, then you can enable proxy.

---

## Step 3 — Wait for “Valid” in Vercel

Domains → both entries should show **Valid Configuration** and SSL **Active**.

Test:

- https://mekong-transfer.com
- https://www.mekong-transfer.com (should redirect to apex)

---

## Step 4 — Vercel environment variable

**Settings → Environment Variables** → add or update for **Production**:

```
NEXT_PUBLIC_SITE_URL=https://mekong-transfer.com
```

No trailing slash. **Redeploy** production (Deployments → ⋮ → Redeploy).

This fixes Stripe success/cancel URLs and site metadata.

---

## Step 5 — Supabase auth URLs (admin login)

Supabase Dashboard → **Authentication → URL Configuration**:

| Field | Value |
|-------|--------|
| **Site URL** | `https://mekong-transfer.com` |
| **Redirect URLs** | `https://mekong-transfer.com/**` |

Keep `http://localhost:3000/**` for local dev.

---

## Step 6 — Stripe (after domain is live)

Follow **STRIPE_AFTER_DOMAIN.md** with these exact values:

- Webhook: `https://mekong-transfer.com/api/webhooks/stripe`
- Apple Pay domain: `mekong-transfer.com`

---

## Step 7 — Optional: share the new URL

Old URL still works: `https://chiangmai-lux-tours.vercel.app`  
Use **mekong-transfer.com** in marketing, Stripe, and Supabase.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| DNS not resolving | Wait up to 48h; check records match Vercel exactly |
| SSL pending | Wait 10–30 min after DNS validates |
| Wrong site / 404 | Vercel → Settings → General → **Root Directory** = empty |
| Admin login fails on new domain | Update Supabase Site URL + Redirect URLs (Step 5) |
| Stripe redirect goes to vercel.app | Set `NEXT_PUBLIC_SITE_URL` and redeploy (Step 4) |

---

When DNS shows **Valid** in Vercel, say in Cursor: **“domain is live — finish Stripe setup”**.
