# Book Reader - Implementation Plan

**Date:** January 2026
**Feature:** Interactive Book Reader for Books Page
**Estimated Complexity:** High (animations, responsive, interactions)

---

## Phase 1: Page Structure & Layout

### 1.1 Create Books Page
**File:** `pages/knjige/index.php`

```php
// Structure:
// - Include header
// - Published Books section
// - Works in Progress section
// - Include footer
```

### 1.2 Basic Styles
**File:** `assets/css/books.css`

- Page layout (sections, spacing)
- Book card layout (cover above, text below)
- "Works in Progress" section distinction
- Mobile-first responsive design

### 1.3 Placeholder Content
- 2-3 placeholder books with generic data
- Placeholder cover images
- Generic descriptions and buy links

---

## Phase 2: 3D Book Cover (Static)

### 2.1 Book Cover Component
**Files:** `assets/css/book-reader.css`

CSS 3D transforms for book appearance:
```css
.book {
    perspective: 1500px;
    transform-style: preserve-3d;
}

.book-cover {
    /* 3D book with visible thickness */
    /* Shadow for depth */
    /* Hover effect (slight tilt?) */
}
```

### 2.2 Cover States
- Closed (default) - 3D book standing
- Hover - subtle interaction feedback
- Open - transitions to reader view

---

## Phase 3: Book Reader - Desktop (2-Page View)

### 3.1 Reader Container
```html
<div class="book-reader" data-view="double">
    <div class="book-spine"></div>
    <div class="page-left">...</div>
    <div class="page-right">...</div>
    <div class="page-turning">...</div>  <!-- For animation -->
</div>
```

### 3.2 Opening Animation
**Sequence:**
1. Cover starts at front
2. CSS animation: rotateY(-180deg) on cover
3. Reveal 2-page spread
4. Add "imaginary pages" for thickness effect

### 3.3 Page Turn Animation
**File:** `assets/js/bookReader.js`

```javascript
// Desktop page turn:
// 1. Current spread (pages 2-3) starts flat
// 2. Both pages lift and rotate together
// 3. Reveal next spread (pages 4-5)
// 4. Animation duration: ~600ms
```

### 3.4 Closing Animation
- Reverse of opening
- 2-page → 1-page → cover

---

## Phase 4: Book Reader - Mobile (1-Page View)

### 4.1 Single Page Container
```html
<div class="book-reader" data-view="single">
    <div class="page-current">...</div>
    <div class="page-next">...</div>  <!-- For animation -->
</div>
```

### 4.2 Page Turn Animation
- Single page flip
- "Fake" simulation (content changes each flip)
- Simpler transform than desktop

### 4.3 Device Detection
```javascript
function getViewMode() {
    return window.innerWidth > window.innerHeight ? 'double' : 'single';
}

// Re-check on resize/orientation change
```

---

## Phase 5: User Interactions

### 5.1 Click to Open
```javascript
bookCover.addEventListener('click', () => {
    openBook(bookId);
});
```

### 5.2 Page Navigation
```javascript
// Click zones
pageLeft.addEventListener('click', prevPage);
pageRight.addEventListener('click', nextPage);

// Keyboard (when 80%+ visible)
document.addEventListener('keydown', (e) => {
    if (isBookVisible(book, 0.8)) {
        if (e.key === 'ArrowLeft') prevPage();
        if (e.key === 'ArrowRight') nextPage();
    }
});

// Touch/Swipe
// Implement touch start/move/end
// Calculate swipe direction and distance
// Trigger page turn if threshold met

// Mouse drag
// Similar to touch but with mousedown/move/up
```

### 5.3 Close/Reset Button
```html
<button class="book-close" aria-label="Close book">
    <!-- Icon: return to cover -->
</button>
```

---

## Phase 6: Responsive Behavior

### 6.1 Breakpoint Strategy
```css
/* Mobile first - single page default */
.book-reader { /* single page styles */ }

/* Desktop - when width > height */
@media (orientation: landscape) and (min-width: 768px) {
    .book-reader { /* double page styles */ }
}
```

### 6.2 Orientation Change
```javascript
window.addEventListener('resize', debounce(() => {
    updateAllBookReaders();
}, 250));
```

### 6.3 Aspect Ratio Preservation
- Book maintains proportions
- Max-width constraints
- Centered with flexible margins

---

## Phase 7: Works in Progress Section

### 7.1 Visual Distinction
```css
.works-in-progress {
    background: /* different shade */;
    border-top: /* separator */;
    padding: /* extra spacing */;
}

.works-in-progress .section-header {
    /* "Radovi u Toku" title */
    /* Subtitle explaining section */
}
```

### 7.2 Same Functionality
- Uses same book-reader component
- May have "Coming Soon" pages
- Same animations and interactions

---

## File Structure Summary

```
📁 pages/
  📁 knjige/
    📄 index.php              # Books listing page

📁 assets/
  📁 css/
    📄 books.css              # Page layout, sections
    📄 book-reader.css        # 3D book, animations
  📁 js/
    📄 bookReader.js          # All reader logic

📁 data/
  📁 books/
    📁 placeholder-book-1/    # Placeholder images
      📄 cover.webp
      📄 page-001.webp
      📄 page-002.webp
      ...
```

---

## Implementation Order

1. [ ] Create `pages/knjige/index.php` with basic structure
2. [ ] Create `assets/css/books.css` with layout styles
3. [ ] Add placeholder book data (hardcoded)
4. [ ] Create 3D book cover (CSS only, no animation yet)
5. [ ] Create `assets/css/book-reader.css`
6. [ ] Implement opening animation (desktop)
7. [ ] Implement opening animation (mobile)
8. [ ] Create `assets/js/bookReader.js`
9. [ ] Implement page turn (desktop - 2 page)
10. [ ] Implement page turn (mobile - 1 page)
11. [ ] Add click navigation
12. [ ] Add keyboard navigation
13. [ ] Add touch/swipe navigation
14. [ ] Add mouse drag navigation
15. [ ] Add close/reset button
16. [ ] Style "Works in Progress" section
17. [ ] Test all interactions
18. [ ] Performance optimization
19. [ ] Accessibility audit

---

## Dependencies

- Existing: `includes/header.php`, `includes/footer.php`
- Existing: `config.php` for any configuration
- New: Placeholder images for testing

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Complex animations may be janky | Use CSS transforms (GPU accelerated), test on low-end devices |
| Touch gestures conflict with scroll | Careful event handling, prevent default only when intended |
| Orientation change mid-read | Save current page, rebuild reader, restore position |
| Many books = performance issues | Only animate visible books, lazy load images |

---

## Success Criteria

- [ ] Books page loads with all sections
- [ ] 3D book covers display correctly
- [ ] Click opens book with smooth animation
- [ ] Desktop shows 2-page view, mobile shows 1-page
- [ ] All navigation methods work (click, keyboard, touch, drag)
- [ ] Close button returns to cover
- [ ] Works in Progress section visually distinct
- [ ] No layout shifts or jank
- [ ] Accessible (keyboard, screen reader friendly)
