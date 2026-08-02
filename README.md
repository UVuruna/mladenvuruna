# Mladen Vuruna - Portfolio Website

Personal portfolio website for **Mladen Vuruna**, a Serbian writer and artist.

**Live Site:** [mladenvuruna.com](https://mladenvuruna.com)

**Status:** early-phase — live in production, but book/essay content is
still hardcoded placeholder data and several features described below are
built as UI-only scaffolding with no backend yet. See
[ROADMAP.md](ROADMAP.md) for what's live vs. planned, and
[Open Questions](OPEN-QUESTIONS.md) for specific observed gaps.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Documentation](#documentation)
- [Local Development](#local-development)
- [Deployment](#deployment)

<a id="features"></a>

## Features

### Content Display — live
- Interactive book viewer with realistic page-flip animation (StPageFlip)
- Essay writing animation: typewriter mode and handwriting/quill mode
- Loading screen, responsive mobile-first design, day/night theming with
  real sunrise/sunset calculation

### Content Display — planned
- Art gallery (`pages/galerija/` does not exist yet)
- Database-backed book/essay content (currently hardcoded placeholder
  arrays — see [Pages (folder)](pages/___pages.md))

### Admin Panel — UI scaffolding only, no backend yet
- IP whitelist gate and password modal exist and render correctly
- The login/content-management endpoints they POST to (`api/admin.php`)
  do not exist — see [Open Questions](OPEN-QUESTIONS.md)

### Analytics & Comments — not built yet
- The contact form's endpoint (`api/comments.php`) does not exist
- No visitor-tracking code exists anywhere in the project (`api/` is an
  empty directory) — see [Open Questions](OPEN-QUESTIONS.md)

### Performance
- WebP images at multiple resolutions (planned pipeline; current
  placeholder images are JPG)
- Lazy loading for images, component-based CSS/JS (load only what's needed)

---

<a id="tech-stack"></a>

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | PHP 8.x |
| Frontend | Vanilla JavaScript, HTML5, CSS3 |
| Database | SQLite (schema defined, not yet populated or queried — see [Database](includes/__about/db.md)) |
| Images | WebP (planned; PDF-to-WebP conversion pipeline not built yet) |
| Hosting | Hostinger |

---

<a id="documentation"></a>

## Documentation

This project follows the monorepo's MD-First 2.0 convention (root
`CLAUDE.md` -> `rules/DOCS.md`): every code folder has its own
`___folder.md` entry point, linking down to `__about/` (what a file does)
and `__flow/` (how — for the handful of files whose logic a diagram
genuinely clarifies).

Root-level loose files (`index.php`, `config.example.php` — no package of
their own):

| File | Tier | One line |
|------|------|----------|
| `index.php` | Trivial | homepage assembly (config + shared includes + static preview sections) |
| `config.example.php` | Standard | the site's `CONFIG` array + admin-check helpers — [about](__about/config.example.md) |

Folders:

| Folder | Role |
|--------|------|
| [includes (folder)](includes/___includes.md) | Shared page-shell partials: database access, `<head>`, header/nav, footer/contact, loading screen |
| [pages (folder)](pages/___pages.md) | Route entry points: `/pages/eseji/`, `/pages/knjige/` |
| [components (folder)](components/___components.md) | Reusable content partials (only `essays/` is populated) |
| [config (folder)](config/___config.md) | Runtime JSON config fetched by client-side JS |
| [assets (folder)](assets/___assets.md) | CSS, JS, fonts, images, vendored libraries |
| [tests (folder)](tests/___tests.md) | The four guard tests (THE STRUCTURE LAW, THE CONFIG SECTION LAW, docs coverage, doc links) |

Other project docs: [AI Guidance](CLAUDE.md) · [Roadmap](ROADMAP.md) ·
[Open Questions](OPEN-QUESTIONS.md)

---

<a id="local-development"></a>

## Local Development

### Prerequisites
- PHP 8.x
- XAMPP (or similar local server)
- ImageMagick/Ghostscript (for the planned PDF conversion pipeline)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/UVuruna/mladenvuruna.git
   ```

2. **Create symlink in XAMPP htdocs**
   ```cmd
   mklink /D "U:\xampp\htdocs\mvuruna" "path\to\mladenvuruna"
   ```

3. **Copy config template**
   ```bash
   cp config.example.php config.php
   ```

4. **Edit config.php**
   - Set admin IPs
   - Set admin password hash
   - Configure paths

5. **Access locally**
   ```
   http://localhost/mvuruna
   ```

---

<a id="deployment"></a>

## Deployment

The site auto-deploys to Hostinger via GitHub webhook:

```
git push → GitHub → Hostinger webhook → Auto-deploy
```

**Important:** Never commit `config.php` with real credentials. Use `config.example.php` as template.

---

## Author

Website developed for **Mladen Vuruna**

Development: Claude Code + Human collaboration
