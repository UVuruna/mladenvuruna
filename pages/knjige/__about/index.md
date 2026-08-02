# Knjige — Index

**Script:** [Knjige Index (script)](../index.php)

## Purpose

The `/pages/knjige/` route entry point. Sets page metadata, defines
placeholder book data (2 published books, 1 work-in-progress), and renders
each as a `.book-entry` — a `.book-stage` → `.book-wrapper` → `.book-container`
structure that [Book Reader](../../../assets/js/__about/bookReader.md)
progressively enhances into an interactive reader on page load.

## Connections

### Uses

- Root `config.php`, [Database](../../../includes/__about/db.md) (required
  but unused — see that doc's Design Decisions)
- [Includes (folder)](../../../includes/___includes.md) — `head.php`,
  `loader.php`, `header.php`, `footer.php`
- `getPlaceholderPages($count)` — local helper generating
  `https://placehold.co/...` page-image URLs (an EXTERNAL placeholder image
  host — the one exception to the project's "no external CDN, download
  everything locally" rule, acceptable for throwaway placeholder content;
  see [Open Questions](../../../OPEN-QUESTIONS.md))

## Data Shape

Each book array: `id`, `slug`, `title`, `description`, `review`,
`cover_front`/`cover_back` (both currently the same two shared placeholder
JPGs for every book), `pages` (array of image URLs), `buy_links` (array of
`{label, url}`, empty for the WIP book).

## Design Decisions

- **Every book reuses the same `example_front.jpg`/`example_back.jpg`
  cover images** — there is no per-book cover art yet, consistent with the
  hardcoded/placeholder state of this whole page (see
  [Knjige (folder)](../___knjige.md)'s Design Decisions).
