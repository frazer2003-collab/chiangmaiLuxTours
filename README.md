# Chiang Mai Lux Tours (Mekong Transfer)

Next.js landing page for Mekong slow boat tour booking.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

Import this repo on Vercel — **Root Directory** must be **empty** (repository root, not `website`).

Framework preset: **Next.js** (also set in `vercel.json`).

If you still see `404: NOT_FOUND`:

1. Vercel Dashboard → your project → **Settings → General → Root Directory** → clear it (leave blank) → Save
2. **Settings → General → Framework Preset** → **Next.js**
3. **Deployments** → latest deployment → **Redeploy** (uncheck “Use existing Build Cache”)
4. Open the **Domains** tab and use the URL listed there (not an old preview link)

Repo: https://github.com/frazer2003-collab/chiangmaiLuxTours
