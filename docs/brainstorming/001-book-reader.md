# Book Reader - Brainstorming

**Date:** January 2026
**Feature:** Interactive Book Reader for Books Page
**Status:** Planning Complete

---

## Overview

Creating an interactive book reader component for the `/knjige` (books) page. Users can browse books and read excerpts with realistic page-flip animations.

---

## Key Decisions

### Page Structure
- **Single page approach** (`pages/knjige/index.php`)
- All books listed on one page, scrollable
- Anchor links for direct navigation to specific books (`#book-name`)
- URL updates with `history.pushState` for shareability

### Reading Mode
- **In-line reading** (NOT overlay/modal)
- Books open in place when clicked
- Multiple books can be open simultaneously
- User can scroll away and come back to an open book

### Layout Per Book
```
┌─────────────────────────────────┐
│     [Book Cover / Reader]       │  ← 3D animated book
├─────────────────────────────────┤
│     Book Title                  │
│     Description text...         │
│     Review/excerpt text...      │
│     [Buy Link 1] [Buy Link 2]   │  ← External links to publishers
└─────────────────────────────────┘
```

---

## Animation Specifications

Reference: `assets/img/material/BookReader.png`

### Device Detection
- **Desktop:** `width > height` → 2-page view
- **Mobile/Tablet:** `height > width` → 1-page view

### Opening Book (Click on Cover)

**Desktop:**
1. Front Cover visible (3D book with thickness)
2. Animation: Cover opens to the right
3. Transitions to 2-page view (left page + right page)
4. First content pages visible

**Mobile/Tablet:**
1. Front Cover visible
2. Animation: Cover flips to reveal first page
3. Single page view
4. "Fake" simulation (each page is independent)

### Turning Pages

**Desktop:**
- Flip both visible pages together
- Pages 2+3 flip → reveals 4+5
- Real book simulation (pages have front/back)

**Mobile/Tablet:**
- Flip one page at a time
- Fake simulation (new content each flip)
- Simpler but still animated

### Closing Book

**Desktop:**
1. From 2-page view
2. Transition to 1-page view
3. Page becomes cover
4. Back to Front Cover or Back Cover

**Mobile/Tablet:**
1. Last page flips
2. Back Cover appears
3. Or shortcut button returns to Front Cover

### Aspect Ratio
- Book maintains proportions
- Does NOT scale to screen edges
- Adds padding/margins on sides if needed
- Consistent ratio across all screen sizes

---

## User Interactions

### Opening
- **Click** on book cover to open

### Navigation (when book is open)
- **Click** left/right edges of book
- **Keyboard** arrow keys (only when book is 80%+ visible)
- **Swipe/Drag** on touch devices
- **Mouse drag** on desktop

### Closing
- **Shortcut button** to return to Front Cover instantly
- **Navigate backward** through pages to Front Cover
- Both options available

---

## Sections

### Published Books
- Main section
- Full functionality (cover, pages, description, buy links)

### Works in Progress ("Radovi u Toku")
- Separate section with visual distinction
- Different background or border
- Subtitle explaining the section
- Same functionality as published books
- May have fewer pages or "coming soon" content

---

## Technical Notes

### Files to Create
- `pages/knjige/index.php` - Main books page
- `assets/css/books.css` - Books page styles
- `assets/css/book-reader.css` - Reader component styles
- `assets/js/bookReader.js` - Animation and interaction logic

### Performance Considerations
- Lazy load book page images
- Only animate books in viewport
- Preload adjacent pages when reading
- WebP format for all images

### Accessibility
- Keyboard navigation support
- ARIA labels for reader controls
- Alt text for book covers and pages
- Focus management when opening/closing

---

## Open Questions (Resolved)

1. ~~Single page vs multiple pages?~~ → Single page
2. ~~Overlay vs in-line?~~ → In-line
3. ~~Auto-open on scroll vs click?~~ → Click to open
4. ~~How to close?~~ → Button + navigate back
5. ~~Buy links placement?~~ → Below description, always visible
