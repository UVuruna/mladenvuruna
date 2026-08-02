# pages/

Route entry points — one subfolder per site section, each holding a single
`index.php` that PHP's directory-index convention serves at a clean URL
(`/pages/knjige/`, `/pages/eseji/`).

## Subfolders

| Folder | Role |
|--------|------|
| [eseji (subfolder)](eseji/___eseji.md) | `/pages/eseji/` — essays, rendered through the Writer Simulator animation |
| [knjige (subfolder)](knjige/___knjige.md) | `/pages/knjige/` — books, rendered through the in-place StPageFlip reader |

## Connections

### Uses

- [Includes (folder)](../includes/___includes.md) — both route scripts
  assemble their page from `head.php`/`loader.php`/`header.php`/`footer.php`
- [Components (folder)](../components/___components.md) — `eseji/index.php`
  includes [Essay Entry](../components/essays/__about/essay-entry.md) per essay
- [Assets (folder)](../assets/___assets.md) — both routes load their
  section's CSS/JS via `$styles`/`$scripts`

### Used by

- [Includes (folder)](../includes/___includes.md)'s `header.php`/`footer.php`
  nav — link to both routes (plus a not-yet-built `pages/galerija/`, see
  [Open Questions](../OPEN-QUESTIONS.md))

## Design Decisions

- **`pages/galerija/` (the art gallery route) does not exist yet** — only
  `eseji/` and `knjige/` are built, matching
  [ROADMAP.md](../ROADMAP.md) Phase 2 (Gallery Section is unchecked). The
  header/footer nav already link to it regardless — see
  [Open Questions](../OPEN-QUESTIONS.md).
