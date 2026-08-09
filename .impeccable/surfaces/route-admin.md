---
version: 1
slug: route-admin
primary_target: route:/admin
related_targets:
  - src/app/admin/page.tsx
  - src/components/BookingSheet.tsx
mode: operate
---

# Admin — staff operations

## Job and audience

**Who:** Mekong Transfer operators (1–5 staff) updating availability and handling bookings from phones — at the desk, between guests, or on the boat.

**Context:** Task-focused, interrupted, thumb-driven. They need certainty (seats left, who booked, what changed) more than marketing polish.

**Visitor mode:** Operate — complete admin tasks in under a minute without training.

## Outcome and proof

**Primary jobs (in priority order):**

1. **Dates & capacity** — per tour, add/remove bookable dates and set max passengers per date. Landing checkout reads live slots (replaces demo dates).
2. **Tour pricing** — change price per tour; public site reflects immediately.
3. **Bookings panel** — view all bookings; change status; add internal notes; mark refunded (manual v1, Stripe-refund-ready later).

**Success looks like:** Staff opens `/admin` on a phone, sees today’s bookings, closes a date that sold out, adjusts Chiang Mai price, and marks a cancellation refunded — without desktop or spreadsheets.

**Product truth preserved:** Four fixed tours (Chiang Mai, Chiang Rai, Chiang Khong, Huay Xai → Luang Prabang). Do not invent copy, reviews, or payment claims. TAT licence stays on public site only.

## Selected direction

**Visual authority:** Extend **River Chart** (DESIGN.md) into an **Operate dispatch log** — same chart-paper ground, river blue actions, yellow attention markers — but strip serif display from UI chrome. Libre Franklin carries labels, data, and controls; chart identity lives in header chip, subtle grid tint, and color semantics only.

**Structural thesis:** Mobile-first **three-tab shell** (fixed bottom nav, 44px+ targets):

| Tab | Purpose |
|-----|---------|
| **Bookings** | Default tab — chronological cards: guest, tour, date, pax, status chip. Tap → bottom sheet for detail, status picker, notes, refund action. |
| **Dates** | Tour picker (4 pills) → scrollable date list with capacity editor. FAB or sticky “Add date”. Swipe or explicit remove with confirm when bookings exist. |
| **Tours** | Four rows: route name + current price. Inline edit → save. Read-only duration/route copy; price only in scope. |

**Focal moment:** Opening **Bookings** and immediately seeing **what needs action** — pending bookings surfaced first (badge on tab + sort).

**Auth (recommended):** Supabase **email + password**, invite-only (no public signup). Single staff role for v1. Persistent session on mobile. Protected `/admin/*` routes; redirect to login when unauthenticated.

**Data:** Supabase Postgres — `tours`, `tour_dates` (tour_id, date, capacity, booked_count), `bookings` (guest fields, status, internal_notes, refund_status, stripe_payment_id nullable for future). RLS: authenticated staff only for writes; public read limited to availability/prices needed by booking flow.

**i18n:** EN / TH toggle in admin header; persists preference. Public site stays English-only until a separate brief says otherwise.

## Scope and boundaries

**In scope (this build):**

- `/admin` mobile shell + login
- CRUD for dates/capacity per tour
- Price edit per tour
- Bookings list + detail sheet: statuses `pending`, `confirmed`, `cancelled`, `refunded`
- Internal notes (staff-only, not emailed to guest)
- Wire public `BookingSheet` to Supabase availability and persist new bookings
- Manual refund status + note field; schema hook for future Stripe refund ID

**Out of scope (anti-goals):**

- Editing tour marketing copy, itinerary, or photos
- Multi-role permissions, audit log, analytics dashboard
- Real Stripe charges/refunds in v1
- Desktop-first dense tables (mobile cards first; desktop may use same layout centered)
- Replacing landing page Persuade mode or redesigning DESIGN.md

**Untouched:** Landing layout, hero, FAQ content, public typography hierarchy (serif display stays public-only).

## States and ranges

| State | Behavior |
|-------|----------|
| **Empty bookings** | Illustration-free empty state: “No bookings yet” + hint that web bookings appear here |
| **Empty dates for tour** | Prompt to add first date; public site shows no dates for that tour |
| **Date at capacity** | Show full badge; block new public bookings for that slot |
| **Date with existing bookings** | Warn before delete; offer “close date” (capacity 0) instead |
| **Loading / error** | Skeleton rows; toast or inline error with retry on save |
| **Offline** | Best-effort: show cached read + disable saves with clear message |

**Typical ranges:** 4 tours; 10–60 future dates per tour; 0–20 bookings/week at launch; notes up to ~500 chars.

## Interaction and layout

- **Login:** Single column, logo mark, email/password, primary CTA. No marketing chrome.
- **Header:** Product name, language toggle (EN \| TH), sign out.
- **Bookings card:** Name · tour shorthand · date · pax · status chip (color-coded). Filter: All / Pending / Upcoming.
- **Booking detail sheet:** Status segmented control; notes textarea with autosave or explicit Save; Refund button → confirm → sets `refunded` + optional refund note (Stripe ID field hidden/disabled until integrated).
- **Dates:** Date row shows `DD Mon YYYY · booked/capacity`. Stepper or numeric input for capacity. Add date uses native date picker where supported.
- **Tours:** Price in THB; validate positive integer; show last updated implicitly on save success.
- **Feedback:** 150–200ms transitions; success toast; destructive actions require confirm dialog.
- **a11y:** Focus visible, labels on all inputs, status not color-only (text label on chips).

## Constraints and open decisions

**Binding:** Next.js App Router, TypeScript, Tailwind, Supabase, WCAG 2.1 AA on admin, `prefers-reduced-motion` respected.

**Reuse:** Chart-paper CSS tokens from `globals.css`; button pill patterns adapted for Operate density.

**Builder must not invent:** Refund policy copy for guests, cancellation rules, or automated emails — placeholders OK with honest labels.

**Open (confirm before build if changed):**

- Exact Thai strings — translate EN UI strings; user may supply corrections post-build.
- Whether staff receive email on new booking (recommended nice-to-have, not blocking).
- Stripe webhook timing — schema only in v1 unless user promotes to in-scope.

---

**Next step after confirmation:** `/impeccable craft` (or direct implementation) — Supabase schema + auth, then admin UI, then connect public booking flow.
