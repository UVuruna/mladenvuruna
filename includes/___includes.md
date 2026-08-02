# includes/

Shared PHP partials every page `require_once`/`include`s to assemble its
HTML shell: database access, the `<head>` block, header/nav, footer/contact,
and the loading screen.

## Files

| File | Tier | One line |
|------|------|----------|
| `db.php` | Standard | SQLite/PDO singleton connection + schema init — [about](__about/db.md) |
| `footer.php` | Standard | contact form, site footer, script-tag assembly — [about](__about/footer.md) |
| `head.php` | Standard | `<head>` block: meta, base styles, admin JS flag, Open Graph — [about](__about/head.md) |
| `header.php` | Standard | nav, admin button + modal, theme-switch markup — [about](__about/header.md) |
| `loader.php` | Trivial | static loading-screen markup + a 20-line inline hide-on-load script |

## Connections

### Uses

- Root [Config Example](../__about/config.example.md) — every file here runs
  after `config.php` has been `require_once`d by the entry-point page (all
  four Standard-tier files call `isAdminIP()` or read `CONFIG`)

### Used by

- Root `index.php`, [Pages (folder)](../pages/___pages.md) — every
  entry-point script assembles its `<html>` shell from a subset of these
  five files, always in the order `head.php` → `loader.php` → `header.php`
  → (page body) → `footer.php`

## Design Decisions

- **`db.php`'s `getDB()`/`initializeTables()` are defined but not yet
  called anywhere in the codebase.** Every page `require_once`s `db.php`
  (so the functions exist), but [Eseji](../pages/eseji/___eseji.md) and
  [Knjige](../pages/knjige/___knjige.md) both still render hardcoded
  placeholder arrays — the SQLite database is never actually opened by a
  live page load today. See [Database](__about/db.md)'s Design Decisions
  and [Open Questions](../OPEN-QUESTIONS.md).
- **`footer.php` assembles THREE script sources in a fixed order**: base
  (`main.js`), then `$libraries` (third-party, e.g. `typed.min`), then
  `$scripts` (page-specific) — libraries must load before page scripts that
  depend on their globals (e.g. `writerSimulator.js` needs `window.Typed`
  from `typed.min.js`).
