# assets/css/

One stylesheet per page/component, loaded selectively per page via
`$styles` (root `CLAUDE.md` Project Deltas: "no single giant style.css").
`root.css`, `loader.css`, `header.css`, `footer.css` and `theme-switch.css`
are the five always-loaded base sheets (see [Head](../../includes/__about/head.md));
everything else is page/component-specific.

## Files

| File | Tier | One line |
|------|------|----------|
| `book-reader.css` | Standard | the interactive book: cover 3D tilt, StPageFlip container/overrides, controls — [about](__about/book-reader.md) |
| `books.css` | Standard | `/pages/knjige/` page layout: header, book-entry sizing, buy links, WIP section — [about](__about/books.md) |
| `footer.css` | Standard | contact form + site footer — [about](__about/footer.md) |
| `header.css` | Standard | fixed header, mobile hamburger nav, admin toggle/modal — [about](__about/header.md) |
| `home.css` | Standard | homepage hero + preview-grid sections — [about](__about/home.md) |
| `loader.css` | Standard | loading-screen overlay + spin/pulse keyframes — [about](__about/loader.md) |
| `root.css` | Standard | CSS custom properties (colors, spacing, type scale) + global reset — [about](__about/root.md) |
| `theme-switch.css` | Standard | day/night toggle control: SVG backgrounds, sun/moon, wipe transition — [about](__about/theme-switch.md) |
| `writer-simulator.css` | Standard | `/pages/eseji/` essay parchment, typewriter cursor, pen, mode toggle — [about](__about/writer-simulator.md) |

## Connections

### Uses

- `root.css`'s custom properties (`--color-*`, `--spacing-*`,
  `--font-size-*`, `--transition-*`, `--radius-*`, `--shadow-*`, `--z-*`) —
  every other file in this folder consumes them; none of the page/component
  sheets redefine their own color or spacing scale

### Used by

- [Includes (folder)](../../includes/___includes.md) — `head.php` links the
  five base sheets unconditionally and the page-specific ones from `$styles`

## Design Decisions

- **`[data-theme="light"]` overrides live only in `root.css`** — the day
  theme is expressed entirely as custom-property overrides on that one
  selector; no other stylesheet branches on `[data-theme]` except
  [Writer Simulator CSS](__about/writer-simulator.md) (parchment shadow
  softening) and [Book Reader CSS](__about/book-reader.md) has none at all
  (the book page color is theme-independent parchment `#f8f5ed`).
- **No CSS file in this project crosses ~520 lines** (`writer-simulator.css`
  is the largest) — none of the nine earned an Algorithmic tier under the
  narrowed "would a diagram just restate the code?" test (root `DOCS.md`,
  2026-08-01 decision): every file here is declarative selectors/properties,
  not a state machine or protocol a diagram would clarify.
