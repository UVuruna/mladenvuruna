# Plan: Writer Simulator - Essay Writing Animation

**Date:** January 2026
**Based on:** [003-writer-simulator.md](../brainstorming/003-writer-simulator.md)

---

## Overview

Implement essay writing animation with two modes:
1. **Typewriter** - Normal font, blinking cursor, character-by-character reveal
2. **Handwriting** - Cursive font, pen following stroke, SVG drawing animation

Triggered when user scrolls to essay, plays once per page load.

---

## Files to Create

| File | Purpose |
|------|---------|
| `assets/css/writer-simulator.css` | Styles for parchment, paper, pen, animations |
| `assets/js/writerSimulator.js` | Main WriterSimulator class |
| `assets/data/settings.json` | Configurable settings (speeds, colors, etc.) |
| `assets/img/pen.svg` | Custom pen SVG (provided by user) |
| `components/essays/essay-entry.php` | Essay HTML component with data attributes |

## Files to Modify

| File | Changes |
|------|---------|
| `pages/eseji/index.php` | Include essay-entry component, load CSS/JS |
| `includes/head.php` | Add Typed.js and Vara.js CDN links |

## External Dependencies

| Library | CDN | Purpose |
|---------|-----|---------|
| Typed.js | `https://cdn.jsdelivr.net/npm/typed.js@2.0.12` | Typewriter effect |
| Vara.js | `https://cdn.jsdelivr.net/npm/vara@1.4.0/lib/vara.min.js` | Handwriting effect |

---

## Implementation Steps

### Step 1: Create Settings File

**File:** `assets/data/settings.json`

```json
{
    "writerSimulator": {
        "enabled": true,
        "defaultMode": "typewriter",
        "typewriter": {
            "speed": 50,
            "startDelay": 500,
            "cursorChar": "|"
        },
        "handwriting": {
            "duration": 3000,
            "strokeWidth": 2,
            "color": "#2a1a0a",
            "font": "Satisfy",
            "fontSize": 24
        },
        "pen": {
            "offsetX": -5,
            "offsetY": -35
        },
        "parchment": {
            "backgroundColor": "#fffef0",
            "inkColor": "#2a1a0a"
        }
    }
}
```

---

### Step 2: Create CSS

**File:** `assets/css/writer-simulator.css`

Key sections:
1. SVG filter for paper texture (inline in HTML or separate)
2. `.essay-parchment` - background, shadow, filter
3. `.essay-paper` - content area styling
4. `.essay-pen` - pen positioning and transitions
5. `.typed-cursor` - blinking cursor animation
6. `.essay-skip` - skip button styling
7. `.essay-mode-toggle` - mode switch buttons
8. Mobile responsive adjustments

---

### Step 3: Create Essay Component

**File:** `components/essays/essay-entry.php`

```php
<article class="essay-entry" id="<?= $essay['slug'] ?>">
    <div class="essay-parchment">
        <!-- SVG Filter (hidden) -->
        <svg class="essay-filters" style="display:none">
            <filter id="paper-texture-<?= $essay['id'] ?>">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5"/>
                <feDiffuseLighting lighting-color="#fffef0" surfaceScale="2">
                    <feDistantLight azimuth="45" elevation="60"/>
                </feDiffuseLighting>
            </filter>
        </svg>

        <!-- Mode Toggle -->
        <div class="essay-mode-toggle">
            <button data-mode="typewriter" class="active">Kucanje</button>
            <button data-mode="handwriting">Rukopis</button>
        </div>

        <!-- Paper -->
        <div class="essay-paper" style="filter: url(#paper-texture-<?= $essay['id'] ?>)">
            <h2 class="essay-title"><?= htmlspecialchars($essay['title']) ?></h2>
            <div class="essay-content"
                 data-text="<?= htmlspecialchars($essay['content']) ?>">
                <!-- JS renders here -->
            </div>
            <button class="essay-skip">Preskoči ›</button>
        </div>

        <!-- Pen (handwriting mode) -->
        <?php include 'assets/img/pen.svg'; ?>
    </div>
</article>
```

---

### Step 4: Create JavaScript

**File:** `assets/js/writerSimulator.js`

```javascript
class WriterSimulator {
    // Properties
    container       // Essay container element
    options         // Settings from JSON
    mode            // 'typewriter' | 'handwriting'
    isAnimating     // Currently animating
    hasAnimated     // Already animated this session
    typed           // Typed.js instance
    vara            // Vara.js instance

    // Methods
    constructor(container, options)
    init()                      // Setup elements, observers
    setupModeToggle()           // Handle mode switch buttons
    setupSkipButton()           // Handle skip button
    setupScrollTrigger()        // IntersectionObserver
    start()                     // Begin animation
    startTypewriter()           // Typed.js animation
    startHandwriting()          // Vara.js animation
    trackPenPosition()          // Follow stroke with pen
    movePen(x, y)               // Update pen position
    skip()                      // Skip to end
    onComplete()                // Cleanup after animation
    destroy()                   // Clean up instances
}

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    const settings = await fetch('/assets/data/settings.json').then(r => r.json());

    document.querySelectorAll('.essay-entry').forEach(el => {
        new WriterSimulator(el, settings.writerSimulator);
    });
});
```

---

### Step 5: Update Essay Page

**File:** `pages/eseji/index.php`

```php
<?php
$styles = ['header', 'footer', 'writer-simulator'];
$scripts = ['writerSimulator'];
$externalScripts = [
    'https://cdn.jsdelivr.net/npm/typed.js@2.0.12',
    'https://cdn.jsdelivr.net/npm/vara@1.4.0/lib/vara.min.js'
];

include 'includes/head.php';
include 'includes/header.php';

// Fetch essays from database
$essays = getEssays();
?>

<main class="essays-page">
    <h1>Eseji</h1>

    <?php foreach ($essays as $essay): ?>
        <?php include 'components/essays/essay-entry.php'; ?>
    <?php endforeach; ?>
</main>

<?php
include 'includes/footer.php';
?>
```

---

### Step 6: Pen SVG Placeholder

**File:** `assets/img/pen.svg`

```svg
<svg class="essay-pen" viewBox="0 0 50 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- PLACEHOLDER - User will provide actual pen design -->
    <!-- Pen tip should be at bottom center -->
    <path d="M25 80 L20 60 L30 60 Z" fill="#4a3728"/>
    <rect x="18" y="10" width="14" height="50" rx="2" fill="#2a1a0a"/>
</svg>
```

---

## Vara.js Font Setup

Download Vara font JSON files to local:

**Files to download:**
- `assets/fonts/vara/Satisfy.json`
- `assets/fonts/vara/ShadowsIntoLight.json`

Source: https://github.com/akzhy/Vara/tree/master/fonts

---

## Animation Flow

```
USER SCROLLS TO ESSAY
         │
         ▼
IntersectionObserver triggers (30% visible)
         │
         ▼
    hasAnimated?
    ┌────┴────┐
   YES       NO
    │         │
    ▼         ▼
  (skip)   Check mode
              │
    ┌─────────┴─────────┐
    │                   │
Typewriter          Handwriting
    │                   │
    ▼                   ▼
Typed.js starts     Vara.js starts
Character by char   + Pen tracking
    │                   │
    └─────────┬─────────┘
              │
         onComplete()
              │
              ▼
    hasAnimated = true
    Remove pen, hide skip
```

---

## Testing Checklist

### Typewriter Mode
- [ ] Text appears character by character
- [ ] Blinking cursor visible
- [ ] Speed matches settings
- [ ] Skip button shows full text immediately
- [ ] Cursor disappears after completion

### Handwriting Mode
- [ ] Text draws stroke by stroke
- [ ] Pen follows current stroke position
- [ ] Pen movement is smooth
- [ ] Skip button works
- [ ] Pen disappears after completion

### General
- [ ] Mode toggle works before animation starts
- [ ] Animation triggers on scroll (30% visible)
- [ ] Animation plays only once per page load
- [ ] Parchment background renders correctly
- [ ] Mobile responsive
- [ ] Settings load from JSON
- [ ] Multiple essays on page work independently

---

## Potential Issues & Solutions

| Issue | Solution |
|-------|----------|
| Vara.js slow on long text | Split into paragraphs, animate sequentially |
| Pen position jumps | Use CSS transitions, increase tracking frequency |
| SVG filter not rendering | Unique filter IDs per essay |
| Typed.js cursor remains | Call `typed.destroy()` on complete |
| Mobile performance | Consider simplified animation or skip |

---

## Estimated Work

| Component | Complexity |
|-----------|------------|
| Settings JSON | Low |
| CSS (parchment, pen) | Medium |
| Essay component PHP | Low |
| WriterSimulator JS | High |
| Typewriter integration | Low |
| Handwriting + pen tracking | High |
| Testing & refinement | Medium |

---

## Phase 1 (MVP)

Implement typewriter mode first:
1. Settings JSON
2. CSS (parchment, cursor)
3. Essay component
4. WriterSimulator with typewriter only
5. Skip button

## Phase 2

Add handwriting mode:
1. Vara.js integration
2. Pen tracking
3. Mode toggle
4. User's custom pen SVG

---

## Dependencies on User

1. **Custom pen SVG** - User will design and provide
2. **Essay content** - Need sample essays for testing
3. **Settings review** - User adjusts speeds, colors after seeing it work
