# Books

**Script:** [Books (script)](../books.css)

## Purpose

Styles the `/pages/knjige/` page frame around the reader: page header, each
`.book-entry`'s viewport-height layout (stage grows, controls/info stay
fixed size, info hides while `.is-reading`), review blockquote styling, buy
links, and the visually-distinct "Works in Progress" section.

## Connections

### Uses

- [Root](root.md) — every custom property this file reads
- [Book Reader CSS](book-reader.md) — this file explicitly defers
  `.book-stage`-internal styling to that sheet (comment: "handled in
  book-reader.css")

### Used by

- [Knjige Index](../../../pages/knjige/__about/index.md) — loads this via
  `$styles = ['books', 'book-reader']`

## Design Decisions

- **`.book-entry` is a fixed `calc(100vh - 80px)` tall** — the reader
  always fills the viewport minus header height, regardless of content
  length, which is what makes the `.is-reading` "hide info, controls+book
  fill the space" transition read as a mode switch rather than a layout
  reflow.
