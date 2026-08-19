---
target: guest site
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
timestamp: 2026-08-09T05-41-51Z
slug: src-app-page-tsx
---
Method: dual-agent (A: a8136705-65b1-4f71-af49-69868a4ceb4c · B: d8b84bdc-3e5c-49ca-82e1-3eb81154e99e)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Booking sheet steps are clear; landing has no selected-route state; payment shows raw ISO date |
| 2 | Match System / Real World | 3 | Hub names and TAT licence land well; "Chart booking" and gender label feel bureaucratic |
| 3 | User Control and Freedom | 3 | Sheet dismiss/Back/Escape work; closing wipes passenger data; no mid-flow tour switch |
| 4 | Consistency and Standards | 2 | "Book this route" vs "Book this tour" vs header "Book a tour"; blue vs yellow CTAs |
| 5 | Error Prevention | 3 | Radio date cards, capped passengers, inline validation |
| 6 | Recognition Rather Than Recall | 2 | Four expanded detail blocks; desktop chart timeline hidden on mobile |
| 7 | Flexibility and Efficiency | n/a | Persuade landing — shortcuts not expected |
| 8 | Aesthetic and Minimalist Design | 2 | Strong tokens per section; page is extremely long with near-duplicate blocks |
| 9 | Error Recovery | 3 | Inline role="alert" errors; continue-hint in sheet footer |
| 10 | Help and Documentation | n/a | FAQ covers pre-booking questions |
| **Total** | | **21/32** | **Acceptable (66%)** |

## Design Specificity Verdict

**LLM assessment:** Mekong Transfer is partially authored — the River Chart thesis (cream paper, chart grid, navy hero, yellow waypoints, Libre Baskerville route names, TAT licence chip) is real and distinct from generic tour landings. But ~40–50% remains category-interchangeable: four cards share identical eyebrow, tagline, and photo placeholders; four full-width detail sections repeat the same headline, four experience tiles, and aside panel; the desktop waypoint timeline is `hidden md:block`, so mobile users lose the core metaphor.

**Deterministic scan:** 4 advisory findings in 2 files (exit code 2). All are quality/slop advisories, not blockers:
- `LandingContent.tsx` L145, L154, L249 — font sizes 10–11px off the DESIGN.md type ramp
- `globals.css` L50 — decorative grid-line background (`.chart-grid` is intentional per DESIGN.md; likely acceptable)

**Visual overlays:** Not available — browser MCP could not open a tab; no reliable user-visible overlay. CLI-only evidence for this run.

## Overall Impression

The River Chart design system is the strongest asset — honest placeholders, licensed-operator trust, and a well-crafted booking sheet. The single biggest opportunity is **information architecture**: four stacked, near-identical detail sections turn a "pick one of four routes" decision into a scroll marathon that buries differentiation and undermines mobile-first booking.

## What's Working

1. **Cohesive River Chart tokens** — CSS variables, chart grid, wave SVG hero, waypoint numbering, and serif/sans pairing create recognizable identity.
2. **Honest placeholder discipline** — demo dates, photo placeholders, dashed payment panel, and "Complete booking (demo)" avoid dark-pattern urgency.
3. **Booking sheet craft** — bottom sheet, focus trap, step indicator, sticky footer Continue — suited for one-handed mobile use.

## Priority Issues

### [P0] Four stacked identical detail sections
- **What:** After the card row, four full detail sections repeat the same headline, tagline, experience tiles, and aside panel.
- **Why it matters:** Violates "one screen, four choices"; travelers cannot compare without holding card choice across ~4 viewport-lengths.
- **Fix:** Single chart-linked detail panel that updates on card/waypoint selection; collapse or accordion inactive routes.
- **Suggested command:** `/impeccable distill`

### [P1] Chart metaphor invisible on mobile
- **What:** Desktop waypoint timeline is `hidden md:block`; mobile sees only a horizontal snap carousel.
- **Why it matters:** Mobile is the primary booking device; the core differentiator is lost where it matters most.
- **Fix:** Vertical mobile river chart with tappable waypoints synced to card selection; peek affordance on carousel.
- **Suggested command:** `/impeccable adapt`

### [P1] Booking identity step is a cognitive wall
- **What:** Step 3 requires 6 identity fields per passenger (passport, nationality, DOB, etc.) before placeholder payment.
- **Why it matters:** Turns a persuasion landing into a border-manifest form; likely abandonment before demo checkout.
- **Fix:** Defer full manifest to post-confirmation; keep lead guest + email in v1; add "full details 48h before departure" copy.
- **Suggested command:** `/impeccable distill`

### [P2] Inconsistent primary CTAs
- **What:** Cards use blue "Book this route"; detail aside uses yellow "Book this tour"; header yellow "Book a tour" scrolls to #tours.
- **Why it matters:** Inconsistent labels and color roles erode predictability in a 4-choice decision.
- **Fix:** One verb, one primary color (yellow = reserve); consider header CTA opening booking for selected/default route.
- **Suggested command:** `/impeccable polish`

### [P2] Shared copy flattens route differentiation
- **What:** All tours share tagline, headline, intro, and experience tiles.
- **Why it matters:** Chiang Mai 2-day and Huay Xai 1-day feel interchangeable.
- **Fix:** Route-specific taglines, one-line differentiators on cards, unique experience bullets per corridor.
- **Suggested command:** `/impeccable clarify`

## Persona Red Flags

**Jordan (first-timer):** Identical taglines on all cards; no "starting from Chiang Mai?" guidance; chart timeline absent on phone; gender label "Male or female or N/A" confusing; brand wordmark hidden below `sm`.

**Riley (stress tester):** Payment summary shows raw ISO date; closing sheet resets all forms; no sessionStorage on refresh; demo vs live FAQ can contradict env config.

**Casey (mobile):** Header CTA top-right outside thumb zone; carousel lacks scroll peek; Step 3 demands extensive typing; extreme page length with no sticky route indicator.

## Minor Observations

- FAQ `<details>` lack expand/collapse chevron
- "Premium · Special · Slow boat" identical on all four cards
- `#tours` anchor may clip under sticky header
- Booking sheet opens at Step 2 — no tour confirmation step
- Detector: 10px/11px type off ramp in `LandingContent.tsx`

## Questions to Consider

1. What if the entire landing were one tappable river chart — cards, detail, and booking all emerging from waypoint selection?
2. What if booking opened with "Where are you now?" instead of four visually similar SKUs?
3. Does "The Best Travel Agency" dilute the verifiable TAT licence story?
