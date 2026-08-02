# Writer Simulator

**Script:** [Writer Simulator (script)](../writer-simulator.css)

## Purpose

Styles the essay animation: the locally-hosted Dancing Script `@font-face`
(two subsets — latin and latin-ext for Serbian diacritics), the aged-parchment
background (SVG-noise texture + inset shadows), the mode-toggle buttons, the
paper content area and Typed.js cursor, the quill-pen positioning +
`pen-writing` rotation keyframes, the skip/font-toggle buttons, and the
unified cursive-font variable set shared between `.handwriting-mode` (during
animation) and `.cursive-text` (after completion, when toggled).

## Connections

### Uses

- [Root](root.md) — every custom property this file reads
- `assets/fonts/dancing-script/*.woff2` — the two `@font-face` sources
- `Typed.js`'s `.typed-cursor`/`.typed-wrapper` classes (from
  `assets/libraries/typed.min.js`) — styled here, not generated here

### Used by

- [Eseji Index](../../../pages/eseji/__about/index.md) — loads this via
  `$styles = ['writer-simulator']`
- [Essay Entry](../../../components/essays/__about/essay-entry.md) — the
  markup this file styles
- [Writer Simulator (script)](../../js/__about/writerSimulator.md) — sets
  inline `--pen-rot-min`/`--pen-rot-max`/pen `left`/`top`/`width`, toggles
  `.is-animating`/`.has-animated`/`.handwriting-mode`/`.cursive-text`/`.normal-text`

## Design Decisions

- **`--cursive-line-height` is referenced but never defined.** Line 338
  (`.essay-entry.cursive-text .essay-content` block) reads
  `line-height: var(--cursive-line-height)`, but only `--cursive-font`,
  `--cursive-content-size` and `--cursive-title-size` are actually declared
  on `.essay-entry` (lines 325-329). A legacy report
  (`docs/reports/writer-simulator/004-writer-simulator-fixes.md`, folded
  into this migration) claimed all four variables were added together —
  the fourth was not, and the property silently falls back to the browser
  default `line-height` instead of the intended unified value. Flagged in
  [Open Questions](../../../OPEN-QUESTIONS.md), not fixed (zero behavior
  change).
- **`html, body { overflow-x: hidden; }` lives at the top of this
  page-specific file, not in the always-loaded [Root](root.md)** — a
  targeted fix for pen-position overflow on the essays page specifically
  (see [Writer Simulator flow](../../js/__flow/writerSimulator.md) for the
  pen-clamping logic this pairs with), rather than a site-wide rule.
