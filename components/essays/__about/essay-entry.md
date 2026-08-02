# Essay Entry

**Script:** [Essay Entry (script)](../essay-entry.php)

## Purpose

Renders one essay's static markup shell: the parchment container, an
optional mode-toggle (typewriter/handwriting buttons — only shown if the
caller didn't preset `$essay['mode']`), the title and content elements
(both carry the real text in `data-text`, escaped, left empty for JS to
fill), the skip button, and the quill-pen `<img>` used in handwriting mode.

## Connections

### Uses

- `$essay` (array: `id`, `slug`, `title`, `content`, optional `mode`,
  optional `author`), `$basePath` — variables the including page sets

### Used by

- [Eseji Index](../../../pages/eseji/__about/index.md) — one `include` per
  essay
- [Writer Simulator](../../../assets/js/__about/writerSimulator.md) — reads
  `.essay-content[data-text]`, `.essay-pen`, `.essay-skip`,
  `.essay-mode-toggle` and the container's `data-mode` attribute

## Design Decisions

- **`$essayMode` presence controls whether the toggle renders at all** —
  `data-mode` on the `<article>` doubles as both the CSS hook
  ([Writer Simulator CSS](../../../assets/css/__about/writer-simulator.md))
  and the signal [Writer Simulator](../../../assets/js/__about/writerSimulator.md)
  reads in `init()` to lock the mode, so there is exactly one source of
  truth for "is this essay's mode fixed or user-choosable."
- **Content is escaped once, here, via `htmlspecialchars(..., ENT_QUOTES,
  'UTF-8')`** — matches the project's security rule (root `CLAUDE.md`
  Project Deltas). The JS side never re-escapes; it treats `data-text` as
  already-safe plain text and applies its own minimal Markdown-like
  formatting on top (see [Writer Simulator (flow)](../../../assets/js/__flow/writerSimulator.md)).
