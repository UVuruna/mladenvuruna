# components/essays/

The single essay-rendering partial [Eseji](../../pages/eseji/___eseji.md)
includes once per essay.

## Files

| File | Tier | One line |
|------|------|----------|
| `essay-entry.php` | Standard | essay markup: parchment, optional mode toggle, title/content data attributes, skip button, quill pen — [about](__about/essay-entry.md) |

## Connections

### Uses

- Nothing of its own — pure presentational partial driven entirely by the
  `$essay`/`$basePath` variables its caller sets

### Used by

- [Eseji Index](../../pages/eseji/__about/index.md) — one `include` per
  essay inside a `foreach`
- [Writer Simulator](../../assets/js/__about/writerSimulator.md) — the JS
  class that progressively enhances every `.essay-entry` this partial
  renders (reads `data-text`, animates into `.essay-content`)

## Design Decisions

- **All animation happens client-side** — the PHP output is inert markup
  with the raw text sitting in `data-text` attributes (escaped via
  `htmlspecialchars`); [Writer Simulator](../../assets/js/__about/writerSimulator.md)
  reads that attribute and drives everything else. A visitor with
  JavaScript disabled sees an empty `.essay-content` (no `<noscript>`
  fallback) — flagged in [Open Questions](../../OPEN-QUESTIONS.md).
