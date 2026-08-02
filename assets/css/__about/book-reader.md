# Book Reader

**Script:** [Book Reader (script)](../book-reader.css)

## Purpose

Styles the interactive reader itself: the closed-cover 3D tilt + hover
effect, the StPageFlip container and its library-generated `.stf__*`
element overrides (shadows, margin reset), the prev/close/next control
buttons, and `prefers-reduced-motion` handling.

## Connections

### Uses

- [Root](root.md) — every custom property this file reads, plus its own
  small `--book-*` variable set (page ratio, shadow, page color, transition
  timing) layered on top

### Used by

- [Knjige Index](../../../pages/knjige/__about/index.md) — loads this via
  `$styles = ['books', 'book-reader']`
- [Book Reader (script)](../../js/__about/bookReader.md) — reads/writes
  `--page-width`/`--page-height` on `.book-wrapper` and toggles
  `.is-open`/`data-state` classes this file's selectors key off

## Design Decisions

- **`.stf__*` selectors style markup this project doesn't author** — they
  target StPageFlip's own generated DOM (`assets/libraries/page-flip.min.js`),
  so these rules are inherently coupled to that library's internal class
  names and would break silently on a library upgrade that renames them.
- **`.book-stage` caps at `85vw`/`80vh`** while the actual pixel size is
  computed in JS ([Book Reader flow](../../js/__flow/bookReader.md)'s
  `getSize()`) — the CSS cap is a coarse safety bound, the JS calculation
  is what determines the real rendered size.
