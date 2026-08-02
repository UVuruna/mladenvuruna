# Theme Switch

**Script:** [Theme Switch (script)](../theme-switch.css)

## Purpose

Styles the day/night toggle control: an SVG night/day background pair that
clip-path-wipes between states, a sun/moon circle that slides and cross-fades,
and the direction-aware wipe classes JS applies before flipping the checkbox.

## Connections

### Uses

- [Root](root.md) — every custom property this file reads
- `assets/img/svg/night.svg`, `assets/img/svg/day.svg` — background images

### Used by

- [Header](../../../includes/__about/header.md) — the PHP partial whose
  markup (`.theme-switch` + nested elements) this file styles
- [Theme Switch (script)](../../js/__about/themeSwitch.md) — sets
  `--switch-aspect-ratio` from the SVG's viewBox, toggles
  `.theme-switch--to-day`/`.theme-switch--to-night`, and reads
  `--wipe-duration`'s effective value via `config.wipeDuration`

## Design Decisions

- **`--switch-aspect-ratio` has a hardcoded fallback (`2.1538`) that JS
  overwrites at runtime** — see
  [Theme Switch (flow)](../../js/__flow/themeSwitch.md)'s
  `initSwitchDimensions()` step; the CSS value only matters for the
  instant between first paint and that JS running.
- **Only `--switch-height` is meant to be tuned** — `--switch-width`,
  `--toggle-size` and `--toggle-offset` are all `calc()`-derived from it
  and the aspect ratio, so resizing the control is a one-variable change
  (the file's own comment states this explicitly).
