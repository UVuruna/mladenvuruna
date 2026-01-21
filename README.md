# Mladen Vuruna - Portfolio Website

Personal portfolio website for **Mladen Vuruna**, a Serbian writer and artist.

**Live Site:** [mladenvuruna.com](https://mladenvuruna.com)

---

## Overview

This website showcases Mladen Vuruna's creative work:

- **Books** - Excerpts from published works with interactive page-flip reading experience
- **Essays** - Collection of written essays and articles
- **Art Gallery** - Visual artwork and paintings
- **Contact** - Visitor comments and messages

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | PHP 8.x |
| Frontend | Vanilla JavaScript, HTML5, CSS3 |
| Database | SQLite |
| Images | WebP (auto-converted from PDF) |
| Hosting | Hostinger |

---

## Features

### Content Display
- Interactive book viewer with page-flip animation
- Lazy-loaded image galleries
- Responsive design (mobile-first)
- Loading screen for smooth UX

### Admin Panel
- IP-gated access (visible only to whitelisted IPs)
- Password-protected admin mode
- Add/edit/delete books, essays, artwork
- PDF upload with automatic WebP conversion

### Analytics
- Visitor tracking (IP, geolocation, pages visited)
- Time spent per page
- Comment tracking
- Privacy-compliant (cookie consent)

### Performance
- WebP images at multiple resolutions
- Lazy loading for images
- Component-based CSS/JS (load only what's needed)
- Target: 90+ PageSpeed score

---

## Project Structure

```
📁 MVuruna/
  📄 index.php              # Homepage
  📄 config.php             # Configuration
  📁 assets/
    📁 css/                 # Stylesheets
    📁 js/                  # JavaScript
    📁 fonts/               # Custom fonts
    📁 img/                 # Static images
  📁 includes/              # PHP includes (header, footer, etc.)
  📁 components/            # Reusable components
  📁 pages/                 # Section pages
  📁 api/                   # Backend endpoints
  📁 data/                  # Database + uploaded content
```

See [CLAUDE.md](CLAUDE.md) for detailed structure.

---

## Local Development

### Prerequisites
- PHP 8.x
- XAMPP (or similar local server)
- ImageMagick/Ghostscript (for PDF conversion)

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

## Deployment

The site auto-deploys to Hostinger via GitHub webhook:

```
git push → GitHub → Hostinger webhook → Auto-deploy
```

**Important:** Never commit `config.php` with real credentials. Use `config.example.php` as template.

---

## Documentation

- [CLAUDE.md](CLAUDE.md) - Development guidelines and rules
- [ROADMAP.md](ROADMAP.md) - Future features and development phases

---

## Author

Website developed for **Mladen Vuruna**

Development: Claude Code + Human collaboration
