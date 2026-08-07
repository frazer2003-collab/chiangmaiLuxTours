---
name: Mekong Transfer
description: River navigation chart — licensed Mekong slow boat booking
colors:
  chart-paper: "#f7f5f0"
  river-blue: "#2563a8"
  river-blue-deep: "#1a4a75"
  river-navy: "#0f2740"
  marker-yellow: "#f2c94c"
  ink: "#152536"
  ink-muted: "#4a5f73"
typography:
  display:
    fontFamily: "Libre Baskerville, Georgia, serif"
    fontSize: "clamp(2rem, 6vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  section:
    fontFamily: "Libre Baskerville, Georgia, serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.14em"
rounded:
  pill: "9999px"
  card: "1rem"
  sheet: "1.25rem"
spacing:
  section-y: "3rem"
  section-y-lg: "4rem"
  container-x: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.river-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0.625rem 1rem"
  button-accent:
    backgroundColor: "{colors.marker-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.25rem"
---

# Design System: Mekong Transfer

## Overview

**Creative North Star: "The River Chart"**

Mekong Transfer reads as a navigable hydrographic chart — cream paper, blue river lines, yellow fix markers — not a generic travel brochure. Waypoints, legs, and licensed confidence replace stock hero photography and star ratings. The interface is mobile-first: pick a route on the chart, inspect the leg, book passage.

Density is comfortable for travelers researching on phones. Trust signals (TAT licence, itinerary clarity, meeting hubs) outweigh decorative marketing. Placeholders for photos, payment, and live dates are labeled honestly.

**Key characteristics:**

- Cream chart-paper ground with subtle grid overlay on route sections
- Navy hero band with wave silhouette and yellow primary CTAs
- Serif route labels (Libre Baskerville) + sans UI (Libre Franklin)
- Pill buttons in yellow (primary action) or river blue (secondary)
- Four waypoints on a horizontal chart — not an overwhelming catalog

## Colors

Palette derived from the circular logo: white, blue, yellow on chart paper.

### Primary

- **River Blue** (#2563a8): Route labels, secondary buttons, borders, chart grid tint. Deep variant #1a4a75 for hover on blue buttons.
- **Marker Yellow** (#f2c94c): Primary CTAs, waypoint markers, focus rings, selection highlights in booking.

### Neutral

- **Chart Paper** (#f7f5f0): Page background, card-adjacent surfaces, booking sheet.
- **River Navy** (#0f2740): Hero and footer bands; modal overlay at 55% opacity.
- **Ink** (#152536): Primary text on light surfaces.
- **Ink Muted** (#4a5f73): Supporting copy, labels, FAQ answers.

### Named Rules

**The Licence Stripe Rule.** TAT Licence ID 21/01279 appears as a compact trust chip in the hero and in the footer — never as decorative filler.

**The Honest Placeholder Rule.** Demo payment, photos, and dates must read as placeholders. Never imply live inventory or charges.

## Typography

**Display / route font:** Libre Baskerville (Georgia fallback)  
**UI font:** Libre Franklin (system-ui fallback)

**Character:** Serif headings evoke chart titles and route names; sans body keeps booking forms scannable on mobile.

### Hierarchy

- **Display** (400, clamp 2rem–3.25rem, lh 1.05): Hero H1 only.
- **Section** (400, ~1.875rem–2.25rem, tracking −0.02em): H2 section titles ("River routes", "Questions").
- **Tour title** (600, 1.125rem–1.875rem): Card and detail headings.
- **Body** (400, 1rem, lh ~1.625): Paragraphs; max ~65ch in hero subcopy.
- **Label** (600, 0.75rem, uppercase, wide tracking): Duration, waypoint tags, step labels.

## Layout

- **Container:** `max-w-6xl` centered; FAQ section `max-w-3xl`.
- **Horizontal padding:** 1rem mobile, 1.5rem from `sm`.
- **Section rhythm:** `py-12` mobile, `py-16` from `sm` on major bands.
- **Tour cards:** Horizontal snap scroll on mobile (`85vw` card width); 2-col `md`, 4-col `xl` grid on desktop.
- **Tour detail:** Single column mobile; `lg:grid-cols-[1.1fr_0.9fr]` at large breakpoints.
- **Sticky header:** Chart-paper background at 92% opacity with light backdrop blur.

## Elevation & Depth

Hybrid: soft directional shadows on cards and booking sheet; tonal layering (white cards on chart paper, navy hero/footer). No hard offset shadows.

### Shadow Vocabulary

- **Tour card:** `0 14px 40px -22px rgba(27,61,92,0.45)`
- **Booking sheet:** `0 24px 60px -12px rgba(15,39,64,0.35)`
- **Header CTA:** `0 8px 20px -8px rgba(242,201,76,0.8)` on yellow buttons

Depth on water sections uses SVG wave fill at low opacity, not drop shadows.

## Shapes

- **Pill buttons:** `rounded-full` for all primary actions.
- **Cards / panels:** `rounded-2xl` (1rem).
- **Booking sheet:** Top corners `rounded-t-[1.25rem]` on mobile; full `1.25rem` from `sm`.
- **Logo:** Circular crop with 2px yellow ring.
- **Waypoint markers:** Small yellow circles with chart-paper ring on desktop timeline.

## Components

### Buttons

- **Shape:** Full pill (`rounded-full`), min height 44px on touch targets.
- **Primary accent:** Yellow fill, ink text; hover `brightness-95`.
- **Primary river:** Blue fill, white text; hover `river-blue-deep`.
- **Focus:** 2px outline with offset; yellow or blue ring depending on surface.

### Cards / Containers

- **Tour card:** White surface, blue-tinted border, 4:3 photo placeholder gradient (blue ramp until real photography).
- **Detail aside:** Chart-paper fill, rounded-2xl, booking CTA in yellow.
- **FAQ item:** White `details` panel, rounded-2xl, border.

### Inputs / Fields

- **Style:** White fill, `rounded-xl`, blue-tint border at 25% opacity.
- **Focus:** Yellow 2px outline offset.
- **Error:** River-blue-deep text, `role="alert"`, `aria-invalid` on field.
- **Date selection:** Radio cards with yellow border/background when selected.

### Navigation

- **Header:** Logo + wordmark (sm+), yellow "Book a tour" pill linking to `#tours`.
- **Skip link:** Visually hidden until focused; yellow pill fixed top-left.

### Booking sheet (signature)

- Bottom sheet on mobile, centered modal on `sm+`.
- Step indicator: "Chart booking · Step N of 4".
- Focus trap, Escape to close, focus return to triggering button.

## Do's and Don'ts

### Do:

- **Do** use CSS variables (`--chart-paper`, `--river-blue`, `--marker-yellow`, etc.) for all semantic colors.
- **Do** label demo dates, payment, and photos explicitly.
- **Do** show TAT Licence 21/01279 in hero and footer.
- **Do** use chart grid overlay only on chart/route surfaces.

### Don't:

- **Don't** invent prices, reviews, seat counts, or payment provider badges.
- **Don't** use generic stock-tour card grids without waypoint/chart framing.
- **Don't** hide booking behind more than three taps from the hero CTA path.
