# CLAUDE.md — Mladen Vuruna

The monorepo constitution governs: read the root `CLAUDE.md` first, then load
ONLY the rulebook your job needs via its Router. Nothing universal is
restated here — this file carries project FACTS and project DELTAS, and may
only tighten root rules, never loosen them.

| Your job this session | Read (monorepo root) |
|------------------------|----------------------|
| Implement / fix | `rules/CODE.md` + the folder's `___folder.md` |
| Write documentation | `rules/DOCS.md` |
| Any GUI/visual work | `DESIGN.md` |
| Plan / brainstorm | `rules/PLAN.md` |

Start here for the code itself: [README](README.md) ->
[Includes (folder)](includes/___includes.md) /
[Pages (folder)](pages/___pages.md) /
[Components (folder)](components/___components.md) /
[Config (folder)](config/___config.md) /
[Assets (folder)](assets/___assets.md). Open decisions live in
[Open Questions](OPEN-QUESTIONS.md). Feature roadmap: [ROADMAP.md](ROADMAP.md).

---

## Project Facts

- **Product:** personal portfolio website for Mladen Vuruna, a Serbian
  writer and artist, live at mladenvuruna.com. **Early-phase but LIVE
  production** — treat every change as behavior-affecting until proven
  otherwise. Book excerpts with a page-flip viewer, essay animations
  (typewriter/handwriting), an IP-gated admin UI (no backend yet),
  visitor-comment form UI (no backend yet). See [README](README.md) for
  what's live vs. planned.
- **Stack:** PHP 8.x (server-rendered, shared `includes/` partials),
  vanilla JavaScript (no build step, no bundler, one `<script>` per
  concern), CSS3 (one stylesheet per page/component, mobile-first), SQLite
  (schema defined in [Database](includes/__about/db.md), not yet populated
  or queried by any live page). See root Rule #21 (Right Language for the
  Job): a small server-rendered site with no SPA needs has no reason to
  reach for a framework or a build pipeline.
- **No build pipeline, no installer, no GitHub Releases.** Root
  `CLAUDE.md`'s Build & Release System (Rules #23/#24) governs *installable
  desktop apps*; this is a manually/webhook-deployed website (push to
  GitHub → Hostinger webhook → auto-deploy), so those rules do not apply
  here.
- **`config.php` is gitignored and never read into any doc.** It holds the
  real admin IP whitelist and a real `password_hash()` output; the tracked
  `config.example.php` carries identical structure with placeholder values
  and is what every guard and doc describes — see
  [Config Example](__about/config.example.md). Never paste `config.php`'s
  actual contents into a doc, commit message, or session output.
- **Backend endpoints referenced by the UI do not exist yet.** The admin
  login modal posts to `api/admin.php`; the contact form posts to
  `api/comments.php`; `CONFIG['track_analytics']` loads
  `assets/js/analytics.js`. `api/` is an empty directory and
  `assets/js/analytics.js` does not exist — the UI is real, the backends
  are ROADMAP.md Phase 4/5 work. Full list of observed gaps:
  [Open Questions](OPEN-QUESTIONS.md).
- **Content is hardcoded placeholder data, not database-backed.** Both
  `pages/eseji/index.php` and `pages/knjige/index.php` render PHP arrays
  marked `// TODO: Replace with database query when ready`; `includes/db.php`'s
  `getDB()`/`initializeTables()` are defined but never called anywhere in
  the current codebase — see [Database](includes/__about/db.md).

## Enforcement

The four guard tests + `run_guards.py` + Claude Code hooks live in `tests/` /
`.claude/settings.json` (root `CODE.md` -> Enforcement — see
[Tests (folder)](tests/___tests.md)):

- `test_structure_law.py`'s RATCHET is **empty** — no file in this project
  crosses the ~1,000-line violation threshold (largest is
  `assets/js/writerSimulator.js` at 618 lines).
- `test_config_sections.py`'s `CONFIG_FILES` is **empty** — its checker is
  Python-AST-based (root `CODE.md`'s checkable semantics), this project has
  no Python source, and this is a deliberate seed, not an oversight: see
  the file's own docstring for the PHP/JSON candidates
  (`config.example.php`'s `CONFIG` array, `config/*.json`) a future
  non-Python variant of the guard would cover.

## Project Deltas to the Root Rules

- **Commit format:** plain `0.0.000 description` (root convention, unchanged
  — no per-project delta), following the existing history's style
  (`0.0.NNN Component - detail`).
- **Config home (root Rule #4):** DB path, image-conversion sizes, admin
  IPs, admin password hash and site metadata live in the single `CONFIG`
  array (`config.php` in production, `config.example.php` tracked as its
  structural template) — no other file should contain magic numbers for
  these concerns.
- **No external CDN/API — download everything locally.** JS libraries live
  in `assets/libraries/` (vendored, no package manager), fonts in
  `assets/fonts/`. The one deliberate exception:
  `pages/knjige/index.php`'s placeholder book pages use `placehold.co` URLs
  — flagged in [Open Questions](OPEN-QUESTIONS.md) as a decision to revisit
  before real book pages replace the placeholders.
- **Security:** prepared statements (never string interpolation into SQL —
  not yet exercised, since no live query exists), `htmlspecialchars(...,
  ENT_QUOTES, 'UTF-8')` on all output (in force today — see
  [Essay Entry](components/essays/__about/essay-entry.md)), hashed
  passwords (`password_hash`/`password_verify` — defined, not yet called;
  see [Open Questions](OPEN-QUESTIONS.md)).
- **Accessibility:** `aria-label` on icon buttons, `alt` on every content
  image, semantic HTML — in force across [Header](includes/__about/header.md),
  [Footer](includes/__about/footer.md), [Book Reader](assets/js/__about/bookReader.md)'s
  controls.
- Communicate with the owner in Serbian (Latin script); everything written
  to files stays English (root Rules #12/#13) — unchanged, restated only
  because this project's own content (essay/book copy in Serbian) makes the
  boundary worth naming: **user-facing product copy** is Serbian,
  **code identifiers, comments and documentation prose** are English even
  when they describe Serbian-language content.
