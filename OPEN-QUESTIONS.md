# Open Questions — Mladen Vuruna

Dilemmas surfaced during autonomous sessions that need an owner call.
Tracked and linked from [README.md](README.md) per root Rule #18/CLAUDE.md.

## 2026-08-02 — Docs migration to MD-First 2.0 + enforcement layer

Autonomous overnight session (root `MIGRATE-DOCS.md`). LIVE production site
— zero code behavior was changed; everything below is either a judgment
call made in the session's favor (surfaced for the owner to overturn if
wrong) or an observed code issue flagged, not fixed, per the session's hard
constraint. This session never opened the SQLite database and never read
the real (gitignored) `config.php`.

### Observed code issues — flagged, NOT fixed

1. **Three assets referenced by `includes/head.php` do not exist on disk:**
   `assets/img/favicon.svg` (favicon link), `assets/fonts/main.woff2`
   (preload link — currently dead code anyway, since no page sets
   `$preloadFonts`), `assets/img/og-image.jpg` (Open Graph image). Documented
   in [Head](includes/__about/head.md).
2. **The admin login form (`includes/header.php`) posts to `api/admin.php`,
   which does not exist** — `api/` is an empty directory. `isAdminLoggedIn()`
   and `verifyAdminPassword()` (`config.example.php`) are defined but never
   called anywhere in the codebase. Matches ROADMAP.md Phase 4 (unchecked).
   Documented in [Header](includes/__about/header.md) and
   [Config Example](__about/config.example.md).
3. **The contact form (`includes/footer.php`) posts to `api/comments.php`,
   which does not exist** — same situation, matches ROADMAP.md Phase 5
   (unchecked). Documented in [Footer](includes/__about/footer.md).
4. **`assets/js/analytics.js` is loaded whenever `CONFIG['track_analytics']`
   is true (the default) but does not exist** — a harmless 404 script tag
   today. Documented in [Footer](includes/__about/footer.md).
5. **Header/footer nav link to `pages/galerija/`, which does not exist** —
   only `pages/eseji/` and `pages/knjige/` are built. Matches ROADMAP.md
   Phase 2 (unchecked). Documented in [Pages (folder)](pages/___pages.md).
6. **`assets/css/writer-simulator.css` references an undefined CSS variable:
   `var(--cursive-line-height)`** (line ~338) — only `--cursive-font`,
   `--cursive-content-size` and `--cursive-title-size` are actually declared.
   A legacy report (`docs/reports/writer-simulator/004-writer-simulator-fixes.md`,
   folded into this migration and then deleted) claimed all four variables
   were added together for font-size/line-height unification between
   handwriting-mode and post-animation cursive text — the fourth was not,
   and the property silently falls back to the browser default. Documented
   in [Writer Simulator CSS](assets/css/__about/writer-simulator.md).
7. **`assets/js/bookReader.js`'s `BookReader` class logs unconditionally**
   (~25 `console.log` calls across `open()`/`close()`/`_initializePageFlip()`
   per open/close cycle, for every visitor) — every other JS module in the
   project gates debug output behind `window.MV_IS_ADMIN`
   (`themeSwitch.js`, `writerSimulator.js`'s config-load branches). An
   inconsistency, not fixed. Documented in [JS (folder)](assets/js/___js.md).
8. **`components/books/` stays empty while `components/essays/` holds a
   real partial** — [Knjige](pages/knjige/___knjige.md)'s book markup lives
   inline in `pages/knjige/index.php` rather than factored into a
   `components/books/book-entry.php` the way essays are. The two content
   types are structured inconsistently today. Documented in
   [Components (folder)](components/___components.md).
9. **`pages/knjige/index.php`'s `getPlaceholderPages()` generates
   `https://placehold.co/...` URLs** — an external image host, which is the
   one exception in this codebase to the project's "no external CDN/API,
   download everything locally" rule (root `CLAUDE.md` Project Deltas).
   Acceptable for throwaway placeholder content, but worth a decision before
   real book pages replace it. Documented in
   [Knjige Index](pages/knjige/__about/index.md).
10. **No `<noscript>` fallback for essay content** — `components/essays/essay-entry.php`
    renders an empty `.essay-content` div; a visitor with JavaScript
    disabled sees no essay text at all (the real text sits only in the
    escaped `data-text` attribute). Documented in
    [Essays (folder)](components/essays/___essays.md).
11. **`includes/db.php`'s `getDB()`/`initializeTables()` are defined but
    never called anywhere** — the SQLite data layer exists but every page
    still renders hardcoded placeholder arrays (`// TODO: Replace with
    database query when ready`). No `.db` file exists on disk; this session
    never created or opened one. Documented in [Database](includes/__about/db.md).
12. **`assets/css/root.css`'s `.hp-field` and `assets/css/header.css`'s
    `.visually-hidden` are near-duplicate accessible-hiding utility
    classes** — worth collapsing into one shared class next time either file
    is touched. Documented in [Root CSS](assets/css/__about/root.md).
13. **`config/site.json`'s `loader.fadeDelay` (500) is never actually read
    by code** — `includes/loader.php`'s inline script hardcodes the same
    `500` directly instead of fetching this file; the two values currently
    agree by coincidence, not by wiring. Documented in
    [Config (folder)](config/___config.md).
14. **A legacy report (`docs/reports/book-reader/001-book-reader.md`, folded
    and deleted) claimed 6 placeholder books existed and that "URL hash
    updates on open" was tested/working** — current code has 3 placeholder
    books (2 published, 1 WIP) and `assets/js/bookReader.js` contains no
    `history.pushState`/hash logic at all. A false historical completion
    claim, not a current bug (the feature described was apparently either
    never actually shipped or was later removed) — surfaced here as the
    clearest example of "docs that lie" this migration was built to catch.

### Tier judgments made and why

| Judgment | Reasoning |
|----------|-----------|
| 3 of 23 tracked source files tiered Algorithmic (`assets/js/bookReader.js`, `assets/js/themeSwitch.js`, `assets/js/writerSimulator.js`) | Each has a genuine state machine, a real multi-step protocol, or nontrivial math a diagram tells better than the code — the narrowed "would the diagram just restate the code?" test (root DOCS.md, 2026-08-01 decision). The task brief named the book-flip viewer and writer simulator as "likely candidates"; `themeSwitch.js` was added on top because it independently matches a named DOCS.md signal (nontrivial geometry/math — the NOAA sunrise/sunset calculation — plus real async config-load state). |
| All 9 `assets/css/*.css` files stayed Standard, none Algorithmic | Every file is declarative selectors/properties — the diagram test again: prose in each `__about/` doc fully covers structure and intent without a flowchart adding information. Matches the sibling project's (Vaske Komarnici) identical conclusion for its own 11 CSS files. |
| `index.php` (root) and `includes/loader.php` tiered Trivial | Both are plain wiring/markup under the ~60-line heuristic AND in nature (page assembly, static loading-screen markup) — `loader.php` is line-for-line the same pattern as Vaske Komarnici's identically-named, identically-tiered file. |
| `config.example.php` (74 lines) tiered Standard | Defines three real functions with actual behavior (`isAdminIP`, `isAdminLoggedIn`, `verifyAdminPassword`) plus the site's one `CONFIG` array — not glue, even though two of the three functions have no caller yet (see flagged issue #2, #11). |
| `config.php` excluded from every guard and every doc entirely | Gitignored, holds real admin IPs and a real password hash, and would not exist on a fresh clone — no guard may depend on it. `config.example.php` is its tracked structural twin and is what `TIERS`/docs actually describe. This session never read `config.php`'s contents. |
| `config/*.json` (4 files) and `assets/libraries/*.min.js` (2 files) excluded from `TIERS`/every guard's source scope | JSON is not `.php`/`.js`/`.css`; the two `.min.js` files are vendored third-party code (no package manager on this project). Both get folder-doc-only documentation ([Config](config/___config.md), [Assets](assets/___assets.md)) rather than formal tier tracking — real information without ritual per-file docs for data/vendored files. |
| `pages/___pages.md` and `components/___components.md` created even though neither folder holds a directly-tiered file itself (only their subfolders do) | Exceeds the guard's strict minimum (which only requires a doc at the immediate parent of each `TIERS` entry) but was the natural place to document the empty sibling folders (`components/admin`, `books`, `comments`, `gallery`; the not-yet-built `pages/galerija/`) — honest "current state" documentation the Living Docs Rule asks for. |
| `tests/test_config_sections.py`'s `CONFIG_FILES` seeded EMPTY | The law's checker is Python-`ast`-based and this project has zero Python source. `config.example.php`'s `CONFIG` array and the four `config/*.json` files are the real PHP/JSON config-table candidates a future non-Python variant of the guard should cover — named explicitly in the test file's own docstring rather than silently omitted. |
| `tests/test_structure_law.py`'s `RATCHET` seeded EMPTY | No file in the project exceeds ~620 lines (`assets/js/writerSimulator.js` is the largest) — confirmed by the Phase 0 inventory, not assumed. Matches the task brief's own floor expectation ("no god-files expected"). |
| Root-level loose files (`index.php`, `config.example.php`) get `__about/`/`__flow/` directly under the project root, `README.md` plays their `___folder.md` role | Matches the identical provision applied in Vaske Komarnici (root DOCS.md's flat-project provision, applied per-loose-file) — this project has BOTH root-loose files and package-like folders, so only the two loose files use this provision. |
| The 12 legacy `docs/brainstorming/`, `docs/plans/`, `docs/reports/` files were folded and deleted rather than kept alongside the new structure | Root MIGRATE-DOCS.md Phase 2, step 5: "cross-cutting legacy docs that map to no single file... verify their claims against code, fold the still-true gaps into the owning per-file/folder docs, then DELETE them." Every still-true claim (StPageFlip architecture, the writer-simulator two-mode concept, the "growing paper"/scroll-lock fixes) is now in the relevant `__about`/`__flow` doc; every claim that no longer matches shipped code (Vara.js, CDN loading, 6 placeholder books, URL hash updates, `--cursive-line-height`) is preserved as a flagged drift observation above instead of silently dropped. |

### Awaiting a decision

None of the above blocked completion. The fourteen flagged code observations
are genuine candidates for a future FIX session (not this one — zero
behavior change was the hard constraint), and the tier/seed judgments are
reversible in a follow-up commit if the owner disagrees with any of them.
