---
target: guest landing homepage for live use
total_score: 24
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 3
timestamp: 2026-08-14T12-53-32Z
slug: src-app-page-tsx
---
Method: dual-agent (A: 740691d7-18fd-423e-83c2-735bec6f3995 · B: cad02b9b-6d23-43bd-85a5-764ea61b63e0)

Browser MCP could not attach a real tab in either assessment (ghost viewIds that vanish from `list`). Overlay injection did not run. Visual overlays are not available. CLI detector ran on the landing/booking markup.

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Step N of 4 and Redirecting… work; cancelled banner only after hydrate; sheet focuses Close |
| 2 | Match System / Real World | 3 | Mekong/hub/passport language; “Chart booking,” given name labeled “Name,” gender “Male or female or N/A” |
| 3 | User Control and Freedom | 3 | Overlay, X, Escape, Back; Close wipes the draft with no confirm |
| 4 | Consistency and Standards | 3 | Chart tokens hold; three labels for the primary action (See routes / Choose a route / Book this route) |
| 5 | Error Prevention | 2 | Constrained dates and pax cap; Close-without-confirm; Pay now books then charges; DD/MM/YY 2-digit year |
| 6 | Recognition Rather Than Recall | 3 | Payment summary repeats route/date/pax; desktop waypoints unlabeled; nationality is free text |
| 7 | Flexibility and Efficiency | n/a | Persuade landing with one booking path; expert accelerators are not the job |
| 8 | Aesthetic and Minimalist Design | 3 | River Chart + real operator photos; identical card taglines; meeting points repeats the catalog |
| 9 | Error Recovery | 2 | Near-field validation; guest-facing error can leak a Supabase migration filename |
| 10 | Help and Documentation | 2 | FAQ + licence exist; no cancel/refund/privacy at Pay now |
| **Total** | | **24/36** | **Acceptable** |

#### Design Specificity Verdict

**Start here.** This is authored for Mekong Transfer, not a generic tour template.

**LLM assessment:** The River Chart world is doing real work: cream paper, navy hero with wave cut, yellow markers, Libre Baskerville route titles, TAT chip `21/01279`. Photography is this fleet — yellow-hulled slow boat, silty Mekong, wooden cabin, TAT-marked van — not stock infinity-pool luxury. What still reads as template: all four cards share the tagline “The Journey of a Lifetime,” unused itinerary fields never render, and the desktop “chart” is four unlabeled dots. Footer still ships the logo boast “The Best Travel Agency.”

**Deterministic scan:** `detect.mjs` on `src/app/page.tsx` plus landing/booking components returned `[]` (exit 0). Zero rule findings. Detector and design review do not conflict; the live-readiness gaps are product/copy/flow, not the saturated-pattern class the detector catches.

**Visual overlays:** No reliable user-visible overlay. Browser MCP created ghost tabs that could not be navigated, locked, or injected. `live-server.mjs` was never started. Fallback: source + live HTML (localhost:3000 returned HTTP 200).

#### Overall Impression

The guest site looks like a licensed Mekong operator and can take a booking. It is not yet ready to take real money without three production gaps: no refund/privacy at the charge moment, a confirmation screen that still says email is not connected, and a passport wall that will stall first-timers. The biggest opportunity is an honest paid end-state — booking ID plus a real confirmation channel — not more visual polish on the hero.

#### What's Working

1. **Operator-specific visual world with live photography.** Navy hero, chart grid, yellow markers, and real boats/van/cabin. TAT `21/01279` appears in the hero, footer, and on several photos.
2. **Four-hub IA matches how this business sells.** One destination, four departures, overnight called out on Chiang Mai, ≤3 taps from hero to `#tours`.
3. **Booking overlay is a real Operate surface.** Steps, focus trap, Escape, Stripe copy, payment summary, cancelled-checkout query, PromptPay-aware complete page.

#### Priority Issues

**[P1] No legal/trust copy at the charge moment**
- **Why it matters:** Live Stripe + passport IDs + money, and the footer has phones/email/licence but zero Terms, Privacy, or cancellation/refund. Charging without that is a live-use blocker.
- **Fix:** One plain refund/no-show rule next to Pay now; footer links to short legal pages; say that Pay now holds a seat then opens Stripe.
- **Suggested command:** `/impeccable harden`

**[P1] Paid end-state still says email isn’t connected**
- **Why it matters:** `/booking/complete` and the in-sheet confirmation both say confirmation will send “when email is connected” / “when transactional email is connected.” Peak-end rule fails on the last screen that matters.
- **Fix:** Connect transactional email, or show booking ID + “screenshot this / WhatsApp us” until mail is live. Do not imply a confirmation you will not send.
- **Suggested command:** `/impeccable harden`

**[P1] Passport step is a high-stakes wall**
- **Why it matters:** Six fields × every passenger + email, legend “Male or female or N/A,” given name labeled “Name,” DOB `DD/MM/YY`. First-timers stall; 2-digit years invite bad dates.
- **Fix:** Lead guest first, others progressive; label Given name; gender Male / Female / Prefer not to say; clearer date; keep the border-manifest one-liner.
- **Suggested command:** `/impeccable distill` then `/impeccable clarify`

**[P2] Four routes don’t read as four different journeys**
- **Why it matters:** Shared tagline, unused `experiences`/`highlights`/`perfectFor`. Guests compare ฿8,300 vs ฿5,800 without knowing why Chiang Khong ≠ Huay Xai.
- **Fix:** Unique one-line differentiator per hub on the card (overnight vs same-day, border pier vs village).
- **Suggested command:** `/impeccable clarify`

**[P2] “Live availability” can be a silent demo fallback**
- **Why it matters:** Landing copy says “Pick an open departure from live availability.” If Supabase is down or empty, `getCatalogTours()` falls back to `tours.ts` demo dates with 20 fake seats, while the sheet still says seats update in real time when Stripe is on. Guest errors can also leak `Run Supabase migrations through 20260809120000_…`.
- **Fix:** If fallback is active, say so (or show “contact us”). Never show a migration filename to a guest.
- **Suggested command:** `/impeccable harden`

#### Persona Red Flags

**Jordan (first-timer):** Hero is clear. Then four identical taglines. “Chart booking” doesn’t mean checkout. Passport wall + no refund text before Pay now → abandon.

**Riley (stress tester):** Close/refresh kills the draft. Pay now writes a booking then leaves for Stripe. Fallback dates can still look live. Guest error may include a migration filename. No privacy link while collecting passport IDs.

**Casey (distracted mobile):** Sticky See routes sits top-right, not in the thumb zone. Horizontal carousel to reach route 4. DOB is typed, not picked. English-only at a Thai/Lao border product. `tel:` in the footer is the one mobile-native win.

**Independent traveler/couple:** Prices and durations are on cards; overnight is on Chiang Mai detail only. They must swipe to see route 4. Email confirmation is not actually on.

**Licensed-operator trust seeker (TAT):** Licence chip + photo watermarks are strong. Undermined by “The Best Travel Agency,” no refund policy, and passport harvest before any data-use sentence.

#### Cognitive load

3 checklist failures (single focus, chunking on passport step, progressive disclosure) → **moderate**. Decision points with >4 options: passenger count up to 6; date list if a route has more than 4 open days.

#### Emotional journey

Peak: sunset hero + real boat + TAT. Valley: four identical lifetime-journey lines. Second peak: Chiang Mai overnight + honest guesthouse photos. High-stakes valley: passport wall. Broken end: paid confirmation that admits email is not connected.

#### Minor Observations

- `TourDetailPanel` never renders `experiences`, `perfectFor`, or `highlights`.
- Error color is deep blue, easy to miss as an error.
- Booking sheet initial focus is Close.
- Cancelled banner has Dismiss but no resume-this-route.
- Apple Pay is claimed in FAQ; confirm Checkout actually offers it before over-claiming.
- Shared “8–10 hrs” duration detail on the 2-day Chiang Mai product is easy to misread.
- Skip link exists; good.

#### Questions to Consider

- If email isn’t connected, should Pay now even be on, or should the end state be “WhatsApp this booking ID”?
- Are the dates on the live site admin inventory, or `tours.ts` fallback wearing a “live availability” label?
- Should the sticky header say Book (conversion) or See routes (browse)?
- Is Huay Xai really a same-day Pakbeng run, or leftover shared copy?
