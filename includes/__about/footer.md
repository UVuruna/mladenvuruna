# Footer

**Script:** [Footer (script)](../footer.php)

## Purpose

The contact/comments section (`#kontakt`, with a honeypot spam field) plus
the site footer (brand, nav, copyright), and the closing `<script>` tag
assembly: base script, then third-party libraries, then page-specific
scripts, then the conditional analytics script.

## Connections

### Uses

- Root [Config Example](../../__about/config.example.md) —
  `CONFIG['track_analytics']` gates the analytics `<script>` tag
- `$basePath`, `$contentId`, `$libraries`, `$scripts` — variables the
  including page script sets

### Used by

- Root `index.php`, [Eseji](../../pages/eseji/__about/index.md),
  [Knjige](../../pages/knjige/__about/index.md) — every entry-point page
  includes this last, right before `</body>`

## Design Decisions

- **Script load order is deliberate**: `main.js` (base) → `$libraries`
  (third-party globals, e.g. `typed.min`) → `$scripts` (page-specific,
  which depend on those globals) → analytics. Swapping the order would
  break any page script that references a library global at parse time.
- **The contact form posts to `api/comments.php`, which does not exist
  yet** — same situation as [Header](header.md)'s admin form: `api/` is
  empty on disk (matches [ROADMAP.md](../../ROADMAP.md) Phase 5,
  unchecked). Flagged in [Open Questions](../../OPEN-QUESTIONS.md).
- **`CONFIG['track_analytics']` defaults to `true`** (see
  [Config Example](../../__about/config.example.md)), so a fresh checkout
  renders `<script src=".../assets/js/analytics.js">` — a file that does
  not exist in `assets/js/`. Harmless (the browser just 404s the script
  tag), but flagged in [Open Questions](../../OPEN-QUESTIONS.md) as
  observed behavior.
