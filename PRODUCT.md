# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: **Next.js (App Router) + TypeScript + Tailwind CSS**. Chosen because the first surface is a mobile-first marketing/booking landing page, while later work needs booking checkout, email confirmation, and an admin area for manual date/availability management — one codebase scales without a rewrite. Payment integration and admin UI remain future phases; v1 ships placeholder checkout and static tour content.

## Users

**Primary:** Independent travelers and couples/small groups planning a Mekong river journey. They research routes on mobile, compare options quickly, and want a clear path to book without back-and-forth unless they choose to contact support.

**Secondary (later):** Internal admin/operators who will set tour dates, capacity, and pricing when the admin surface is built.

## Product Purpose

Mekong Transfer’s website lets visitors discover longboat tour options on the Mekong, understand what each journey includes, and complete a booking with online payment. Success means a visitor selects a tour, pays (or completes the placeholder flow in v1), and receives email confirmation with booking details.

The site replaces scattered PDF/poster materials as the canonical place to browse tours and book — while preserving the licensed-operator trust signals already used in print.

## Positioning

Licensed Mekong operator offering routes from Chiang Mai, Chiang Rai, Chiang Khong, and Huay Xai to Luang Prabang — bookable directly on the web rather than only via chat or partner desks.

## Operating Context

- **Today:** Marketing and schedule information lives in PDF posters and a partner schedule sheet; logo and contact assets exist in the repo.
- **Launch surface:** Single English-language landing page, mobile-first, scroll layout with four tour types, detail sections, and checkout flow.
- **Operations (planned):** Manual availability managed by admin later; no live payment provider wired in v1.

## Capabilities and Constraints

### Confirmed for v1

- Single-page landing: hero, four tour cards, expandable/detail sections per tour, how-it-works, meeting points, FAQ, footer.
- Four tour products:
  1. Chiang Mai → Luang Prabang (2 days · 1 night)
  2. Chiang Rai → Luang Prabang (1 day trip)
  3. Chiang Khong → Luang Prabang (1 day trip)
  4. Huay Xai → Luang Prabang (1 day trip)
- Mobile-first layout; desktop adapts from the same structure.
- English only at launch.
- Checkout UX: select tour → date → passengers + email → payment step → confirmation state.
- **Placeholders in v1:** payment provider, tour photography, dynamic availability (use demo/static dates until admin exists).
- Full online payment is the **product goal**; v1 may simulate success without charging.

### Planned (not v1)

- Admin page: adjust dates, seats, prices, tour copy.
- Live payment provider integration.
- Real transactional email delivery.
- Multi-language (Thai, Lao).

### Terminology

- **Slow boat** — classic multi-day Mekong passenger boat (e.g. overnight at Pak Beng).
- **Meeting point / hub** — departure or transfer location (Chiang Mai, Chiang Rai, Chiang Khong, Huay Xai).
- **Connection package** — transfer + border crossing + boat segment bundled.

### Open product facts (do not invent)

- Final prices per tour and season.
- Exact departure times and seat inventory.
- Cancellation/refund policy text (use neutral placeholder until confirmed).
- Payment provider choice.

## Brand Commitments

- **Name:** Mekong Transfer
- **Tagline (from logo):** “The Best Travel Agency”
- **Visual palette (binding):** white, blue, yellow — derived from the circular logo (`logo.jpeg` / `logo.png`)
- **Logo assets:** `logo.jpeg` (source), `logo.png` (transparent PNG), `editable/assets/mekong-transfer-logo-transparent.png`
- **Licence:** TAT Licence ID **21/01279** — must appear as trust evidence on the site
- **Voice:** Clear, trustworthy, practical — oriented toward travelers who need itinerary clarity and licensed-operator confidence

## Evidence on Hand

| Asset | Path / note |
|-------|-------------|
| Logo (JPEG) | `logo.jpeg` |
| Logo (transparent PNG) | `logo.png` |
| Enhanced / transparent variants | `editable/assets/` |
| Print posters (route-specific) | `Mekong Poster ChiangKhong.pdf`, `ChiangMai`, `ChiangRai`, `HuayXai` (when present) |
| Schedule / partner sheet | `Mekong ALISDA Schedule.pdf` (when present) |
| Meeting hubs referenced in materials | Chiang Mai, Chiang Rai, Chiang Khong, Huay Xai Village • Bokeo |

**Do not fabricate:** customer reviews, star ratings, live prices, “bestseller” claims, seat counts, or payment badges beyond placeholder labels.

**Missing (use labeled placeholders):** tour photography, live calendar, payment provider branding, legal policy pages beyond licence mention.

## Product Principles

1. **Mobile booking path first** — every tour must be reachable and bookable in ≤3 taps from the hero.
2. **Trust before flair** — licence, itinerary clarity, and meeting points outweigh decorative marketing.
3. **One screen, four choices** — reduce decision fatigue; four distinct tour cards, not an overwhelming catalog.
4. **Honest placeholders** — when payment, photos, or dates are not live, say so; never imply capabilities that do not exist.
5. **Admin-ready data shape** — even in v1, structure tours and dates so a future admin can override them without restructuring the site.

## Accessibility & Inclusion

- Target WCAG 2.1 AA for the landing and booking flow: color contrast on blue/yellow/white palette, focus states, readable type on mobile, form labels on checkout steps.
- English-only copy at launch; avoid idioms that confuse non-native speakers booking river travel.
