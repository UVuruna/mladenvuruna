# components/

Reusable content-rendering partials, one subfolder per content type. Only
`essays/` is populated today — `admin/`, `books/`, `comments/`, `gallery/`
exist as empty directories on disk, scaffolding for subsystems described in
[ROADMAP.md](../ROADMAP.md) (Phases 2, 4, 5) that are not built yet.

## Subfolders

| Folder | Role |
|--------|------|
| [essays (subfolder)](essays/___essays.md) | `essay-entry.php` — the per-essay markup [Eseji](../pages/eseji/___eseji.md) includes in a loop |
| `admin/` | Empty — no admin content-editing partials exist yet (ROADMAP Phase 4) |
| `books/` | Empty — [Knjige](../pages/knjige/___knjige.md) currently renders its book markup inline rather than through a `components/books/` partial |
| `comments/` | Empty — no comment-rendering partial exists yet (ROADMAP Phase 5) |
| `gallery/` | Empty — no gallery route or partial exists yet (ROADMAP Phase 2) |

## Connections

### Uses

- Nothing of its own — `essays/essay-entry.php` is the only file here, and
  it depends only on the `$essay`/`$basePath` variables its caller sets

### Used by

- [Pages (folder)](../pages/___pages.md) — `eseji/index.php` includes
  `essays/essay-entry.php` in a loop

## Design Decisions

- **`books/` staying empty is a real inconsistency worth noting**: unlike
  essays, [Knjige](../pages/knjige/___knjige.md)'s book markup lives
  entirely inline inside `pages/knjige/index.php` rather than in a
  `components/books/book-entry.php` partial the way essays factor out —
  the two content types are NOT structured the same way today. Not fixed
  (zero behavior change), flagged in [Open Questions](../OPEN-QUESTIONS.md).
