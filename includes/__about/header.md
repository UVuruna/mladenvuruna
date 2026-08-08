# Header

**Script:** [Header (script)](../header.php)

## Purpose

<!-- lang-ok: quoting the actual Serbian nav labels the header renders -->
Site header: logo, mobile hamburger toggle, main nav (Početna/Knjige/Eseji/
Galerija/Kontakt), the day/night theme-switch control, and — only for
whitelisted admin IPs — the Admin button and its password modal.

## Connections

### Uses

- Root [Config Example](../../__about/config.example.md) — `isAdminIP()`
  gates both the Admin button and the modal's existence in the DOM
- `$basePath`, `$currentPage` — variables the including page script sets;
  `$currentPage` drives the `.active` nav-link class

### Used by

- Root `index.php`, [Eseji](../../pages/eseji/__about/index.md),
  [Knjige](../../pages/knjige/__about/index.md) — every entry-point page
  includes this right after the loading screen
- `assets/js/main.js` — `initMobileMenu()`/`initAdminModal()` attach to the
  `#menu-toggle`, `#main-nav`, `#admin-toggle`, `#admin-modal` elements this
  file renders
- `assets/js/themeSwitch.js` — attaches to `#theme-switch-input`

## Design Decisions

- **The admin modal's form posts to `api/admin.php`, which does not exist
  yet** — `api/` is an empty directory on disk (matches
  [ROADMAP.md](../../ROADMAP.md) Phase 4, unchecked). The button, IP gate
  and modal markup are live; the backend login endpoint is not. Flagged in
  [Open Questions](../../OPEN-QUESTIONS.md), not fixed.
- **Nav links to `pages/galerija/`** even though no `pages/galerija/`
  folder exists yet (only `eseji/` and `knjige/` are built) — a 404 for any
  visitor who clicks "Galerija" today. Matches
  [ROADMAP.md](../../ROADMAP.md) Phase 2 (Gallery Section, unchecked).
  Flagged in [Open Questions](../../OPEN-QUESTIONS.md).
