# assets/

Every static asset the site serves: stylesheets, JavaScript, fonts, images,
vendored libraries, source design files, and the one sample PDF.

## Subfolders

| Folder | Role |
|--------|------|
| [css (subfolder)](css/___css.md) | One stylesheet per page/component, plus the shared base/reset |
| [js (subfolder)](js/___js.md) | Site behavior: menu/admin-modal wiring, theme day/night switching, the book reader, the essay writer simulator |
| `libraries/` | Vendored third-party JS (`page-flip.min.js`, `typed.min.js`) — no package manager on this project (root Rule #21); downloaded once, tracked in git, excluded from every guard's source scan (see [Tests (folder)](../tests/___tests.md)) exactly like a `node_modules/` would be |
| `fonts/` | `dancing-script/` — the two Dancing Script WOFF2 subsets (latin, latin-ext for Serbian diacritics) `@font-face`'d by [Writer Simulator CSS](css/__about/writer-simulator.md) |
| `img/` | `svg/` (day/night/quill/scroll icons), `webp/` (placeholder book covers), `material/` and `other/` (design source files, gitignored) |
| `pdf/` | `Lorem_ipsum.pdf` — a sample PDF, unused by any current code path |

## Connections

### Uses

- Nothing — this is a leaf of the project tree

### Used by

- [Includes (folder)](../includes/___includes.md) — every stylesheet/script
  link in `head.php`/`footer.php` points here
- [Pages (folder)](../pages/___pages.md), [Components (folder)](../components/___components.md)
  — reference images here directly (`<img src="...assets/...">`)

## Design Decisions

- **`assets/img/favicon.svg`, `assets/img/og-image.jpg` and
  `assets/fonts/main.woff2` are referenced by
  [Head](../includes/__about/head.md) but do not exist on disk** — flagged
  in [Open Questions](../OPEN-QUESTIONS.md), not created (zero behavior
  change is this session's hard constraint).
