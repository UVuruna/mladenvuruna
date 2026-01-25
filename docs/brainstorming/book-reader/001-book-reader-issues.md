# Book Reader - Issues & Corrections

**Date:** January 2026
**Status:** RESOLVED - Switched to StPageFlip library

---

## Issues Identified

### Issue 1: View Mode Detection Wrong
**Problem:** Used `height > width` strictly, but should consider available space.
**Current:** Even when there's room for 2-page view, shows single page.
**Expected:** Smart detection based on actual available space, not just orientation.

### Issue 2: 2-Page View Sizing Completely Wrong
**Problem:** When opening book in 2-page view, splits CURRENT width in half, creating unnaturally narrow pages.

**What I Did (WRONG):**
```
[    Book Container (same size)    ]
[  Page 1  ][  Page 2  ] <- Half width each = TOO NARROW
```

**What Should Happen (from diagram):**

**PHASE 1:** Front cover positioned normally (left side)
```
[Front Cover]
     ^
     |
  Normal size
```

**PHASE 2:** Front cover MOVES RIGHT so left edge is at center X axis
```
          [Front Cover]
               ^
               |
          Left edge at center
```

**PHASE 3:** Cover OPENS LEFT, creating 2x width
```
[  Page 1  ][  Page 2  ]
     ^           ^
     |           |
   WIDTH = 2 * original cover width
```

### Issue 3: Mobile Page Too Small
**Problem:** Page is tiny with huge margins.
**Expected:** Nearly full width with minimal margins (maybe 5-10% on each side).

---

## Correct Understanding of Transitions

### Opening Book - Desktop (width > height)
1. Front Cover starts at normal position
2. **MOVE RIGHT:** Cover slides right until LEFT EDGE is at screen CENTER
3. **OPEN LEFT:** Cover flips open to the left (rotateY)
4. **RESULT:** 2-PAGE VIEW with total width = 2 × cover width

### Opening Book - Mobile (height > width)
1. Front Cover at CENTER, nearly FULL WIDTH (minimal margins)
2. **FLIP:** Cover flips to reveal first page
3. **RESULT:** 1-PAGE VIEW, same large size

### Turning Page - Desktop
- Both pages turn together (realistic simulation)
- Pages 2-3 flip to reveal 4-5

### Turning Page - Mobile
- Single page flips (fake simulation - each page is independent)
- Visual effect only, not physically realistic

### Closing Book - Desktop
1. Right side of 2-page moves right
2. Transitions to 1-page view (cover)
3. Returns to original position

### Closing Book - Mobile
1. Current page flips to back cover
2. Book returns to closed state

---

## Key Sizing Rules (from diagram)

> "AREA (proportional parameters) should have MIN available space with same ratio for NARROW as it doesn't scale to EDGE OF SCREEN. Will only add more space to sides as MAX Ratio proportional space to avoid distortion."

**Translation:**
- Book maintains aspect ratio ALWAYS
- Does NOT stretch to full screen width
- Adds padding/margin on sides
- On mobile: use nearly full width, small margins
- On desktop closed: centered, reasonable size
- On desktop open: 2× width, still maintains page aspect ratio

---

## Required Changes

### CSS Changes
1. Remove fixed `max-width` on book container
2. Add dynamic sizing based on view mode
3. Mobile: ~90% viewport width
4. Desktop closed: reasonable centered size
5. Desktop open: container expands to 2× width
6. Animation for container size change

### JS Changes
1. Better view mode detection (consider space, not just orientation)
2. Opening animation phases:
   - Phase 1: Move cover right (translateX)
   - Phase 2: Open cover (rotateY)
   - Phase 3: Expand container to 2× width
3. Closing animation (reverse)
4. Mobile sizing adjustments

---

## Reference
See diagram: `assets/img/material/BookReader.png`

---

## Resolution

**Decision:** Abandoned custom CSS 3D animations in favor of **StPageFlip** library.

**Library:** [page-flip](https://github.com/Nodlik/StPageFlip) v2.0.7

**Benefits:**
- Professional page-flip animations out of the box
- Handles 2-page/1-page modes automatically
- Touch/swipe support built-in
- Shadow and corner animations included
- Well-tested across browsers

**Files Updated:**
- `includes/head.php` - Added CDN script
- `assets/js/bookReader.js` - Complete rewrite using St.PageFlip
- `assets/css/book-reader.css` - Simplified for library integration
