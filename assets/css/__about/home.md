# Home

**Script:** [Home (script)](../home.css)

## Purpose

Homepage-only styles: the hero section (gradient background, `clamp()`-sized
title), the three alternating preview sections (Books/Essays/Gallery), and
a shared preview-card/preview-grid layout the sections currently render as
placeholders through (see root `index.php` — every section shows a
"uskoro..." placeholder, no live cards yet).

## Connections

### Uses

- [Root](root.md) — every custom property this file reads

### Used by

- Root `index.php` — the only page that loads `home.css` (`$styles = ['home']`)

## Design Decisions

- **`.preview-card`/`.gallery-grid` styles are written but unused today** —
  root `index.php` only ever renders `.preview-placeholder` divs; these
  card styles are ready for whichever session wires the homepage previews
  to real content (ROADMAP.md Phase 2).
