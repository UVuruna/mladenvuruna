# ROADMAP

Development phases and feature ideas for mladenvuruna.com

---

## Phase 1: Foundation (Current)

**Goal:** Basic site structure with all core pages working.

### Tasks
- [ ] Project setup (config, database, folder structure)
- [ ] Base components (header, footer, loader)
- [ ] Homepage with sections overview
- [ ] Basic styling and responsive layout
- [ ] SQLite database schema
- [ ] Git + Hostinger auto-deploy

### Deliverables
- Working homepage at mladenvuruna.com
- Navigation between sections
- Mobile-responsive design
- Loading screen

---

## Phase 2: Content Sections

**Goal:** All content sections functional with basic display.

### Books Section
- [ ] Book listing page (grid of book covers)
- [ ] Individual book page
- [ ] Basic page viewer (image slideshow)
- [ ] PDF download button

### Essays Section
- [ ] Essay listing page
- [ ] Individual essay page
- [ ] Basic page viewer
- [ ] PDF download button

### Gallery Section
- [ ] Image grid with lightbox
- [ ] Category filtering (if needed)
- [ ] Image zoom/pan

### Deliverables
- All three content sections working
- Basic navigation between items
- PDF download functionality

---

## Phase 3: Interactive Book Viewer

**Goal:** Premium reading experience with book-flip animation.

### Book Flip Animation Concept

When user scrolls to a book, it appears as a **3D book cover**. On hover/click:

```
1. Book cover animates open (3D CSS transform)
2. First page revealed (excerpt start)
3. User can flip pages with:
   - Arrow keys (←/→)
   - Mouse click on page edges
   - Swipe gestures (mobile)
4. Each page flip has realistic animation:
   - Page curves during flip
   - Shadow changes
   - Paper texture visible
```

### Technical Implementation

**CSS 3D Transforms:**
```css
.book {
    perspective: 1500px;
    transform-style: preserve-3d;
}

.page {
    transform-origin: left center;
    transition: transform 0.6s ease-in-out;
}

.page.flipping {
    transform: rotateY(-180deg);
}
```

**Page Structure:**
```html
<div class="book">
    <div class="page front-cover">...</div>
    <div class="page" data-page="1">
        <div class="page-front">Content side 1</div>
        <div class="page-back">Content side 2</div>
    </div>
    <!-- More pages -->
</div>
```

### Features
- [ ] 3D book cover display
- [ ] Open/close animation
- [ ] Page flip with CSS 3D transforms
- [ ] Keyboard navigation (arrows)
- [ ] Click navigation (page edges)
- [ ] Touch/swipe for mobile
- [ ] Page curl effect during flip
- [ ] Shadow dynamics
- [ ] Progress indicator (page X of Y)
- [ ] Fullscreen mode

### Libraries to Consider
- **Turn.js** - jQuery page flip (may be overkill)
- **Custom CSS/JS** - Lighter, more control (preferred)

---

## Phase 4: Admin Panel

**Goal:** Mladen can manage content without developer help.

### Access Flow
```
1. Page loads
2. PHP checks: Is visitor IP in admin whitelist?
3. YES → Show "Admin" button in header (invisible to others)
4. Click → Password modal
5. Correct password → Admin session starts
6. Edit/Add/Delete buttons appear on content
```

### Admin Features
- [ ] IP whitelist check
- [ ] Password modal
- [ ] Session management (24h expiry)
- [ ] Add new book/essay/artwork
- [ ] Edit existing content
- [ ] Delete content (with confirmation)
- [ ] PDF upload with auto-conversion
- [ ] Reorder content (drag & drop?)

### PDF Upload Flow
```
1. Admin clicks "Add Book"
2. Form: Title, Description, PDF file
3. Upload starts → Progress bar
4. Server receives PDF
5. ImageMagick converts each page to WebP:
   - 400px thumbnail (60% quality)
   - 800px medium (75% quality)
   - 1200px full (85% quality)
6. Original PDF saved for download
7. Database updated
8. Admin redirected to new book page
```

---

## Phase 5: Analytics & Comments

**Goal:** Track visitors and allow interaction.

### Visitor Analytics
- [ ] Track IP address
- [ ] Geolocation lookup (country, city)
- [ ] Pages visited
- [ ] Time spent per page
- [ ] Returning visitor detection
- [ ] Admin dashboard to view stats

### Comments System
- [ ] Comment form on each content page
- [ ] Optional: General contact form
- [ ] Store with visitor_id link
- [ ] Admin can view/delete comments
- [ ] No login required (anonymous)
- [ ] Basic spam protection (honeypot field)

### Privacy
- [ ] Cookie consent banner
- [ ] Privacy policy page
- [ ] Data stored only in SQLite (no third parties)

---

## Phase 6: Polish & Performance

**Goal:** 90+ PageSpeed score, smooth experience.

### Performance
- [ ] Audit with Lighthouse
- [ ] Optimize images (already WebP)
- [ ] Minify CSS/JS for production
- [ ] Enable gzip compression
- [ ] Browser caching headers
- [ ] Critical CSS inline
- [ ] Defer non-critical JS

### UX Polish
- [ ] Smooth scroll between sections
- [ ] Micro-animations (hover effects)
- [ ] Loading states for async content
- [ ] Error handling (friendly messages)
- [ ] 404 page design

### SEO
- [ ] Meta tags (title, description, OG)
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Structured data (Schema.org)

---

## Future Ideas (Backlog)

Ideas to consider for future development:

### Content
- [ ] Audio narration for book excerpts
- [ ] Video content section
- [ ] Blog/news section

### Interactivity
- [ ] Dark/light theme toggle
- [ ] Font size adjustment
- [ ] Reading progress save (localStorage)
- [ ] Share buttons (social media)

### Technical
- [ ] PWA (Progressive Web App) - offline reading
- [ ] Email notifications for new content
- [ ] RSS feed for essays

---

## Notes

### Book Animation Reference

The book should feel like a real physical book:

1. **Closed state:** 3D book standing or lying flat
2. **Opening:** Cover rotates, revealing first page
3. **Reading:** Pages flip with realistic curve
4. **Navigation:**
   - Click right edge → next page
   - Click left edge → previous page
   - Keyboard arrows work too
   - Swipe on mobile

**Visual details:**
- Paper texture on pages
- Subtle shadow under lifted page
- Page edge visible when book is closed
- Bookmark ribbon (optional)

### Performance Targets

| Metric | Target |
|--------|--------|
| PageSpeed (Mobile) | 90+ |
| PageSpeed (Desktop) | 95+ |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3s |

---

*Last updated: January 2026*
