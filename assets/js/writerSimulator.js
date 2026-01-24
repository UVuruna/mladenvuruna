/**
 * WriterSimulator - Essay writing animation
 *
 * Two modes:
 * 1. Typewriter - Normal font with blinking cursor
 * 2. Handwriting - Cursive font with quill pen following text
 *
 * Both modes use Typed.js for character-by-character reveal.
 * Handwriting mode adds pen tracking via cursor position.
 */

// Detect base path from script location
const WriterSimulatorBasePath = (() => {
    const scripts = document.querySelectorAll('script[src*="writerSimulator"]');
    if (scripts.length > 0) {
        const src = scripts[0].src;
        const match = src.match(/(.*)assets\/js\/writerSimulator\.js/);
        if (match) return match[1];
    }
    const path = window.location.pathname;
    const match = path.match(/^(.*?)(pages\/[^/]+\/)/);
    if (match) return match[1] || '/';
    return '/';
})();

class WriterSimulator {
    constructor(container, options = {}) {
        this.container = container;
        this.options = this.mergeOptions(options);
        this.mode = this.options.defaultMode;
        this.isAnimating = false;
        this.hasAnimated = false;
        this.typed = null;
        this.observer = null;
        this.penTrackingInterval = null;

        this.init();
    }

    mergeOptions(options) {
        const defaults = {
            defaultMode: 'typewriter',
            typewriter: {
                speed: 50,
                startDelay: 500,
                cursorChar: '|'
            },
            handwriting: {
                speed: 40,
                startDelay: 500,
                cursorChar: ''  // No cursor for handwriting, pen instead
            },
            pen: {
                offsetX: -5,
                offsetY: -50
            },
            scrollTrigger: {
                threshold: 0.3
            }
        };

        return {
            ...defaults,
            ...options,
            typewriter: { ...defaults.typewriter, ...options.typewriter },
            handwriting: { ...defaults.handwriting, ...options.handwriting },
            pen: { ...defaults.pen, ...options.pen },
            scrollTrigger: { ...defaults.scrollTrigger, ...options.scrollTrigger }
        };
    }

    init() {
        // Get DOM elements
        this.parchment = this.container.querySelector('.essay-parchment');
        this.contentEl = this.container.querySelector('.essay-content');
        this.pen = this.container.querySelector('.essay-pen');
        this.skipBtn = this.container.querySelector('.essay-skip');
        this.modeToggle = this.container.querySelector('.essay-mode-toggle');

        // Check preset mode
        const presetMode = this.container.dataset.mode;
        if (presetMode === 'typewriter' || presetMode === 'handwriting') {
            this.mode = presetMode;
            this.modeIsLocked = true;
        } else {
            this.modeIsLocked = false;
        }

        // Get text from data attribute
        this.rawText = this.contentEl?.dataset.text || '';

        // Clear content
        if (this.contentEl) {
            this.contentEl.innerHTML = '';
        }

        this.setupModeToggle();
        this.setupSkipButton();
        this.setupScrollTrigger();
    }

    setupModeToggle() {
        if (!this.modeToggle || this.modeIsLocked) return;

        const buttons = this.modeToggle.querySelectorAll('button[data-mode]');
        buttons.forEach(btn => {
            if (btn.dataset.mode === this.mode) {
                btn.classList.add('active');
            }

            btn.addEventListener('click', () => {
                if (this.isAnimating || this.hasAnimated) return;
                this.mode = btn.dataset.mode;
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    setupSkipButton() {
        if (!this.skipBtn) return;
        this.skipBtn.addEventListener('click', () => this.skip());
    }

    setupScrollTrigger() {
        // Queue handles when to start - no auto-start here
        // Just mark container as waiting
        this.container.classList.add('waiting-to-animate');
    }

    /**
     * Parse markdown - inline version for typing (no block elements)
     */
    parseMarkdownInline(text) {
        if (!text) return '';
        let html = text;
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.+?)_/g, '<em>$1</em>');
        html = html.replace(/\n\n+/g, '<br><br>');
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    /**
     * Parse markdown - final version with paragraphs
     */
    parseMarkdown(text) {
        if (!text) return '';
        const paragraphs = text.split(/\n\n+/);
        return paragraphs.map(p => {
            let html = p.trim();
            html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
            html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
            html = html.replace(/_(.+?)_/g, '<em>$1</em>');
            html = html.replace(/\n/g, '<br>');
            return `<p>${html}</p>`;
        }).join('');
    }

    start() {
        if (this.isAnimating || this.hasAnimated) return;

        this.isAnimating = true;
        this.container.classList.remove('waiting-to-animate');
        this.container.classList.add('is-animating');

        if (this.mode === 'handwriting') {
            this.container.classList.add('handwriting-mode');
            this.startHandwriting();
        } else {
            this.startTypewriter();
        }
    }

    startTypewriter() {
        if (typeof Typed === 'undefined') {
            console.error('WriterSimulator: Typed.js not loaded');
            this.showFullText();
            return;
        }

        const htmlContent = this.parseMarkdownInline(this.rawText);
        const typeSpeed = Math.round(1000 / this.options.typewriter.speed);

        // Create wrapper for Typed.js
        this.typedWrapper = document.createElement('span');
        this.typedWrapper.className = 'typed-wrapper';
        this.contentEl.appendChild(this.typedWrapper);

        this.typed = new Typed(this.typedWrapper, {
            strings: [htmlContent],
            typeSpeed: typeSpeed,
            startDelay: this.options.typewriter.startDelay,
            cursorChar: this.options.typewriter.cursorChar,
            showCursor: true,
            contentType: 'html',
            onComplete: () => {
                this.contentEl.innerHTML = this.parseMarkdown(this.rawText);
                this.onComplete();
            }
        });
    }

    startHandwriting() {
        if (typeof Typed === 'undefined') {
            console.error('WriterSimulator: Typed.js not loaded');
            this.showFullText();
            return;
        }

        const htmlContent = this.parseMarkdownInline(this.rawText);
        const typeSpeed = Math.round(1000 / this.options.handwriting.speed);

        // Create wrapper
        this.typedWrapper = document.createElement('span');
        this.typedWrapper.className = 'typed-wrapper';
        this.contentEl.appendChild(this.typedWrapper);

        // Show pen
        if (this.pen) {
            this.pen.style.opacity = '1';
            this.pen.style.visibility = 'visible';
            this.startPenTracking();
        }

        this.typed = new Typed(this.typedWrapper, {
            strings: [htmlContent],
            typeSpeed: typeSpeed,
            startDelay: this.options.handwriting.startDelay,
            cursorChar: this.options.handwriting.cursorChar,
            showCursor: false,  // No cursor, pen instead
            contentType: 'html',
            onComplete: () => {
                this.stopPenTracking();
                this.contentEl.innerHTML = this.parseMarkdown(this.rawText);
                this.onComplete();
            }
        });
    }

    /**
     * Track pen position by finding the last character position
     */
    startPenTracking() {
        if (!this.pen || !this.typedWrapper) return;

        const updatePen = () => {
            if (!this.isAnimating) {
                this.stopPenTracking();
                return;
            }

            // Get the bounding rect of the typed wrapper
            const wrapperRect = this.typedWrapper.getBoundingClientRect();
            const parchmentRect = this.parchment.getBoundingClientRect();

            // Create a temporary range to find the end of text
            const text = this.typedWrapper.innerHTML;
            if (text.length === 0) {
                this.penTrackingInterval = requestAnimationFrame(updatePen);
                return;
            }

            // Position pen at the end of text
            // We approximate by using wrapper's right edge
            const selection = window.getSelection();
            const range = document.createRange();

            // Find last text node
            let lastNode = this.typedWrapper;
            while (lastNode.lastChild) {
                lastNode = lastNode.lastChild;
            }

            if (lastNode.nodeType === Node.TEXT_NODE && lastNode.length > 0) {
                range.setStart(lastNode, lastNode.length);
                range.setEnd(lastNode, lastNode.length);
                const rects = range.getClientRects();

                if (rects.length > 0) {
                    const lastRect = rects[rects.length - 1];
                    const penX = lastRect.right - parchmentRect.left + this.options.pen.offsetX;
                    const penY = lastRect.top - parchmentRect.top + this.options.pen.offsetY;

                    this.pen.style.left = `${penX}px`;
                    this.pen.style.top = `${penY}px`;
                }
            }

            this.penTrackingInterval = requestAnimationFrame(updatePen);
        };

        this.penTrackingInterval = requestAnimationFrame(updatePen);
    }

    stopPenTracking() {
        if (this.penTrackingInterval) {
            cancelAnimationFrame(this.penTrackingInterval);
            this.penTrackingInterval = null;
        }
        if (this.pen) {
            this.pen.style.opacity = '0';
        }
    }

    skip() {
        this.stopPenTracking();

        if (this.typed) {
            this.typed.destroy();
            this.typed = null;
        }

        this.showFullText();
        this.onComplete();
    }

    showFullText() {
        if (this.contentEl) {
            this.contentEl.innerHTML = this.parseMarkdown(this.rawText);
        }
        // Remove cursor if exists
        const cursor = this.container.querySelector('.typed-cursor');
        if (cursor) cursor.remove();
    }

    onComplete() {
        this.stopPenTracking();
        this.isAnimating = false;
        this.hasAnimated = true;

        this.container.classList.remove('is-animating');
        this.container.classList.remove('handwriting-mode');
        this.container.classList.remove('waiting-to-animate');
        this.container.classList.add('has-animated');

        if (this.observer) {
            this.observer.disconnect();
        }

        // Notify queue to start next animation
        WriterSimulatorQueue.onComplete();
    }

    destroy() {
        this.stopPenTracking();
        if (this.typed) this.typed.destroy();
        if (this.observer) this.observer.disconnect();
        this.container.classList.remove('is-animating', 'has-animated', 'handwriting-mode');
    }
}

/**
 * Queue manager - only one animation at a time
 */
const WriterSimulatorQueue = {
    instances: [],
    currentIndex: -1,
    isAnimating: false,

    add(instance) {
        this.instances.push(instance);
    },

    startNext() {
        if (this.isAnimating) return;

        // Find next instance that hasn't animated yet
        for (let i = 0; i < this.instances.length; i++) {
            const instance = this.instances[i];
            if (!instance.hasAnimated && !instance.isAnimating) {
                // Check if visible
                const rect = instance.container.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

                if (isVisible) {
                    this.currentIndex = i;
                    this.isAnimating = true;
                    instance.start();
                    return;
                }
            }
        }
    },

    onComplete() {
        this.isAnimating = false;
        // Small delay before starting next
        setTimeout(() => this.startNext(), 500);
    }
};

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', async () => {
    let settings = {};

    try {
        const response = await fetch(WriterSimulatorBasePath + 'config/writerSimulator.json');
        if (response.ok) {
            settings = await response.json();
        }
    } catch (error) {
        // Use defaults
    }

    if (settings.enabled === false) return;

    // Create instances and add to queue
    document.querySelectorAll('.essay-entry').forEach(container => {
        const instance = new WriterSimulator(container, settings);
        WriterSimulatorQueue.add(instance);
    });

    // Start first visible on scroll
    const checkScroll = () => {
        WriterSimulatorQueue.startNext();
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll(); // Check immediately
});
