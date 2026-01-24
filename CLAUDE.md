# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## PROJECT OVERVIEW

**Mladen Vuruna** - Personal portfolio website for a Serbian writer and artist.

**Live Site:** [mladenvuruna.com](https://mladenvuruna.com)

**Tech Stack:**
- **Backend:** PHP 8.x
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Database:** SQLite
- **Assets:** WebP images (converted from PDF), PDF documents for download

**Key Features:**
- Book excerpts with page-flip animation
- Essays collection
- Art gallery
- Visitor analytics (IP, geolocation, page views, time spent)
- Admin panel (IP-gated + password)
- Contact/comments system

**Key Documentation:**
- [README.md](README.md) - Project overview and setup
- [ROADMAP.md](ROADMAP.md) - Development phases and future ideas

---

## PROJECT STRUCTURE

```
📁 MVuruna/
  📄 index.php                # Homepage
  📄 config.php               # Global configuration (DB, paths, admin IPs)
  📁 assets/
    📁 css/                   # Stylesheets (per component)
    📁 js/                    # JavaScript (per functionality)
    📁 fonts/                 # Custom fonts
    📁 img/                   # Images, icons, logos
  📁 includes/
    📄 header.php             # Global header (all pages)
    📄 footer.php             # Global footer (all pages)
    📄 head.php               # <head> section template
    📄 loader.php             # Loading screen
    📄 db.php                 # Database connection
  📁 components/
    📁 books/                 # Book viewer components
    📁 essays/                # Essay display components
    📁 gallery/               # Art gallery components
    📁 comments/              # Comments/messages system
    📁 admin/                 # Admin panel components
  📁 pages/
    📁 knjige/                # Books section
    📁 eseji/                 # Essays section
    📁 galerija/              # Gallery section
  📁 api/
    📄 analytics.php          # Visitor tracking endpoint
    📄 comments.php           # Comments CRUD
    📄 admin.php              # Admin actions
    📄 upload.php             # PDF upload + conversion
  📁 data/
    📄 mvuruna.db             # SQLite database
    📁 books/                 # Book page images (WebP)
    📁 essays/                # Essay page images (WebP)
    📁 gallery/               # Art images
    📁 pdf/                   # Original PDFs for download
```

---

## MANDATORY WORKFLOW

**CRITICAL:** Follow this workflow for EVERY task.

### Before Starting Work - ASK QUESTIONS

Before writing ANY code or making ANY changes:

1. **Read the task carefully** - Understand what is being asked
2. **Identify ambiguities** - What is unclear? What could be interpreted multiple ways?
3. **Ask questions** - NEVER assume, ALWAYS verify:
   - "Should I modify existing file X or create new one?"
   - "You mentioned Y - did you mean Z or something else?"
   - "I see multiple approaches - which do you prefer?"
4. **Propose approach** - Explain HOW you will solve it
5. **Only after confirmation** → Start work

**Example:**
```
User: "Fix the gallery layout"

❌ WRONG: "I'll refactor the gallery code..." [starts coding immediately]

✅ CORRECT: "Before I start, let me clarify:
   1. What specific issue are you seeing with the layout?
   2. Is this on mobile, desktop, or both?
   3. Should images maintain aspect ratio or fill containers?"
   [waits for answers]
```

---

## DEVELOPMENT RULES

### Rule #1: No Hardcoded Values

**Before hardcoding ANY value, ASK:** "Should this be in config.php?"

```php
// ❌ FORBIDDEN
$db_path = "data/mvuruna.db";
$webp_quality = 75;
$admin_ip = "192.168.1.1";

// ✅ REQUIRED
require_once 'config.php';
$db_path = CONFIG['db_path'];
$webp_quality = CONFIG['webp_quality'];
// Admin IPs checked via isAdminIP() function
```

---

### Rule #2: Component-Based CSS/JS

**Each component has its own CSS and JS file.**

```
❌ FORBIDDEN: One giant style.css with everything
✅ REQUIRED:  css/header.css, css/footer.css, css/book-viewer.css, etc.
```

**Loading:** Only load CSS/JS needed for current page.

```php
// In page file
$styles = ["header", "footer", "book-viewer"];  // Only what's needed
$scripts = ["analytics", "book-flip"];
```

---

### Rule #3: Mobile-First Responsive Design

**Always start with mobile styles, then add desktop.**

```css
/* ✅ REQUIRED - Mobile first */
.book-container {
    width: 100%;
    padding: 1rem;
}

@media (min-width: 768px) {
    .book-container {
        width: 80%;
        padding: 2rem;
    }
}

@media (min-width: 1200px) {
    .book-container {
        width: 60%;
        max-width: 900px;
    }
}
```

---

### Rule #4: Performance Priority

**Speed is critical. Follow these principles:**

1. **Lazy load images** - Use `loading="lazy"` for below-fold images
2. **WebP format** - All images in WebP (70-80% quality)
3. **Loading screen** - Hide layout shifts during initial load
4. **Preload critical** - Preload fonts, above-fold images
5. **Responsive images** - Generate multiple sizes (thumbnail, medium, full)

```html
<!-- ✅ REQUIRED -->
<img src="image.webp" loading="lazy" decoding="async" alt="Description">

<!-- Critical resources -->
<link rel="preload" href="assets/fonts/main.woff2" as="font" crossorigin>
```

**Image sizes to generate:**
| Size | Width | Quality | Use Case |
|------|-------|---------|----------|
| Thumbnail | 400px | 60% | Previews, lists |
| Medium | 800px | 75% | Mobile full view |
| Full | 1200px | 85% | Desktop full view |

---

### Rule #5: SQLite Best Practices

```php
// ✅ REQUIRED - Prepared statements (prevent SQL injection)
$stmt = $db->prepare("SELECT * FROM books WHERE id = ?");
$stmt->execute([$id]);

// ✅ REQUIRED - Transactions for multiple writes
$db->beginTransaction();
try {
    $stmt1->execute();
    $stmt2->execute();
    $db->commit();
} catch (Exception $e) {
    $db->rollBack();
    throw $e;
}

// ❌ FORBIDDEN - Direct interpolation
$db->query("SELECT * FROM books WHERE id = $id");
```

---

### Rule #6: Constructive Disagreement (Obrazloženo Neslaganje)

**Ako znaš da korisnikov predlog nije optimalan, MORAŠ:**

1. **Objasniti ZAŠTO** - sa konkretnim tehničkim razlozima
2. **Predložiti alternativu** - ako postoji bolje rešenje
3. **Tražiti potvrdu** - tek nakon što korisnik razume trade-off

```
❌ ZABRANJENO - slepo prihvatanje
User: "Hajde da učitamo sve slike odjednom"
Claude: "OK, implementiraću to."

✅ OBAVEZNO - obrazloženo neslaganje
User: "Hajde da učitamo sve slike odjednom"
Claude: "Razmotrio sam to, ali vidim problem:
- Učitavanje 50 slika odjednom = 10+ MB initial load
- Korisnici na mobilnom internetu će čekati 5-10 sekundi
- Google PageSpeed će pasti ispod 50

Predlažem: Lazy loading sa placeholder blur.
Da li želiš da objasnim detaljnije?"
```

**Princip:** Bolje je kratkoročno usporiti rad diskusijom nego dugoročno implementirati neefikasno rešenje.

---

### Rule #7: Serbian Conversation

**Communicate with the user in Serbian (Latin script).**

- All conversation with the user should be in Serbian
- Code, comments, documentation files remain in English
- This rule applies only to direct communication, not to file contents

---

### Rule #8: English Code & Documentation

**All code, comments, and documentation in English.**

```php
// ✅ REQUIRED
function getBookPages($bookId) {
    // Fetch all pages for the given book
    return $pages;
}

// ❌ FORBIDDEN
function uzmiStranice($idKnjige) {
    // Uzmi sve stranice za datu knjigu
    return $stranice;
}
```

**Exception:** Rule #6 in CLAUDE.md remains in Serbian (internal developer reference).

---

### Rule #9: Accessibility (a11y)

**All interactive elements must be accessible.**

```html
<!-- ✅ REQUIRED -->
<button aria-label="Sledeća stranica" onclick="nextPage()">
    <img src="arrow.svg" alt="">
</button>

<img src="painting.webp" alt="Opis slike za čitače ekrana">

<!-- ❌ FORBIDDEN -->
<div onclick="nextPage()">→</div>
<img src="painting.webp">
```

---

### Rule #10: Security

**Always sanitize user input.**

```php
// ✅ REQUIRED - For display
echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');

// ✅ REQUIRED - For database
$stmt = $db->prepare("INSERT INTO comments (text) VALUES (?)");
$stmt->execute([$userInput]);

// ❌ FORBIDDEN
echo $userInput;
$db->query("INSERT INTO comments (text) VALUES ('$userInput')");
```

---

### Rule #11: Git Commit Messages

**Commit messages in English, descriptive.**

```
✅ GOOD:
- "Add book page-flip animation component"
- "Fix mobile header overflow issue"
- "Implement visitor analytics tracking"

❌ BAD:
- "fix"
- "update"
- "changes"
```

---

### Rule #12: No External CDN/API - Download Everything Locally

**NIKADA ne koristi eksterne CDN linkove ili API-je za biblioteke, fontove, ili bilo koje resurse.**

**OBAVEZNO:**
1. Preuzmi fajl lokalno u odgovarajući folder:
   - JavaScript biblioteke → `assets/libraries/`
   - Fontovi → `assets/fonts/[font-name]/`
   - CSS biblioteke → `assets/css/lib/`
2. Referenciraj lokalni fajl umesto CDN URL-a

**Ako preuzimanje NIJE moguće** (npr. API koji zahteva ključ, ili real-time servis):
- **PITAJ KORISNIKA** pre implementacije
- Objasni zašto mora biti eksterni poziv

```css
/* ❌ ZABRANJENO */
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script');

/* ✅ OBAVEZNO */
@font-face {
    font-family: 'Dancing Script';
    src: url('../fonts/dancing-script/DancingScript-Regular.woff2') format('woff2');
}
```

```html
<!-- ❌ ZABRANJENO -->
<script src="https://cdn.jsdelivr.net/npm/library@1.0.0/lib.min.js"></script>

<!-- ✅ OBAVEZNO -->
<script src="assets/libraries/library.min.js"></script>
```

**Razlog:** Eksterni CDN-ovi mogu pasti, usporiti stranicu, ili prestati da rade. Lokalni fajlovi garantuju pouzdanost.

---

## ADMIN SYSTEM

**Access Control Flow:**

```
1. Visitor loads page
2. PHP checks visitor IP against CONFIG['admin_ips']
3. IF match → Show "Admin" button in header (hidden for others)
4. Click button → Password modal appears
5. Correct password → Set admin session cookie
6. Admin features enabled (edit, add, delete buttons visible)
```

**Security:**
- Admin IPs stored in `config.php` (gitignored for production)
- Password hashed with `password_hash()`
- Session expires after 24 hours or browser close

---

## ANALYTICS SYSTEM

**Tracked Data:**

| Field | Description |
|-------|-------------|
| `ip_address` | Visitor IP (for geolocation) |
| `country` | Country from IP lookup |
| `city` | City from IP lookup |
| `pages_visited` | Array of page URLs |
| `time_per_page` | Seconds spent on each page |
| `first_visit` | Timestamp of first visit |
| `last_visit` | Timestamp of last visit |
| `comments` | IDs of comments left |

**Implementation:**
- JavaScript sends beacon on page load and unload
- PHP endpoint logs to SQLite
- IP geolocation via free API (ip-api.com or similar)

**Privacy:**
- Display cookie consent banner on first visit
- Store only necessary data

---

## PDF TO WEBP WORKFLOW

**When admin uploads a PDF:**

```
1. Admin selects PDF file
2. PHP receives upload
3. Imagick/Ghostscript converts each page to WebP
4. Three sizes generated per page (thumbnail, medium, full)
5. Original PDF saved in data/pdf/ for download
6. Database updated with:
   - Book/essay title
   - Page count
   - File paths
   - Upload date
```

**Quality settings in config.php:**
```php
CONFIG['image_sizes'] = [
    'thumbnail' => ['width' => 400, 'quality' => 60],
    'medium'    => ['width' => 800, 'quality' => 75],
    'full'      => ['width' => 1200, 'quality' => 85],
];
```

---

## FILE NAMING CONVENTIONS

| Type | Convention | Example |
|------|------------|---------|
| CSS | lowercase-dashes | `book-viewer.css` |
| JS | camelCase | `bookViewer.js` |
| PHP | snake_case | `get_book_pages.php` |
| Images | lowercase-descriptive | `naslov-knjige-001.webp` |
| Database | snake_case | `page_views` |

---

## DATABASE SCHEMA

**Core Tables:**

```sql
-- Books/Essays content
CREATE TABLE content (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL,           -- 'book', 'essay', 'art'
    title TEXT NOT NULL,
    description TEXT,
    page_count INTEGER,
    pdf_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Page images for books/essays
CREATE TABLE pages (
    id INTEGER PRIMARY KEY,
    content_id INTEGER,
    page_number INTEGER,
    thumbnail_path TEXT,
    medium_path TEXT,
    full_path TEXT,
    FOREIGN KEY (content_id) REFERENCES content(id)
);

-- Visitor tracking
CREATE TABLE visitors (
    id INTEGER PRIMARY KEY,
    ip_address TEXT,
    country TEXT,
    city TEXT,
    first_visit DATETIME,
    last_visit DATETIME
);

-- Page views
CREATE TABLE page_views (
    id INTEGER PRIMARY KEY,
    visitor_id INTEGER,
    page_url TEXT,
    time_spent INTEGER,          -- seconds
    visited_at DATETIME,
    FOREIGN KEY (visitor_id) REFERENCES visitors(id)
);

-- Comments
CREATE TABLE comments (
    id INTEGER PRIMARY KEY,
    visitor_id INTEGER,
    content_id INTEGER,          -- NULL if general comment
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES visitors(id),
    FOREIGN KEY (content_id) REFERENCES content(id)
);
```

---

## REMEMBER ALWAYS

1. **ASK questions before work** - Never assume
2. **Performance > Features** - Speed is priority #1
3. **Mobile-first** - Most visitors will be on phones
4. **Component isolation** - CSS/JS per component
5. **Security** - Prepared statements, sanitize output
6. **Accessibility** - Alt texts, aria labels, semantic HTML
7. **Lazy loading** - Images load only when needed
8. **WebP everywhere** - Smaller files, faster loads
9. **When unsure → ASK** - Better 100 questions than 1 bug
