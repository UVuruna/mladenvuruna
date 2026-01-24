# Writer Simulator - Essay Writing Animation

**Date:** January 2026
**Status:** PLANNING

---

## Problem Statement

Essays section needs an engaging animation that simulates text being written in real-time when the user scrolls to an essay. Two versions required:

1. **Typewriter Mode** - Normal font with typing animation and blinking cursor
2. **Handwriting Mode** - Cursive font with pen that follows the writing path

---

## Research Summary

### Typewriter Libraries

| Library | Pros | Cons |
|---------|------|------|
| **Typed.js** | Popular, well-maintained, easy to use | Just reveals characters, no stroke animation |
| **TypeIt** | More features (pause, delete, cursor movement) | Commercial license for commercial use |
| **Typify.js** | Lightweight | Less maintained |

**Decision: Typed.js** - MIT license, simple API, good documentation.
- CDN: `https://cdn.jsdelivr.net/npm/typed.js@2.0.12`
- GitHub: https://github.com/mattboldt/typed.js

### Handwriting Libraries

| Library | Pros | Cons |
|---------|------|------|
| **Vara.js** | Actual stroke drawing, custom fonts | Limited font selection, SVG-based |
| **Khoshnus.js** | 9 font styles, configurable | Less documented |
| **GSAP DrawSVG** | Powerful, smooth | Paid plugin ($75-150/year) |
| **SVGator** | No-code, complete solution | Paid tool, not a library |

**Decision: Vara.js** - Free, draws strokes realistically, can track coordinates for pen.
- CDN: `https://cdn.jsdelivr.net/npm/vara@1.4.0/lib/vara.min.js`
- GitHub: https://github.com/akzhy/Vara
- Fonts: Custom JSON format (included in repo)

### Pen Following Animation

No library provides pen animation out-of-the-box. Custom implementation needed:

**Approach:**
1. Vara.js draws SVG paths with `stroke-dashoffset` animation
2. Track current drawing position via Vara's `onDraw` callback
3. Position custom SVG pen at those coordinates
4. Rotate pen based on stroke direction

### Parchment Background

**Decision: SVG feTurbulence**
- Pure CSS/SVG, no external images
- Realistic aged paper effect
- Reference: https://codepen.io/AgnusDei/pen/NWPbOxL

---

## Two Modes Comparison

| Feature | Typewriter Mode | Handwriting Mode |
|---------|-----------------|------------------|
| **Font** | Normal (site font) | Cursive (Vara font) |
| **Cursor** | Blinking `|` cursor | SVG pen following text |
| **Animation** | Character reveal | Stroke drawing |
| **Library** | Typed.js | Vara.js |
| **Metaphor** | Typing on keyboard | Writing by hand |
| **Speed** | Characters per second | Stroke duration |

---

## Technical Architecture

### HTML Structure

```html
<article class="essay-entry" id="essay-slug">
    <!-- Parchment background -->
    <div class="essay-parchment">
        <!-- Mode toggle (visible before animation starts) -->
        <div class="essay-mode-toggle">
            <button data-mode="typewriter" class="active">Kucanje</button>
            <button data-mode="handwriting">Rukopis</button>
        </div>

        <!-- Writing surface -->
        <div class="essay-paper">
            <!-- Title -->
            <h2 class="essay-title" data-text="Essay Title Here"></h2>

            <!-- Content area -->
            <div class="essay-content" data-text="Full essay text here...">
                <!-- Typed.js or Vara.js renders here -->
            </div>

            <!-- Skip button -->
            <button class="essay-skip" aria-label="Preskoči animaciju">
                Preskoči ›
            </button>
        </div>

        <!-- Pen cursor (handwriting mode only) -->
        <svg class="essay-pen" viewBox="0 0 50 50">
            <!-- Custom pen SVG from user -->
        </svg>
    </div>
</article>
```

### CSS Structure

```css
/* Parchment effect using SVG filter */
.essay-parchment {
    position: relative;
    background: #fffef0;
    box-shadow: 2px 3px 20px black, 0 0 60px #8a4d0f inset;
    filter: url(#paper-texture);
    padding: 2rem;
    margin: 2rem auto;
    max-width: 800px;
}

/* SVG filter for paper texture */
<svg style="display: none;">
    <filter id="paper-texture">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" />
        <feDiffuseLighting lighting-color="#fffef0" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="60" />
        </feDiffuseLighting>
    </filter>
</svg>

/* Paper surface */
.essay-paper {
    position: relative;
    font-family: var(--font-serif);
    color: #2a1a0a; /* Ink color */
    line-height: 1.8;
}

/* Typewriter cursor */
.typed-cursor {
    font-weight: 100;
    color: #2a1a0a;
    animation: blink 0.7s infinite;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

/* Pen cursor (handwriting mode) */
.essay-pen {
    position: absolute;
    width: 40px;
    height: 40px;
    pointer-events: none;
    transition: transform 0.05s linear;
    z-index: 10;
    display: none; /* Hidden until handwriting mode */
}

.essay-parchment.handwriting-mode .essay-pen {
    display: block;
}

/* Skip button */
.essay-skip {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: rgba(42, 26, 10, 0.1);
    border: 1px solid rgba(42, 26, 10, 0.3);
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-family: var(--font-serif);
}
```

### JavaScript Architecture

```javascript
// settings.json structure
{
    "writerSimulator": {
        "defaultMode": "typewriter",
        "typewriter": {
            "speed": 50,          // Characters per second
            "startDelay": 500,    // Delay before starting (ms)
            "cursorChar": "|"
        },
        "handwriting": {
            "duration": 3000,     // Total duration per paragraph (ms)
            "delay": 200,         // Delay between paragraphs
            "strokeWidth": 2,
            "color": "#2a1a0a",
            "font": "Satisfy"     // Vara.js font name
        },
        "pen": {
            "offsetX": -5,        // Pen tip offset from stroke
            "offsetY": -35,
            "rotationRange": 15   // Degrees of rotation variation
        }
    }
}

// WriterSimulator class
class WriterSimulator {
    constructor(container, options) {
        this.container = container;
        this.options = options;
        this.mode = options.defaultMode;
        this.isAnimating = false;
        this.hasAnimated = false; // Only animate once per page load

        this.init();
    }

    init() {
        this.paper = this.container.querySelector('.essay-paper');
        this.contentEl = this.container.querySelector('.essay-content');
        this.text = this.contentEl.dataset.text;
        this.pen = this.container.querySelector('.essay-pen');
        this.skipBtn = this.container.querySelector('.essay-skip');

        this.setupModeToggle();
        this.setupSkipButton();
        this.setupScrollTrigger();
    }

    setupScrollTrigger() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.start();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(this.container);
    }

    start() {
        if (this.isAnimating || this.hasAnimated) return;

        this.isAnimating = true;

        if (this.mode === 'typewriter') {
            this.startTypewriter();
        } else {
            this.startHandwriting();
        }
    }

    startTypewriter() {
        this.contentEl.innerHTML = '';

        new Typed(this.contentEl, {
            strings: [this.text],
            typeSpeed: 1000 / this.options.typewriter.speed,
            startDelay: this.options.typewriter.startDelay,
            cursorChar: this.options.typewriter.cursorChar,
            showCursor: true,
            onComplete: () => this.onComplete()
        });
    }

    startHandwriting() {
        this.contentEl.innerHTML = '';
        this.container.classList.add('handwriting-mode');

        this.vara = new Vara(
            this.contentEl,
            'path/to/vara-font.json',
            [{
                text: this.text,
                duration: this.options.handwriting.duration,
                strokeWidth: this.options.handwriting.strokeWidth,
                color: this.options.handwriting.color
            }],
            {
                fontSize: 24,
                strokeWidth: this.options.handwriting.strokeWidth,
                color: this.options.handwriting.color
            }
        );

        // Track pen position
        this.vara.animationEnd(() => {
            this.onComplete();
        });

        // Update pen position during animation
        this.trackPenPosition();
    }

    trackPenPosition() {
        // Get all SVG paths created by Vara
        const paths = this.contentEl.querySelectorAll('path');

        // Use requestAnimationFrame to track stroke progress
        const updatePen = () => {
            if (!this.isAnimating) return;

            // Find the currently animating path
            paths.forEach(path => {
                const length = path.getTotalLength();
                const dashOffset = parseFloat(getComputedStyle(path).strokeDashoffset);
                const progress = length - dashOffset;

                if (progress > 0 && progress < length) {
                    const point = path.getPointAtLength(progress);
                    this.movePen(point.x, point.y);
                }
            });

            requestAnimationFrame(updatePen);
        };

        requestAnimationFrame(updatePen);
    }

    movePen(x, y) {
        const containerRect = this.contentEl.getBoundingClientRect();
        const offsetX = this.options.pen.offsetX;
        const offsetY = this.options.pen.offsetY;

        this.pen.style.left = `${x + offsetX}px`;
        this.pen.style.top = `${y + offsetY}px`;

        // Optional: slight rotation based on direction
        // this.pen.style.transform = `rotate(${angle}deg)`;
    }

    skip() {
        this.isAnimating = false;

        if (this.mode === 'typewriter' && this.typed) {
            // Typed.js doesn't have built-in skip, destroy and show full text
            this.typed.destroy();
        } else if (this.vara) {
            // Vara.js - need to complete all animations
            // May need to manually set stroke-dashoffset to 0
        }

        // Show full text
        this.contentEl.innerHTML = this.text;
        this.onComplete();
    }

    onComplete() {
        this.isAnimating = false;
        this.hasAnimated = true;
        this.container.classList.remove('handwriting-mode');
        this.pen.style.display = 'none';
        this.skipBtn.style.display = 'none';
    }
}
```

---

## Pen SVG Placeholder

User will provide custom pen SVG. Placeholder structure:

```svg
<svg class="essay-pen" viewBox="0 0 50 80" fill="none">
    <!-- Pen nib (tip) at bottom -->
    <path d="M25 80 L20 60 L30 60 Z" fill="#4a3728"/>

    <!-- Pen body -->
    <rect x="18" y="10" width="14" height="50" rx="2" fill="#2a1a0a"/>

    <!-- Pen grip -->
    <rect x="20" y="40" width="10" height="15" fill="#5a4738"/>

    <!-- Pen top -->
    <ellipse cx="25" cy="10" rx="7" ry="3" fill="#2a1a0a"/>
</svg>
```

Pen tip should be at bottom center of viewBox for correct positioning.

---

## Scroll Trigger Behavior

```javascript
// IntersectionObserver setup
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            writerSimulator.start();
        }
    });
}, {
    threshold: 0.3,      // 30% visible triggers animation
    rootMargin: '0px'    // No margin
});
```

**First visit only:**
- Animation plays once when essay enters viewport
- After completion, text remains static
- Refresh page = animation plays again
- No localStorage persistence (as requested)

---

## Vara.js Font Research

Available fonts in Vara.js repository:
1. **Satisfy** - Casual handwriting
2. **Pacifico** - Brush script
3. **Shadows Into Light** - Informal handwriting
4. **Patrick Hand** - Natural handwriting

Each font is a JSON file with SVG path data.

Custom font creation possible but complex (requires converting font paths to specific JSON format).

---

## Performance Considerations

### Typewriter Mode
- Lightweight, no issues
- DOM manipulation per character
- Cursor is pure CSS animation

### Handwriting Mode
- SVG rendering can be heavy for long texts
- Consider paragraph-by-paragraph animation for long essays
- Limit to ~500 characters per animation block
- requestAnimationFrame for smooth pen tracking

### Optimization Strategies
1. Only animate visible essays (IntersectionObserver)
2. Destroy animation instances after completion
3. Use CSS transforms for pen movement (GPU accelerated)
4. Debounce pen position updates

---

## Settings File Structure

**File:** `assets/data/settings.json`

```json
{
    "writerSimulator": {
        "enabled": true,
        "defaultMode": "typewriter",

        "typewriter": {
            "speed": 50,
            "startDelay": 500,
            "cursorChar": "|",
            "cursorBlink": true
        },

        "handwriting": {
            "duration": 3000,
            "delay": 200,
            "strokeWidth": 2,
            "color": "#2a1a0a",
            "font": "Satisfy",
            "fontSize": 24
        },

        "pen": {
            "enabled": true,
            "offsetX": -5,
            "offsetY": -35,
            "rotationEnabled": false,
            "rotationRange": 15
        },

        "parchment": {
            "enabled": true,
            "backgroundColor": "#fffef0",
            "inkColor": "#2a1a0a",
            "shadowEnabled": true
        }
    }
}
```

---

## Open Questions

1. **Text Source:** Store essays as:
   - Plain text in database (simple, can format in JS)
   - Markdown in database (allows **bold**, *italic*)
   - HTML in database (most flexible, security concerns)

   **Recommendation:** Plain text with paragraph breaks (`\n\n`). Handle formatting in JS.

2. **Multi-paragraph handling:**
   - Animate all at once (Vara limitation: long texts can be slow)
   - Paragraph by paragraph with pause between

3. **Title animation:**
   - Animate title separately before content?
   - Or include in content animation?

4. **Mobile behavior:**
   - Full animation? (may be slow)
   - Reduced/simpler animation?
   - Skip animation entirely on mobile?

---

## References

- [Typed.js GitHub](https://github.com/mattboldt/typed.js)
- [Typed.js Demo](https://mattboldt.com/demos/typed-js/)
- [Vara.js GitHub](https://github.com/akzhy/Vara)
- [Vara.js Demo](http://vara.akzhy.com/)
- [SVG Parchment Effect](https://codepen.io/AgnusDei/pen/NWPbOxL)
- [CSS Paper Effects](https://freefrontend.com/css-paper-effects/)
- [SVG getPointAtLength](https://developer.mozilla.org/en-US/docs/Web/API/SVGGeometryElement/getPointAtLength)
