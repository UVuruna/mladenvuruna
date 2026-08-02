# assets/js/

All site behavior: base UI wiring, day/night theming, the book reader, and
the essay writer simulator. No build step, no bundler, no framework — plain
`<script>` tags in load order (root `CLAUDE.md` Rule #21: right stack for a
server-rendered site with no SPA needs).

## Files

| File | Tier | One line |
|------|------|----------|
| `bookReader.js` | Algorithmic | `BookReader` class: open/close state machine, StPageFlip integration, centering math — [about](__about/bookReader.md) · [flow](__flow/bookReader.md) |
| `main.js` | Standard | mobile menu, admin-modal open/close, smooth-scroll wiring — [about](__about/main.md) |
| `themeSwitch.js` | Algorithmic | day/night theme: sunrise/sunset calculation, config load, wipe transition — [about](__about/themeSwitch.md) · [flow](__flow/themeSwitch.md) |
| `writerSimulator.js` | Algorithmic | `WriterSimulator` class + queue: typewriter/handwriting animation, pen tracking — [about](__about/writerSimulator.md) · [flow](__flow/writerSimulator.md) |

## Connections

### Uses

- `config/*.json` — [Config (folder)](../../config/___config.md);
  `bookReader.js`, `themeSwitch.js` and `writerSimulator.js` each fetch
  their own config file plus the shared `site.json`
- `assets/libraries/typed.min.js`, `assets/libraries/page-flip.min.js` —
  vendored globals `Typed` and `St.PageFlip`
- `window.MV_IS_ADMIN` — set by [Head](../../includes/__about/head.md);
  every debug `console.*` call in this folder is gated behind it (see
  Design Decisions for the one exception)

### Used by

- [Includes (folder)](../../includes/___includes.md) — `head.php` loads
  `themeSwitch.js` unconditionally (early, to prevent a theme flash);
  `footer.php` loads `main.js` unconditionally and the rest via `$scripts`

## Design Decisions

- **`bookReader.js`'s `BookReader` class logs unconditionally, not behind
  `window.MV_IS_ADMIN`** — every other module in this folder gates its
  debug output; `open()`/`close()`/`_initializePageFlip()` emit ~25
  `console.log` calls per open/close cycle for every visitor. Flagged in
  [Open Questions](../../../OPEN-QUESTIONS.md), not fixed (zero behavior
  change is this session's hard constraint).
- **No shared module system** — each file attaches its own IIFE
  (`ThemeSwitch`) or class + module-level singleton (`WriterSimulatorQueue`)
  directly to script scope; `main.js` and `bookReader.js` define plain
  top-level functions/classes. Consistent with "no build step, no bundler."
