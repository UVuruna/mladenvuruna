# Head

**Script:** [Head (script)](../head.php)

## Purpose

The `<head>...</head>` block every page includes: meta tags, favicon,
optional font preload, the `window.MV_IS_ADMIN` flag every JS module reads
for debug logging, base stylesheet links (always loaded), the theme-switch
script (loaded early to prevent a flash of the wrong theme), page-specific
stylesheet links, a conditional StPageFlip library `<script>`, and Open
Graph meta tags.

## Connections

### Uses

- Root [Config Example](../../__about/config.example.md) — `isAdminIP()`
  for `window.MV_IS_ADMIN`, `CONFIG['site_url']` for the `og:url`/`og:image`
  meta tags
- `$basePath`, `$pageTitle`, `$pageDescription`, `$styles`, `$preloadFonts`
  — variables the including page script sets before this include

### Used by

- Root `index.php`, [Eseji](../../pages/eseji/__about/index.md),
  [Knjige](../../pages/knjige/__about/index.md) — every entry-point page
  includes this first, inside `<html>`

## Design Decisions

- **`window.MV_IS_ADMIN` is the one global every JS module checks before
  `console.log`/`console.warn`/`console.group`** — [Theme Switch (flow)](../../assets/js/__flow/themeSwitch.md)
  and the config-loading branches of [Book Reader](../../assets/js/__about/bookReader.md)
  and [Writer Simulator](../../assets/js/__about/writerSimulator.md) all
  gate their debug output this way, so regular visitors see a clean
  console. **Not every debug line in the codebase follows this pattern** —
  see [Open Questions](../../OPEN-QUESTIONS.md) for the one file that
  doesn't.
- **Three referenced assets do not exist on disk**: `assets/img/favicon.svg`
  (the `<link rel="icon">` href), `assets/fonts/main.woff2` (the preload
  link, gated behind an `$preloadFonts` flag that no page currently sets, so
  this branch never actually renders today), and `assets/img/og-image.jpg`
  (the `og:image` meta content). Flagged, not fixed — see
  [Open Questions](../../OPEN-QUESTIONS.md).
