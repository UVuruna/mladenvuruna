# Database

**Script:** [Database (script)](../db.php)

## Purpose

SQLite/PDO access layer: a lazy-singleton connection getter and the schema
(`CREATE TABLE IF NOT EXISTS ...`) for a brand-new database file.

## Connections

### Uses

- Root [Config Example](../../__about/config.example.md) — reads
  `CONFIG['db_path']` for the SQLite file location

### Used by

- None yet — `require_once`d by every entry-point page (`index.php`,
  [Eseji](../../pages/eseji/__about/index.md),
  [Knjige](../../pages/knjige/__about/index.md)) but `getDB()` itself is
  never called; see Design Decisions

## Functions

- `getDB(): PDO` — lazy singleton (`static $db = null`): creates the `data/`
  directory if missing, opens the SQLite file (creating it if absent),
  configures `PDO::ERRMODE_EXCEPTION` + `PDO::FETCH_ASSOC`, enables
  `PRAGMA foreign_keys`, and calls `initializeTables()` exactly once if the
  file did not already exist.
- `initializeTables(PDO $db): void` — one `PDO::exec()` creating five tables
  (`content`, `pages`, `visitors`, `page_views`, `comments`) and their
  indexes, all `CREATE TABLE IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS` —
  safe to call on an existing database.

## Design Decisions

- **Never opens the SQLite file unless `getDB()` is called** — and nothing
  in the current codebase calls it (verified: `grep getDB(` project-wide
  matches only this file's own definition). [Eseji](../../pages/eseji/___eseji.md)
  and [Knjige](../../pages/knjige/___knjige.md) both render hardcoded PHP
  arrays with `// TODO: Replace with database query when ready` comments —
  this file is the data layer those TODOs point at, wired but unused. This
  session never opened `data/mvuruna.db` (it does not exist on disk) or any
  `.db` file, per this session's constraint.
- **Schema is defined once, in one `PDO::exec()` call** — matches THE CONFIG
  SECTION LAW's spirit (one place, whole) even though this file is PHP and
  outside that guard's Python-AST scope.
