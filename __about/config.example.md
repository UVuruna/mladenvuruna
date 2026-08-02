# Config Example

**Script:** [Config Example (script)](../config.example.php)

## Purpose

The tracked template for `config.php` — the site's single configuration
source (Rule #4: no hardcoded values). Defines the `CONFIG` array (db path,
admin IPs, admin password hash, image-conversion sizes, upload paths, site
name/URL, analytics toggle, geolocation API) and three small helper
functions used across the site to gate admin behavior.

`config.php` itself is gitignored (real admin IPs and a real
`password_hash()` output live there) and is excluded from every guard and
doc in this project — see [tests (folder)](../tests/___tests.md)'s
`_guards_common.py` docstring. This file is what a fresh checkout actually
has and what every doc describes; a developer copies it to `config.php` and
fills in real values (see [README](../README.md) → Local Development).

## Connections

### Uses

- Nothing — this is the config root; PHP superglobals only (`$_SERVER`,
  `$_SESSION`)

### Used by

- Every `.php` file in the project, via `require_once ".../config.php"` —
  [Includes (subfolder)](../includes/___includes.md)'s `db.php` reads
  `CONFIG['db_path']`; [Header](../includes/__about/header.md) and
  [Head](../includes/__about/head.md) call `isAdminIP()`; every entry-point
  script `require_once`s this file first, before anything else

## Functions

- `isAdminIP(): bool` — whitelist check against `CONFIG['admin_ips']` using
  `$_SERVER['REMOTE_ADDR']`. Drives the header's Admin button visibility and
  the `window.MV_IS_ADMIN` JS flag (see [Head](../includes/__about/head.md)).
- `isAdminLoggedIn(): bool` — session-flag check
  (`$_SESSION['admin_logged_in']`). Not yet called anywhere in the current
  codebase — the admin login POST endpoint (`api/admin.php`) that would set
  this flag does not exist yet (see [Open Questions](../OPEN-QUESTIONS.md)).
- `verifyAdminPassword(string $password): bool` — `password_verify()`
  against `CONFIG['admin_password_hash']`. Same status: defined, not yet
  called by any existing endpoint.

## Design Decisions

- **Session start and timezone are side effects of loading this file** —
  `session_start()` (guarded by `session_status()`) and
  `date_default_timezone_set('Europe/Belgrade')` run unconditionally at the
  bottom of the file, so every page that `require_once`s config gets a PHP
  session and the correct timezone for free, without repeating this
  boilerplate per entry point.
