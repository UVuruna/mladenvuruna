# Plan: Book Reader In-Place Animation

**Date:** January 2026
**Based on:** [002-book-reader-inplace.md](../brainstorming/002-book-reader-inplace.md)

---

## Overview

Fix the book reader to:
1. Open IN-PLACE (not in fixed overlay)
2. Animate cover centering → move right → flip open
3. Keep the realistic page-flip from StPageFlip

---

## Files to Modify

| File | Changes |
|------|---------|
| `pages/knjige/index.php` | Add `.book-stage` and `.book-wrapper` elements |
| `assets/css/book-reader.css` | Remove fixed overlay, add translateX animation |
| `assets/js/bookReader.js` | Update animation flow, handle centering phases |

---

## Step 1: Update HTML Structure

**File:** `pages/knjige/index.php`

Add wrapper elements around book-container:

```html
<article class="book-entry" id="<?php echo $book['slug']; ?>">
    <!-- NEW: Book stage for centering -->
    <div class="book-stage">
        <!-- NEW: Book wrapper for translateX animation -->
        <div class="book-wrapper">
            <div class="book-container"
                 data-id="<?php echo $book['id']; ?>"
                 data-pages='<?php echo json_encode($book['pages']); ?>'
                 data-front="<?php echo $book['cover_front']; ?>"
                 data-back="<?php echo $book['cover_back']; ?>">

                <div class="book-cover">
                    <img src="<?php echo $book['cover_front']; ?>" alt="...">
                    <span class="book-cover-hint">Klikni za čitanje</span>
                </div>

                <div class="book-flipbook"></div>
            </div>
        </div>
    </div>

    <!-- Controls moved outside stage -->
    <div class="book-controls">
        <button class="btn-prev" aria-label="Prethodna">‹</button>
        <button class="btn-close" aria-label="Zatvori">✕</button>
        <button class="btn-next" aria-label="Sledeća">›</button>
    </div>

    <div class="book-info">...</div>
</article>
```

---

## Step 2: Update CSS

**File:** `assets/css/book-reader.css`

### Remove
- `position: fixed` on `.book-container.is-open`
- Full-screen overlay styles

### Add
```css
/* Stage - centers the book entry */
.book-stage {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 450px;
    padding: var(--spacing-lg) 0;
}

/* Wrapper - handles horizontal animation */
.book-wrapper {
    --page-width: 280px;
    position: relative;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Closed state - centered */
.book-wrapper:not(.is-open) {
    transform: translateX(0);
}

/* Open state - moved right (desktop only) */
@media (min-width: 768px) and (orientation: landscape) {
    .book-wrapper.is-open {
        transform: translateX(calc(var(--page-width) / 2));
    }
}

/* Book container - no more fixed positioning */
.book-container {
    position: relative;
}

/* Controls - positioned relative to book entry */
.book-controls {
    display: none;
    justify-content: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md) 0;
}

.book-entry.is-reading .book-controls {
    display: flex;
}
```

---

## Step 3: Update JavaScript

**File:** `assets/js/bookReader.js`

### Key Changes

1. Store reference to wrapper element
2. Add `--page-width` CSS variable
3. Animate wrapper class on open/close
4. Coordinate timing between translateX and page flip

```javascript
class BookReader {
    constructor(container) {
        this.container = container;
        this.wrapper = container.closest('.book-wrapper');
        this.entry = container.closest('.book-entry');
        // ... rest of init
    }

    open() {
        if (this.isOpen) return;

        const size = this.getSize();
        const isLandscape = window.innerWidth > window.innerHeight;

        // Set CSS variable for page width
        this.wrapper.style.setProperty('--page-width', `${size.width}px`);

        // Build pages
        this.buildPages();

        // Hide cover, show flipbook
        this.cover.style.display = 'none';
        this.flipbookEl.style.display = 'block';

        // Initialize PageFlip
        this.pageFlip = new St.PageFlip(this.flipbookEl, {
            width: size.width,
            height: size.height,
            showCover: true,
            usePortrait: !isLandscape,
            startPage: 0,
            // ... other options
        });

        this.pageFlip.loadFromHTML(this.flipbookEl.querySelectorAll('.page'));

        // Mark as open
        this.isOpen = true;
        this.wrapper.classList.add('is-open');
        this.entry.classList.add('is-reading');

        // Add keyboard listener
        document.addEventListener('keydown', this.handleKeyDown);

        // Wait for translateX animation, then flip to first page
        setTimeout(() => {
            this.pageFlip.flip(1);
        }, 600);
    }

    close() {
        if (!this.isOpen) return;

        // Remove keyboard listener
        document.removeEventListener('keydown', this.handleKeyDown);

        // Flip back to cover
        this.pageFlip.flip(0);

        // Wait for flip, then animate back to center
        setTimeout(() => {
            this.wrapper.classList.remove('is-open');

            // Wait for translateX animation, then clean up
            setTimeout(() => {
                this.pageFlip.destroy();
                this.pageFlip = null;

                this.flipbookEl.style.display = 'none';
                this.flipbookEl.innerHTML = '';
                this.cover.style.display = 'block';

                this.isOpen = false;
                this.entry.classList.remove('is-reading');
            }, 600);
        }, 800);
    }
}
```

---

## Step 4: Responsive Behavior

### Desktop (landscape)
- 2-page spread
- Wrapper moves right by `pageWidth / 2`
- Total visible width = `pageWidth * 2`

### Mobile (portrait)
- 1-page view
- Wrapper stays centered (or minimal movement)
- No translateX animation needed

### Detection
```javascript
const isLandscape = window.innerWidth > window.innerHeight;
```

---

## Animation Timeline

```
OPENING:
0ms      - User clicks cover
0ms      - Cover hides, flipbook shows
0ms      - Wrapper starts translateX animation (600ms)
0ms      - PageFlip initialized at page 0 (cover)
600ms    - translateX complete
600ms    - pageFlip.flip(1) - cover opens

CLOSING:
0ms      - User clicks close
0ms      - pageFlip.flip(0) - flip back to cover (800ms)
800ms    - Wrapper starts translateX back (600ms)
1400ms   - translateX complete
1400ms   - Destroy PageFlip, show cover
```

---

## Testing Checklist

- [ ] Cover displays centered
- [ ] Click cover → wrapper moves right → cover flips open
- [ ] 2-page spread visible (desktop)
- [ ] Page flip works with buttons
- [ ] Keyboard navigation works (arrows, Escape)
- [ ] Close → cover flips closed → wrapper moves back to center
- [ ] Mobile: 1-page view, minimal animation
- [ ] No fixed overlay
- [ ] Multiple books on page work independently

---

## Estimated Changes

| File | Lines Added | Lines Removed |
|------|-------------|---------------|
| index.php | ~10 | ~5 |
| book-reader.css | ~50 | ~30 |
| bookReader.js | ~20 | ~10 |
