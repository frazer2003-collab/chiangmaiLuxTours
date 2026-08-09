# Chiang Mai Lux Tours (Mekong Transfer)

Next.js landing page for Mekong slow boat tour booking.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

**Public site (share this URL):** https://chiangmai-lux-tours.vercel.app/

Import this repo on Vercel — **Root Directory** must be **empty** (repository root, not `website`).

Framework preset: **Next.js** (also set in `vercel.json`).

### “Not secure” or login page?

| What you see | Cause | Fix |
|---|---|---|
| Browser says **Not secure** on `http://localhost:3000` | Local dev uses HTTP | Normal in development. Use the **https://** production URL above to test the live site. |
| **Log in to Vercel** when opening a `*.vercel.app` link | Vercel Deployment Protection on preview/deployment URLs | Use **https://chiangmai-lux-tours.vercel.app/** instead, or disable protection: Vercel Dashboard → Project → **Settings → Deployment Protection** → turn **off** Vercel Authentication for Production. |
| `404: NOT_FOUND` | Wrong root directory or stale deploy | Settings → General → Root Directory = blank → Redeploy latest `main`. |

Repo: https://github.com/frazer2003-collab/chiangmaiLuxTours

## Staff admin (`/admin`)

Mobile-first panel for dates, prices, and bookings. Requires Supabase.

1. Create a [Supabase](https://supabase.com) project.
2. Copy `.env.example` → `.env.local` and fill in URL + anon + service role keys.
3. Run the migration in `supabase/migrations/20260809000000_admin_schema.sql` (Supabase SQL editor).
4. In **Authentication → Providers**, disable public sign-up (invite-only).
5. Create a staff user in **Authentication → Users** and set **Raw App Meta Data**:

   ```json
   { "role": "staff" }
   ```

6. Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (or `/admin` on production).

**Tabs:** Bookings (default) · Dates (per tour) · Tours (price). EN/TH toggle in the header.

Add the same env vars in Vercel → Project → Settings → Environment Variables before deploying admin to production.
