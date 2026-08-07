---
target: Mekong PDF logo and phone edits
total_score: 13
max_score: 24
na_heuristics: 3,7,9,10
p0_count: 1
p1_count: 2
timestamp: 2026-08-06T13-15-12Z
slug: mekong-poster-chiangkhong-pdf
---
# Design Critique — Mekong PDF Logo & Phone Edits

Method: dual-agent (A: 14f38f06-8130-402e-b7c0-a8101029a047 · B: df2efdca-9fc2-4f79-a1f9-4c179ef45bbf)

## Design Health Score

Persuade-mode print collateral. Heuristics 3, 7, 9, 10 marked n/a.

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Contact blocks and schedule grid are easy to find |
| 2 | Match System / Real World | 2 | Three phone formats for the same number across materials |
| 3 | User Control and Freedom | n/a | Static print |
| 4 | Consistency and Standards | 1 | Logo treatment, fonts, and phone formatting diverge |
| 5 | Error Prevention | 2 | Format inconsistency increases misdial risk |
| 6 | Recognition Rather Than Recall | 3 | Contact info grouped in expected footer zones |
| 7 | Flexibility and Efficiency | n/a | Print marketing |
| 8 | Aesthetic and Minimalist Design | 2 | Edit artifacts and mixed font systems add noise |
| 9 | Error Recovery | n/a | Static print |
| 10 | Help and Documentation | n/a | Print marketing |
| **Total** | | **13/24** | **Acceptable base, weak on trust-critical details** |

## Design Specificity Verdict

**LLM assessment:** The underlying templates are product-specific — route copy, Mekong photography, TAT licence, ALISDA partnership, and calendar logic all read as Mekong Transfer, not generic travel stock. The programmatic edits (logo swap, phone patch) read as a **foreign repair layer**: square or haloed logo mattes, Helvetica phone inserts beside Type3 originals, and three phone conventions in one booking ecosystem. At the contact block — the conversion surface — quality drops from premium template to hurried patch.

**Deterministic scan:** Impeccable `detect.mjs` returned `[]` (PDFs out of scope; no HTML/CSS targets). PyMuPDF measurement confirmed: all replaced phone spans use **Helvetica** while untouched lines remain **Type3**; poster format uses `+66 (0) …` while schedule footer uses `+66 …` without `(0)`; schedule ALISDA header still shows `062-996-9434`. Logo dual-placement size deltas (11.25 pt on posters, 54.72 pt on schedule) pre-existed and are intentional layout, not regressions.

**Visual overlays:** Not available — PDF print collateral; no browser injection path.

## Overall Impression

The posters and schedule still sell the journey well at a glance. The problems concentrate where trust is decided: logos and phone numbers. A traveler comparing the poster contact block to the schedule footer will notice the second line looks re-typeset, and may wonder whether three different number formats point to the same booking line.

## What's Working

1. **Poster set consistency** — ChiangKhong, ChiangMai, ChiangRai, and HuayXai share layout, palette, TAT placement, and contact architecture. Route-specific copy swaps feel intentional.
2. **Contact hierarchy** — Mobile/WhatsApp, email, and meeting point remain icon-led and co-located; the block is scannable under time pressure.
3. **Schedule operational clarity** — Departure calendar, meeting-point chips, and QR codes serve a job the posters cannot; ALISDA partnership reads as distinct but on-brand.

## Priority Issues

### [P0] Logo still reads as pasted on several backgrounds
- **Why:** On navy (poster contact box, schedule sidebar) and cream (schedule footer), a light matte or halo around the circular badge breaks the premium, licensed-operator feel.
- **Fix:** Export a true vector or manually masked PNG; consider two locked variants (full badge on light/photo backgrounds, simplified mark on navy). Re-embed without square canvas.
- **Suggested command:** `/impeccable polish`

### [P1] Poster phone line 2 font does not match line 1
- **Why:** Line 1 remains Type3 ~10 pt; line 2 is Helvetica 10 pt in one merged span, ~3.7 pt taller bbox — visibly different weight and shape side-by-side.
- **Fix:** Re-typeset both lines from one source (PPTX/Illustrator) with matched face, size, and tracking; never mix embedding models on adjacent lines.
- **Suggested command:** `/impeccable typeset`

### [P1] Phone format inconsistent across the PDF set
- **Why:** Posters: `+66 (0) 62 996 9434`; schedule footer: `+66 62 996 9434`; schedule ALISDA block: `062-996-9434`. Same operational number, three conventions.
- **Fix:** Pick one canonical international format and apply to all five PDFs including partner block.
- **Suggested command:** `/impeccable clarify`

### [P2] Schedule footer typography mismatch
- **Why:** Replaced footer span is Helvetica 7.29 pt; first number remains Type3 7.294 pt — same class of mismatch as posters, in the legal/contact zone.
- **Fix:** Rebuild the entire footer phone string as one typographic unit.
- **Suggested command:** `/impeccable typeset`

### [P2] Poster phone redact patch visible on line 2
- **Why:** Flat fill RGB `(37, 91, 152)` does not perfectly match the contact block surface; reads as correction tape.
- **Fix:** Re-render contact text layer from source or sample background from PDF gradient.
- **Suggested command:** `/impeccable polish`

## Persona Red Flags

**Jordan (First-Timer):** Sees `062-996-9434` in the ALISDA block and `+66 (0) 62 996 9434` on posters — unsure if these are the same number. `(0)` present on posters but absent on schedule footer.

**Riley (Stress Tester):** Documents Helvetica vs Type3 on adjacent phone lines and three formatting systems for one number change — flags operational sloppiness inconsistent with displayed TAT licence.

## Minor Observations

- Logo upscale from 445×440 px shows edge halos at schedule sidebar size; acceptable on posters, marginal on schedule.
- "The Best Travel Agency" repeats in logo ring and schedule sidebar copy — minor redundancy.
- Top-left logo on scenic photo: transparency works better than on navy/cream, but contrast varies with background busyness.

## Questions to Consider

- If the contact block is the conversion surface, why patch one line instead of re-exporting the whole block from the editable PPTX?
- Should ALISDA keep local `062-…` format while Mekong uses international — or is one canonical dial string a brand rule?
- Do you need two logo variants (photo vs navy) instead of one transparent PNG fighting every background?
