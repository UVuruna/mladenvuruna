# Main

**Script:** [Main (script)](../main.js)

## Purpose

Core site-wide UI wiring, loaded on every page: mobile hamburger menu
toggle, admin-modal open/close (triggered by the header's admin button),
and smooth-scroll for in-page `#anchor` links.

## Connections

### Uses

- DOM elements rendered by [Header](../../../includes/__about/header.md):
  `#menu-toggle`, `#main-nav`, `#admin-toggle`, `#admin-modal`

### Used by

- [Footer](../../../includes/__about/footer.md) — loaded unconditionally
  (the base script every page includes, before `$libraries`/`$scripts`)

## Functions

- `initMobileMenu()` — toggles `.active`/`aria-expanded` on the nav,
  closes on link click or Escape, locks `body` scroll while open.
- `initAdminModal()` / `openAdminModal()` / `closeAdminModal()` — shows/hides
  `#admin-modal`, focuses the password field on open, clears it on close.
  `closeAdminModal` is exposed on `window` for the modal's inline
  `onclick="closeAdminModal()"` cancel button.
- `initSmoothScroll()` — intercepts `a[href^="#"]` clicks, scrolls with a
  header-height offset via `getBoundingClientRect()` + `scrollTo()`.

## Design Decisions

- **No feature detection beyond null checks** (`if (!menuToggle ||
  !mainNav) return;`) — this file assumes the elements it wires either
  exist (every page includes [Header](../../../includes/__about/header.md))
  or are absent (non-admin visitors: `#admin-toggle`/`#admin-modal` are
  never rendered by PHP, so their listeners are simply skipped).
