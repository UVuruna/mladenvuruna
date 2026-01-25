# Plan: Writer Simulator Fixes

**Date:** January 2026
**Based on:** [004-writer-simulator-fixes.md](../../brainstorming/writer-simulator/004-writer-simulator-fixes.md)
**Status:** READY FOR IMPLEMENTATION

---

## Overview

Fix 6 issues with the current Writer Simulator implementation:

| # | Issue | Priority |
|---|-------|----------|
| 1 | Font size mismatch during/after animation | High |
| 2 | Pen goes off-screen, should stay at paper bottom | High |
| 3 | Skip button overlapped by text | High |
| 4 | Page scroll not disabled during animation | Medium |
| 5 | Animation starts before essay 100% visible | Medium |
| 6 | X-axis overflow from pen position | Medium |

---

## Concept: "Growing Paper"

```
Start:                      During:                     More text:
┌─────────────┐             ┌─────────────┐             ┌─────────────┐
│   Title     │             │   Title     │             │   Title     │
│             │             │             │             │ Previous    │
│             │             │ First line  │             │ text moves  │
│  🪶         │             │ appears...  │             │ up here...  │
│ [Preskoči]  │             │  🪶         │             │ New line 🪶 │
└─────────────┘             │ [Preskoči]  │             │ [Preskoči]  │
                            └─────────────┘             └─────────────┘
```

- Pen is FIXED at bottom of paper
- Text appears at pen and pushes up
- Paper grows as content increases
- Page auto-scrolls to keep pen visible

---

## Files to Modify

| File | Changes |
|------|---------|
| `assets/css/writer-simulator.css` | Font sizes, pen position, skip button, overflow |
| `assets/js/writerSimulator.js` | Pen tracking, auto-scroll, scroll lock, threshold |

---

## Implementation Steps

### Step 1: Fix Font Size Mismatch

**File:** `assets/css/writer-simulator.css`

**Problem:** Animation uses different font-size than final state.

**Current code (around line 314-320):**
```css
.essay-entry.handwriting-mode .essay-content,
.essay-entry.handwriting-mode .essay-content .typed-wrapper {
    font-family: 'Dancing Script', cursive;
    font-size: calc(var(--font-size-lg) * 1.3);
    line-height: 1.8;
    text-align: left;
}
```

**Change to match final `.cursive-text` styles exactly.**

Also check mobile styles (around line 482-484) for consistency.

---

### Step 2: Fix X-Axis Overflow

**File:** `assets/css/writer-simulator.css`

**Add at top of file (after font-face declarations):**
```css
/* Prevent horizontal scroll from pen overflow */
html {
    overflow-x: hidden;
}
```

**Also update `.essay-parchment` (around line 84-100):**
```css
.essay-parchment {
    /* ... existing styles ... */
    overflow: hidden;  /* ADD: Clip pen when outside bounds */
}
```

---

### Step 3: Reposition Pen to Bottom of Paper

**File:** `assets/css/writer-simulator.css`

**Update `.essay-pen` styles (around line 248-262):**
```css
.essay-pen {
    --pen-rot-min: 27deg;
    --pen-rot-max: 35deg;
    position: absolute;
    width: 100px;
    height: auto;
    pointer-events: none;
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transform: rotate(30deg);
    transform-origin: bottom center;
    will-change: left;  /* CHANGE: Only left changes, not top */
    filter: drop-shadow(2px 4px 3px rgba(0, 0, 0, 0.3));

    /* NEW: Fixed at bottom of paper */
    bottom: calc(var(--spacing-md) + 40px);  /* Above skip button */
    /* left is set by JS */
}
```

---

### Step 4: Reposition Skip Button

**File:** `assets/css/writer-simulator.css`

**Update `.essay-skip` styles (around line 273-290):**
```css
.essay-skip {
    /* Keep existing styles but ensure it's at bottom */
    position: absolute;
    bottom: var(--spacing-md);
    right: var(--spacing-lg);
    /* ... rest of styles ... */
}
```

The skip button is already positioned at bottom - just ensure pen is above it.

---

### Step 5: Update Pen Tracking in JavaScript

**File:** `assets/js/writerSimulator.js`

**Replace `startPenTracking()` method (around line 268-314):**

```javascript
startPenTracking() {
    if (!this.pen || !this.typedWrapper || !this.paper) return;

    const updatePen = () => {
        if (!this.isAnimating) {
            this.stopPenTracking();
            return;
        }

        // Find last text node in typed wrapper
        let lastNode = this.typedWrapper;
        while (lastNode.lastChild) {
            lastNode = lastNode.lastChild;
        }

        if (lastNode.nodeType === Node.TEXT_NODE && lastNode.length > 0) {
            const range = document.createRange();
            range.setStart(lastNode, lastNode.length);
            range.setEnd(lastNode, lastNode.length);
            const rects = range.getClientRects();

            if (rects.length > 0) {
                const lastRect = rects[rects.length - 1];
                const paperRect = this.paper.getBoundingClientRect();

                // X position follows cursor (clamped to paper bounds)
                let penX = lastRect.right - paperRect.left + this.options.pen.offsetX;
                const maxX = paperRect.width - (this.pen.offsetWidth || 100) - 10;
                penX = Math.max(0, Math.min(maxX, penX));

                this.pen.style.left = `${penX}px`;
                // Y position is fixed by CSS (bottom of paper)

                // Show pen only after we have position
                if (this.pen.style.opacity !== '1') {
                    this.pen.style.opacity = '1';
                    this.pen.style.visibility = 'visible';
                }

                // Auto-scroll to keep pen in viewport
                this.scrollPenIntoView();
            }
        }

        this.penTrackingInterval = requestAnimationFrame(updatePen);
    };

    this.penTrackingInterval = requestAnimationFrame(updatePen);
}

/**
 * Auto-scroll page to keep pen visible
 */
scrollPenIntoView() {
    const penRect = this.pen.getBoundingClientRect();
    const viewportBottom = window.innerHeight;
    const threshold = 80; // pixels from bottom

    if (penRect.bottom > viewportBottom - threshold) {
        window.scrollBy({
            top: penRect.bottom - viewportBottom + threshold + 20,
            behavior: 'smooth'
        });
    }
}
```

---

### Step 6: Disable Manual Scroll During Animation

**File:** `assets/js/writerSimulator.js`

**Add scroll lock methods to the class:**

```javascript
/**
 * Disable manual scroll (wheel + touch)
 */
disableScroll() {
    this.scrollHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
    window.addEventListener('wheel', this.scrollHandler, { passive: false });
    window.addEventListener('touchmove', this.scrollHandler, { passive: false });
    document.addEventListener('keydown', this.preventScrollKeys);
}

/**
 * Re-enable manual scroll
 */
enableScroll() {
    if (this.scrollHandler) {
        window.removeEventListener('wheel', this.scrollHandler);
        window.removeEventListener('touchmove', this.scrollHandler);
    }
    document.removeEventListener('keydown', this.preventScrollKeys);
}

/**
 * Prevent scroll via keyboard (arrows, space, page up/down)
 */
preventScrollKeys = (e) => {
    const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // space, pgup, pgdn, end, home, arrows
    if (scrollKeys.includes(e.keyCode)) {
        e.preventDefault();
    }
};
```

**Update `start()` method to call `disableScroll()`:**
```javascript
start() {
    if (this.isAnimating || this.hasAnimated) return;

    this.isAnimating = true;
    this.disableScroll();  // ADD THIS
    // ... rest of method
}
```

**Update `onComplete()` method to call `enableScroll()`:**
```javascript
onComplete() {
    this.stopPenTracking();
    this.enableScroll();  // ADD THIS
    // ... rest of method
}
```

**Update `skip()` method to call `enableScroll()`:**
```javascript
skip() {
    this.stopPenTracking();
    this.enableScroll();  // ADD THIS
    // ... rest of method
}
```

---

### Step 7: Change Animation Trigger to 100% Visible

**File:** `assets/js/writerSimulator.js`

**Update `WriterSimulatorQueue.startNext()` (around line 423-442):**

```javascript
startNext() {
    if (this.isAnimating) return;

    for (let i = 0; i < this.instances.length; i++) {
        const instance = this.instances[i];
        if (!instance.hasAnimated && !instance.isAnimating) {
            const rect = instance.paper.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Check if paper is 100% visible in viewport
            const isFullyVisible = rect.top >= 0 && rect.bottom <= viewportHeight;

            // For tall papers that can't be 100% visible, use 80% threshold
            const paperHeight = rect.height;
            const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
            const visibleRatio = visibleHeight / paperHeight;
            const isMostlyVisible = visibleRatio >= 0.8 && rect.top >= 0;

            if (isFullyVisible || (paperHeight > viewportHeight && isMostlyVisible)) {
                this.currentIndex = i;
                this.isAnimating = true;
                instance.start();
                return;
            }
        }
    }
}
```

---

## Implementation Order

1. **CSS: X-axis overflow fix** (`overflow-x: hidden`)
2. **CSS: Font size unification**
3. **CSS: Pen position to bottom**
4. **JS: Update pen tracking** (X only, add `scrollPenIntoView`)
5. **JS: Add scroll lock/unlock methods**
6. **JS: Update visibility threshold**
7. **Test all scenarios**

---

## Testing Checklist

### Font Size
- [ ] Font during animation matches font after completion
- [ ] No jarring "snap" when animation completes
- [ ] Works for both typewriter and handwriting modes

### Pen Position
- [ ] Pen stays at bottom of paper throughout animation
- [ ] Pen X position follows cursor
- [ ] Pen is visible on screen (auto-scroll works)
- [ ] Pen doesn't overflow paper horizontally

### Skip Button
- [ ] Skip button always visible during animation
- [ ] Not covered by text or pen
- [ ] Works correctly

### Scroll Lock
- [ ] Cannot scroll with mouse wheel during animation
- [ ] Cannot scroll with touch during animation
- [ ] Cannot scroll with keyboard during animation
- [ ] Scroll restored after animation completes
- [ ] Scroll restored after skip

### Animation Trigger
- [ ] Animation waits until paper is fully visible
- [ ] Works for papers taller than viewport (80% threshold)

### X-Axis Overflow
- [ ] No horizontal scrollbar appears
- [ ] Header doesn't shift

### General
- [ ] Typewriter mode still works
- [ ] Handwriting mode works
- [ ] Multiple essays on page work correctly
- [ ] Mobile responsive

---

## Rollback Plan

If issues arise:
```bash
git checkout HEAD~1 -- assets/css/writer-simulator.css
git checkout HEAD~1 -- assets/js/writerSimulator.js
```
