# Header

**Script:** [Header (script)](../header.css)

## Purpose

Styles the fixed site header: logo, desktop nav row / mobile full-screen
overlay nav (hamburger-driven), the admin toggle button, and the admin
password modal's text alignment.

## Connections

### Uses

- [Root](root.md) — every custom property this file reads

### Used by

- [Header](../../../includes/__about/header.md) — the PHP partial whose
  markup this file styles
- `assets/js/main.js` — toggles `.active`/`aria-expanded` classes this
  file's selectors key off

## Design Decisions

- **Mobile nav uses `!important` extensively inside its `@media (max-width:
  767px)` block** — overriding the desktop-first base rules further down
  the file for `.main-nav`/`.nav-list` rather than relying on cascade order
  alone; a defensive pattern given how many selectors both blocks share.
- **`.visually-hidden` is redefined here identically to `.hp-field` in
  [Root](root.md)** — see that doc's Design Decisions.
