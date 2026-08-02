# Book Reader

**Script:** [Book Reader (script)](../bookReader.js) ·
**Flow:** [diagram](../__flow/bookReader.md)

## Purpose

Progressively enhances every `.book-container` on the books page into an
interactive StPageFlip reader: click-to-open, prev/next/close controls,
keyboard navigation, and a 3-state centering animation (front-cover / spread
/ back-cover) synced with the page-flip library's own flip events.

## Connections

### Uses

- `St.PageFlip` — global from `assets/libraries/page-flip.min.js`
- `config/site.json` (`breakpoints.mobile`), `config/bookReader.json`
  (`timing`, `page`, `pageFlip`) — see [Config (folder)](../../../config/___config.md)
- [Book Reader CSS](../../css/__about/book-reader.md) — reads/writes
  `--page-width`/`--page-height`, toggles `.is-open`, `data-state`

### Used by

- [Knjige Index](../../../pages/knjige/__about/index.md) — one `.book-container`
  per book; `initBookReaders()` instantiates a `BookReader` for each on
  `DOMContentLoaded` (or immediately if the DOM is already ready)

## Classes

### BookReader

One instance per `.book-container`. State: `isOpen`, `isAnimating`,
`currentState` (`'closed' | 'front-cover' | 'spread' | 'back-cover'`),
`pageFlip` (the St.PageFlip instance, `null` when closed).

- `init()` — wires cover click, prev/next/close buttons; binds
  `handleKeyDown`.
- `getSize()` / `isLandscape()` — computes the page pixel size from the
  stage's actual `clientWidth`/`clientHeight` and the configured aspect
  ratio, branching on landscape-vs-portrait and clamping to the available
  height.
- `buildPages()` — rebuilds `.book-flipbook`'s children from the book's
  cover/page/back-cover data on every open.
- `updateCentering(state)` — sets `--page-width`/`--page-height` and a
  `translateX` on `.book-wrapper` per state (0 for spread/mobile, ±half
  page width for a single visible cover).
- `open()` / `_initializePageFlip()` / `close()` — see
  [Book Reader (flow)](../__flow/bookReader.md) for the full
  choreography.
- `prev()` / `next()` — thin wrappers over `pageFlip.flipPrev()`/`flipNext()`.

## Design Decisions

See [Book Reader (flow)](../__flow/bookReader.md) for the algorithm and
[Open Questions](../../../OPEN-QUESTIONS.md) for the unconditional
`console.log` observation ([JS (folder)](../___js.md)'s Design Decisions).
