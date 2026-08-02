# Root

**Script:** [Root (script)](../root.css)

## Purpose

The design-token layer: every CSS custom property the rest of the site
consumes (colors, typography scale, spacing scale, layout widths,
transition durations, shadows, border radii, z-index layers), plus the
global box-sizing/typography/button/form/modal reset every page shares.

## Connections

### Uses

- Nothing — this is the token source every other stylesheet in
  [CSS (folder)](../___css.md) depends on

### Used by

- Every file in [CSS (folder)](../___css.md) — all `var(--color-*)`,
  `var(--spacing-*)`, `var(--font-size-*)` etc. references resolve here
- `assets/js/themeSwitch.js` — toggles the `[data-theme="light"]` attribute
  this file's override block keys off

## Design Decisions

- **Dark ("Night") is the default; `[data-theme="light"]` is the override
  block** — matches [Theme Switch (flow)](../../js/__flow/themeSwitch.md)'s
  logic, which computes night as the fallback when sunrise/sunset can't be
  determined.
- **`.hp-field` and `.visually-hidden` are near-duplicate accessible-hiding
  utilities** (`.hp-field` in this file, `.visually-hidden` also redefined
  identically in [Header CSS](header.md)) — a small duplication worth
  collapsing into one shared class the next time either is touched; flagged
  in [components (folder)](../../../components/___components.md)'s sibling
  note is unrelated, tracked instead in
  [Open Questions](../../../OPEN-QUESTIONS.md).
