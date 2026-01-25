# Writer Simulator Fixes - Brainstorming

**Date:** January 2026
**Status:** BRAINSTORMING
**Related:** [003-writer-simulator.md](003-writer-simulator.md)

---

## Problem Summary

Current Writer Simulator implementation has several UX and visual issues that need to be addressed:

1. **Font size mismatch** - Text during animation is larger than final text
2. **Pen position** - Pen goes off-screen, should always be at bottom of paper
3. **Skip button overlap** - Text can cover the skip button
4. **Page scroll during animation** - User can scroll away from animation
5. **Animation trigger** - Starts before essay is fully visible
6. **X-axis overflow** - Pen causes horizontal scroll

---

## Issue #1: Font Size Mismatch

### Current Behavior
- During handwriting animation: `font-size: calc(var(--font-size-lg) * 1.3)` (larger)
- After animation completes: Different size causes jarring "snap" effect
- Parchment/paper dimensions change when text size changes

### Root Cause
The Typed.js wrapper during animation uses different styling than the final paragraph formatting after `parseMarkdown()` is applied.

### Proposed Solution
Use identical styling for animation and final state:
- Same font-family
- Same font-size
- Same line-height
- Typed.js wrapper must match final paragraph styles

---

## Issue #2: Pen Position & Visibility

### Current Behavior
- Pen follows cursor position (last character typed)
- As text wraps to new lines, pen moves down with cursor
- Pen can go below viewport, user loses sight of it
- Skip button may be covered by text

### User Request
- Pen stays at BOTTOM of paper
- Text appears at pen position and "pushes up" as more text is written
- Paper grows upward as content increases
- Skip button always visible below pen

### Proposed Architecture: "Growing Paper" Style

```
Start:                      During writing:              More text:
┌─────────────┐             ┌─────────────┐             ┌─────────────┐
│   Title     │             │   Title     │             │   Title     │
│             │             │             │             │ Previous    │
│             │             │ First line  │             │ text goes   │
│  🪶         │             │ of text...  │             │ up here...  │
│ [Preskoči]  │             │  🪶         │             │ New line 🪶 │
└─────────────┘             │ [Preskoči]  │             │ [Preskoči]  │
                            └─────────────┘             └─────────────┘
                                  ↑                           ↑
                            Paper grows              Paper continues
                            as text added            growing upward
```

### Implementation Approach

1. **Pen fixed at bottom of paper**
   - `position: absolute; bottom: [skip-button-height + padding]`
   - Pen position is STATIC relative to paper bottom

2. **Text writes at pen position**
   - New text appears where pen is
   - As text wraps/grows, it pushes existing text UP
   - Paper container grows naturally with content

3. **Auto-scroll page to keep pen visible**
   - As paper grows, page scrolls down
   - Pen (bottom of paper) stays in viewport
   - User always sees pen writing

4. **Skip button below pen**
   - Fixed position at very bottom of paper
   - Never overlapped by content or pen

### Key CSS Changes

```css
.essay-paper {
    position: relative;
    display: flex;
    flex-direction: column;
    /* NO fixed height - grows with content */
}

.essay-content {
    /* Content grows upward */
    display: flex;
    flex-direction: column;
}

.essay-pen {
    position: absolute;
    bottom: calc(var(--skip-button-height) + var(--spacing-md));
    /* Horizontal position still tracks cursor X */
}

.essay-skip {
    position: relative;  /* At bottom of paper flow */
    margin-top: var(--spacing-md);
    align-self: flex-end;
}
```

### Key JS Changes

```javascript
// Pen tracking - Y is fixed at bottom, X follows cursor
updatePen() {
    const cursorPos = this.getCursorPosition();
    const paperRect = this.paper.getBoundingClientRect();

    // X follows cursor (clamped to paper width)
    const penX = Math.min(cursorPos.x, paperRect.width - this.pen.offsetWidth);
    this.pen.style.left = `${penX}px`;

    // Y is FIXED at bottom (CSS handles this)
    // No need to update Y position

    // Auto-scroll page to keep pen in viewport
    this.scrollPenIntoView();
}

scrollPenIntoView() {
    const penRect = this.pen.getBoundingClientRect();
    const viewportBottom = window.innerHeight;

    if (penRect.bottom > viewportBottom - 50) {
        window.scrollBy({ top: 50, behavior: 'smooth' });
    }
}
```

---

## Issue #3: Disable Page Scroll During Animation

### Current Behavior
- User can scroll page while animation is running
- Can scroll away from animation
- May accidentally trigger other animations

### Proposed Solution
Disable manual scroll but allow programmatic scroll (for auto-scroll to pen):

```javascript
// When animation starts
start() {
    // Disable wheel and touch scroll
    this.scrollHandler = (e) => e.preventDefault();
    window.addEventListener('wheel', this.scrollHandler, { passive: false });
    window.addEventListener('touchmove', this.scrollHandler, { passive: false });
}

// When animation ends or skipped
onComplete() {
    window.removeEventListener('wheel', this.scrollHandler);
    window.removeEventListener('touchmove', this.scrollHandler);
}
```

### Important
- Do NOT use `position: fixed` on body - breaks auto-scroll
- Only prevent user-initiated scroll
- Programmatic `window.scrollBy()` still works

---

## Issue #4: Animation Trigger Threshold

### Current Behavior
- Animation starts when ~30% of essay is visible
- Essay might not be fully on screen when animation begins

### User Request
- Animation should start only when essay-paper is 100% visible in viewport

### Implementation

```javascript
setupScrollTrigger() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Only start when 100% visible
            if (entry.intersectionRatio >= 1.0 && !this.hasAnimated) {
                this.start();
            }
        });
    }, {
        threshold: 1.0,  // 100% visible
        rootMargin: '0px'
    });

    observer.observe(this.paper);  // Observe paper, not container
}
```

### Edge Case
- What if essay is taller than viewport?
- Cannot ever be 100% visible
- **Solution:** Use `threshold: 0.9` or check if paper fits in viewport

```javascript
const paperHeight = this.paper.offsetHeight;
const viewportHeight = window.innerHeight;

if (paperHeight > viewportHeight * 0.9) {
    // Paper is too tall, use lower threshold
    threshold = 0.5;
} else {
    threshold = 1.0;
}
```

---

## Issue #5: X-Axis Overflow (Horizontal Scroll)

### Current Behavior
- When pen is positioned beyond paper edge, it creates horizontal scroll
- Header appears to shift when scrollbar appears

### Root Cause
- Pen `position: absolute` can extend beyond parent
- No `overflow-x: hidden` on containing elements

### Proposed Solution

```css
/* Prevent horizontal scroll globally */
html, body {
    overflow-x: hidden;
    max-width: 100vw;
}

/* Or on specific container */
.essay-parchment {
    overflow: hidden;  /* Clips pen when it goes outside */
}
```

### Better Solution: Constrain Pen Position

```javascript
movePen(x, y) {
    const paperRect = this.paper.getBoundingClientRect();

    // Clamp X position to paper bounds
    const minX = 0;
    const maxX = paperRect.width - this.pen.offsetWidth;
    const clampedX = Math.max(minX, Math.min(maxX, x));

    this.pen.style.left = `${clampedX}px`;
    this.pen.style.top = `${y}px`;
}
```

---

## Summary of Changes

### CSS Changes (`writer-simulator.css`)

| Change | Purpose |
|--------|---------|
| Unify font-size for animation and final state | Fix jarring size change |
| Position pen at bottom of paper | Pen always visible |
| Reposition skip button below pen | Always visible |
| Add `overflow-x: hidden` to html/body | Prevent horizontal scroll |

### JS Changes (`writerSimulator.js`)

| Change | Purpose |
|--------|---------|
| Fix pen Y position to bottom of paper | "Growing paper" effect |
| Pen X follows cursor (clamped) | Track writing position |
| Add auto-scroll to keep pen in viewport | User always sees pen |
| Disable manual scroll during animation | Prevent user scrolling away |
| Change threshold to 1.0 | Start when fully visible |

### HTML Changes

None required - existing structure works.

---

## References

- Current CSS: `assets/css/writer-simulator.css`
- Current JS: `assets/js/writerSimulator.js`
- Screenshots provided by user showing issues
