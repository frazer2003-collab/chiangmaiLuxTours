---
target: Landing page
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
timestamp: 2026-08-07T11-15-31Z
slug: src-components-landingpage-tsx
---
Method: dual-agent (A: f7ca0240-a3d0-4631-961a-6fe93b7bbbb8 · B: b328cb73-2d79-423d-9d0d-2256873bd754)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Booking sheet shows steps; landing has no active-tour/section indicator; payment summary uses raw ISO dates |
| 2 | Match System / Real World | 3 | Corridor language and hub names land well; "chart booking" metaphor slightly abstract for first-timers |
| 3 | User Control and Freedom | 3 | Modal close/back work; no mid-flow tour switch; Esc handler not evident |
| 4 | Consistency and Standards | 2 | "Book this route" vs "Book this tour"; blue vs yellow primary CTAs swap roles |
| 5 | Error Prevention | 3 | Continue disabled until valid; email check is weak (`includes("@")`) |
| 6 | Recognition Rather Than Recall | 2 | Four full detail blocks require scroll marathon to compare; chart timeline hidden below `md` |
| 7 | Flexibility and Efficiency | n/a | Persuade surface — shortcuts not expected |
| 8 | Aesthetic and Minimalist Design | 2 | Clean sections individually; page is long/repetitive; placeholder gradients dominate |
| 9 | Error Recovery | 2 | No inline field errors; only disabled Continue button |
| 10 | Help and Documentation | n/a | Persuade surface — FAQ covers pre-booking; formal docs not expected |
| **Total** | | **20/32** | **Acceptable (63%)** |

## Design Specificity Verdict

**Partially authored for Mekong Transfer — not yet unmistakably own-world.**

**LLM assessment:** The river navigation chart direction is real at the token layer — cream chart paper, hydrography hero wave, yellow waypoint markers, serif chart typography, and corridor copy (Huay Xai ↔ Luang Prabang, Pak Beng, TAT 21/01279) read as intentional product character. But four stacked, structurally identical detail sections, generic gradient photo placeholders, and a standard horizontal card carousel on mobile make ~40% of the experience interchangeable with any tour operator site. The chart metaphor is mostly copy and CSS, not interaction structure.

**Deterministic scan:** `detect.mjs` returned **0 findings** on `LandingPage.tsx` and `BookingSheet.tsx`. One **advisory** hit on shared CSS: `codex-grid-background` in `globals.css:32` (`.chart-grid`). This aligns with the committed chart-paper world — **likely a false positive**, not slop. No browser overlay was available (no browser MCP; puppeteer not installed).

## Overall Impression

The hero earns trust quickly — licensed operator, clear corridor promise, strong palette. Then the page becomes four back-to-back brochures with placeholder visuals, and the booking flow can't close the decision because pricing never appears on cards. The single biggest opportunity: **collapse comparison into one chart-driven surface** so travelers pick a leg once and book without a scroll marathon.

## What's Working

1. **Cohesive chart-world tokens** — `--chart-paper`, `--river-blue`, `--marker-yellow`, `.chart-grid`, waypoint numbering, and serif/chart font pairing create a recognizable navigation-chart identity rare in tour landing pages.

2. **Honest placeholder discipline** — "Photo placeholder," "Demo dates only," "Complete booking (demo)," and FAQ transparency avoid dark-pattern fake urgency. Aligns with PRODUCT.md.

3. **Mobile-native booking sheet** — Bottom sheet, step header, body scroll lock, and sticky footer actions suit one-handed booking on a phone.

## Priority Issues

### [P0] No visible pricing on decision surfaces
- **Why it matters:** Independent travelers cannot compare options or commit without price anchors. `priceNote` hides in sidebar metadata only.
- **Fix:** Show indicative "from $X" or "Price confirmed at checkout" on each tour card and in the booking summary; add contact CTA if final price is unknown.
- **Suggested command:** `/impeccable clarify`

### [P1] Four expanded detail sections create scroll fatigue
- **Why it matters:** Violates "one screen, four choices." Users must hold their card choice in working memory across ~4 screen-lengths of duplicate layout.
- **Fix:** Single detail panel that updates when a card/waypoint is selected; accordion or chart-linked reveal instead of four full sections.
- **Suggested command:** `/impeccable distill`

### [P1] Chart metaphor invisible on mobile
- **Why it matters:** Waypoint timeline is `hidden md:block`; mobile users get a generic snap carousel — core differentiator lost on primary device.
- **Fix:** Vertical river chart on mobile with tappable waypoints linked to card selection and detail panel.
- **Suggested command:** `/impeccable adapt`

### [P2] Inconsistent primary CTAs
- **Why it matters:** "Book this route" vs "Book this tour" vs header "Book a tour"; blue vs yellow button roles erode trust in a 4-choice decision.
- **Fix:** One label system and one primary color role (yellow = reserve) everywhere.
- **Suggested command:** `/impeccable polish`

### [P2] Footer lacks bail-out contact
- **Why it matters:** Cross-border river travel triggers human-support fallback; "Placeholder contact" removes trust when booking feels uncertain.
- **Fix:** Labelled phone/LINE/email rows even as placeholders so layout and trust pattern exist.
- **Suggested command:** `/impeccable harden`

## Persona Red Flags

**Jordan (first-timer):** Four similar product names with no "which route is right for me?" guide. Chart timeline invisible on phone. FAQ admits demo dates only after user may have started booking.

**Casey (mobile):** Header "Book a tour" sits top-right outside thumb zone. Horizontal carousel has no scroll affordance. Long scroll loses progress if interrupted. Tour details require extensive scrolling before booking sheet.

**Riley (stress tester):** Email `a@b` passes validation. Closing modal mid-flow wipes data. Private Charter uses same date-picker as scheduled boats. Payment summary shows raw ISO date. Logo link `href="#"` is a dead end.

**Morgan (independent Mekong researcher on phone):** Cannot compare downstream vs upstream vs connection without four full reads. No map, times, or duration table. Placeholder photos give zero boat/scenery signal. No price, cancellation policy, or LINE/WhatsApp — would keep searching.

## Minor Observations

- Brand name hidden below `sm` in header — logo-only on small phones.
- FAQ `<details>` lack expand/collapse chevron.
- Hero and footer both repeat TAT licence without adding new information.
- `scroll-behavior: smooth` with sticky header may clip `#tours` anchor targets.
- Desktop `xl:grid-cols-4` gives four equal-weight cards — no recommended/default route.

## Questions to Consider

1. What if the entire landing page were one tappable river chart — cards, details, and booking all emerging from waypoint selection?
2. What if booking opened with "Where are you now → Where are you going?" instead of asking travelers to self-identify among SKUs?
3. Is "The Best Travel Agency" doing any work — or diluting the verifiable TAT licence story?
