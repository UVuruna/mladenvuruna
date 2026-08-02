# Theme Switch

**Script:** [Theme Switch (script)](../themeSwitch.js) ·
**Flow:** [diagram](../__flow/themeSwitch.md)

## Purpose

Day/night theme control: computes the initial theme from real sunrise/sunset
times for a configured location (falling back to a stored user preference),
applies it before `DOMContentLoaded` to avoid a flash, and drives the
bidirectional wipe animation when the visitor toggles the switch.

## Connections

### Uses

- `config/site.json` (`location`), `config/themeSwitch.json` (`svgPath`,
  `wipeDuration`, `storageKey`) — see [Config (folder)](../../../config/___config.md)
- [Theme Switch CSS](../../css/__about/theme-switch.md) — sets
  `--switch-aspect-ratio`, toggles `[data-theme="light"]` on
  `<html>`, adds/removes `.theme-switch--to-day`/`.theme-switch--to-night`
- `window.MV_IS_ADMIN` — gates every debug `console.*` call

### Used by

- [Head](../../../includes/__about/head.md) — loaded unconditionally, early
  (before `<body>`, to prevent a theme flash)
- [Header](../../../includes/__about/header.md) — attaches to
  `#theme-switch-input`

## Public API

`ThemeSwitch` (IIFE, exposes `init`, `isDaytime`, `getTheme`) —
`ThemeSwitch.init()` runs immediately at the bottom of the file.

## Design Decisions

See [Theme Switch (flow)](../__flow/themeSwitch.md) for the sunrise/sunset
algorithm and the two-phase init (apply-then-load-config) that avoids a
flash while still honoring the fetched config once it arrives.
