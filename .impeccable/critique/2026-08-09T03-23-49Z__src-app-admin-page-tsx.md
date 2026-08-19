---
target: "route:/admin"
total_score: 24
max_score: 36
na_heuristics: 10
p0_count: 0
p1_count: 3
p2_count: 2
timestamp: 2026-08-09T03-23-49Z
slug: src-app-admin-page-tsx
---
# Admin critique — route:/admin

Method: dual-agent (A: 7b2d7004 · B: f3b41b4f)

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of system status | 2 | No skeleton/spinner on save or tab load; `Suspense fallback={null}` |
| 2 | Match system / real world | 3 | Origin-city pills and “Needs action” fit operators; unused `closeDateHint` |
| 3 | User control and freedom | 3 | Sheet dismiss, tab URL state, sign out |
| 4 | Consistency and standards | 3 | Cohesive cards/pills; native `confirm` vs custom UI mismatch |
| 5 | Error prevention | 2 | Dual refund paths; capacity blur-save without guard |
| 6 | Recognition rather than recall | 3 | Labeled status chips; booking cards carry context |
| 7 | Flexibility and efficiency | 2 | No refresh, shortcuts, or bulk close |
| 8 | Aesthetic and minimalist design | 3 | Focused three-tab shell; dispatch identity under-expressed |
| 9 | Error recovery | 2 | Dev-facing login errors; Supabase errors can leak |
| 10 | Help and documentation | n/a | Trained staff tool; EN/TH toggle sufficient for v1 |
| **Total** | | **24/36** | **Good (67%)** |

## Design Specificity Verdict

**LLM assessment:** The admin is grounded in Mekong Transfer — four hub pills, pending-first bookings, chart-paper tokens, honest refund copy. It reads as staff tooling, not a generic template. The “dispatch log” brief is only half-delivered: grid tint and uppercase header label, but no chart chip, log rhythm, or operational metaphor beyond yellow badges.

**Deterministic scan:** 1 advisory — `design-system-font-size` at `AdminShell.tsx:108` (`text-[10px]` nav badge). Likely intentional micro-type for a 16px pill; filter or document in DESIGN.md. No layout/a11y rule failures in static scan.

**Browser overlays:** Not run (CLI-only Assessment B).

## Overall Impression

Structurally faithful to the shape brief: mobile three-tab shell, action-first bookings, per-tour dates, price-only tours tab. The biggest gap is **operator trust under interruption** — silent saves, browser confirm dialogs, and a dense booking sheet where refund can be set two different ways. Fix those before calling it production-ready for boat-side use.

## What's Working

1. **Action-first bookings** — Default “Needs action” filter, pending sort, tab badge.
2. **Product-scoped navigation** — Dates pills use origin cities (Chiang Mai, etc.), not opaque IDs.
3. **Accessible status chips** — Text labels on every status, not color alone.

## Priority Issues

### [P1] Booking detail sheet overload + dual refund paths
- **Why:** Operators may mark refunded without notes, or via inconsistent paths.
- **Fix:** Progressive refund flow; remove “Refunded” from casual status grid or unify with confirm button.
- **Command:** `/impeccable distill route:/admin`

### [P1] No loading / in-flight feedback
- **Why:** Slow connectivity → double taps, lost trust.
- **Fix:** Skeleton rows, save spinners, optional pull-to-refresh on Bookings.
- **Command:** `/impeccable harden route:/admin`

### [P1] Native `window.confirm` for refund and date removal
- **Why:** Breaks Operate polish and a11y at highest-stakes moments.
- **Fix:** Branded in-app confirm dialog with focus trap.
- **Command:** `/impeccable polish route:/admin`

### [P2] Dev-facing error copy on login
- **Why:** Staff see SQL migration paths and env jargon.
- **Fix:** “Contact your manager” + server-side logging for technical detail.
- **Command:** `/impeccable clarify route:/admin/login`

### [P2] Dates empty state and close-date guidance
- **Why:** Empty list shows “Add date” as content; `closeDateHint` never rendered.
- **Fix:** Dedicated empty copy; inline hint when closing dates with bookings.
- **Command:** `/impeccable onboard route:/admin`

## Persona Red Flags

**Alex (power user):** No refresh control; capacity blur-only; no keyboard dismiss on booking sheet.

**Sam (a11y):** Dialog missing `aria-labelledby`; icon close without label; backdrop labeled “Cancel”; login inputs lack focus ring parity.

**Casey (mobile):** `w-16` capacity input below thumb comfort; add-date row cramped on narrow screens.

## Minor Observations

- TH/EN `notStaff` strings inconsistent (migration vs app metadata).
- Tours tab uses one global save message for all rows.
- Header says “Staff admin” not “Dispatch log” from brief.

## Questions to Consider

- Should the booking sheet be a ticket face (status only) with notes/refund in step two?
- Should “Close date” be the primary action when sold out, not “Remove”?
- Is the next investment polish or one-handed ergonomics (bigger targets, louder save confirmation)?
