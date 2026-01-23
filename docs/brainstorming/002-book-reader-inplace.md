# Book Reader - In-Place Animation Research

**Date:** January 2026
**Status:** IMPLEMENTED (v3)

---

## Problem Statement

Current implementation has issues:
1. Book opens in a **fixed overlay/panel** instead of in-place
2. Front cover is not centered before opening
3. Missing **centering phase** animation

What we want:
1. Book opens **in-place** where the cover is
2. **Phase 1**: Closed cover is CENTERED
3. **Phase 2**: Cover moves RIGHT (so left edge = center, this becomes the spine)
4. **Phase 3**: Cover flips OPEN to the left
5. **Result**: 2-page spread with spine at original center position

---

## Root Cause

The problem was **MY CSS**, not the library!

```css
/* THIS WAS WRONG - creates overlay */
.book-container.is-open {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.85);
}
```

StPageFlip renders **in-place by default** - it doesn't use modal/overlay. The library creates its canvas/HTML inside the parent element you give it.

---

## Solution Architecture

### HTML Structure

```html
<article class="book-entry">
    <!-- Stage centers everything -->
    <div class="book-stage">
        <!-- Wrapper handles the translateX animation -->
        <div class="book-wrapper closed">
            <!-- Cover (before opening) -->
            <div class="book-cover">
                <img src="cover-front.webp" alt="Title">
            </div>
            <!-- StPageFlip container (hidden until open) -->
            <div class="book-flipbook"></div>
        </div>
    </div>

    <!-- Controls (outside stage) -->
    <div class="book-controls">...</div>

    <!-- Book info -->
    <div class="book-info">...</div>
</article>
```

### CSS Animation Phases

```css
/* Stage - centers the book */
.book-stage {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 500px;
    overflow: visible;
}

/* Wrapper - handles horizontal movement */
.book-wrapper {
    position: relative;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* CLOSED: Centered (default) */
.book-wrapper.closed {
    transform: translateX(0);
}

/* OPEN: Moved right so spine (left edge) is at center */
.book-wrapper.open {
    /* Move right by half of page width */
    transform: translateX(var(--page-width-half));
}
```

### JavaScript Flow

```javascript
class BookReader {
    open() {
        // 1. Calculate page size
        const size = this.getSize();

        // 2. Set CSS variable for half page width
        this.wrapper.style.setProperty('--page-width-half', `${size.width / 2}px`);

        // 3. Build pages in flipbook container
        this.buildPages();

        // 4. Initialize StPageFlip
        this.pageFlip = new St.PageFlip(this.flipbookEl, {...});
        this.pageFlip.loadFromHTML(pages);

        // 5. Hide cover, show flipbook
        this.cover.style.display = 'none';
        this.flipbookEl.style.display = 'block';

        // 6. Trigger centering animation (PHASE 2)
        this.wrapper.classList.remove('closed');
        this.wrapper.classList.add('open');

        // 7. After transition, flip to first content page (PHASE 3)
        setTimeout(() => {
            this.pageFlip.flip(1);
        }, 600); // Wait for translateX transition
    }

    close() {
        // 1. Flip back to cover
        this.pageFlip.flip(0);

        // 2. Wait for flip, then animate back to center
        setTimeout(() => {
            this.wrapper.classList.remove('open');
            this.wrapper.classList.add('closed');

            // 3. After centering, clean up
            setTimeout(() => {
                this.pageFlip.destroy();
                this.flipbookEl.style.display = 'none';
                this.cover.style.display = 'block';
            }, 600);
        }, 800);
    }
}
```

---

## StPageFlip Key Options

```javascript
new St.PageFlip(container, {
    width: 300,              // Single page width
    height: 450,             // Page height
    size: 'fixed',           // or 'stretch'
    showCover: true,         // First/last pages as hard cover
    usePortrait: !isLandscape, // 1-page mobile, 2-page desktop
    startPage: 0,            // Start on cover
    drawShadow: true,
    flippingTime: 800,
    maxShadowOpacity: 0.5
});
```

### Critical: `showCover: true`
- First page displays as single (cover)
- After flip, shows 2-page spread
- Last page displays as single (back cover)

---

## Event-Based State Management

```javascript
pageFlip.on('flip', (e) => {
    const currentPage = e.data;
    const totalPages = pageFlip.getPageCount();

    // On cover or back cover = closed/centered state
    if (currentPage === 0 || currentPage >= totalPages - 1) {
        wrapper.classList.add('closed');
        wrapper.classList.remove('open');
    } else {
        wrapper.classList.add('open');
        wrapper.classList.remove('closed');
    }
});
```

---

## Mobile vs Desktop

### Desktop (width > height)
- `usePortrait: false`
- 2-page spread when open
- Wrapper moves right by `pageWidth / 2`

### Mobile (height > width)
- `usePortrait: true`
- 1-page view always
- Wrapper stays centered (no translateX needed)
- Or small translateX for visual effect

---

## Library Comparison

| Feature | StPageFlip | Turn.js | CSS-only |
|---------|------------|---------|----------|
| In-place rendering | YES (default) | YES | YES |
| Cover mode | `showCover: true` | `.hard` class | Manual |
| Auto portrait/landscape | `usePortrait` | Manual | Manual |
| Touch/swipe | Built-in | Basic | Manual |
| Canvas shadows | YES | NO | NO |
| jQuery required | NO | YES | NO |
| License | MIT | Commercial | - |

**Decision: Keep StPageFlip** - just fix the CSS!

---

## References

- [StPageFlip GitHub](https://github.com/Nodlik/StPageFlip)
- [StPageFlip Demo](https://nodlik.github.io/StPageFlip/)
- [Codrops CSS 3D Books](https://tympanus.net/codrops/2013/07/11/animated-books-with-css-3d-transforms/)
- [CSS Book Effects](https://freefrontend.com/css-book-effects/)
- [Turn.js autoCenter](http://www.turnjs.com/docs/Option:_autoCenter)
