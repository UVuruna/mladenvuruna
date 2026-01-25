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

// Global site config for shared values like breakpoints
let WriterSimulatorSiteConfig = {
    breakpoints: { mobile: 768 }
};

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
                width: 100,
                mobileWidth: 70,
                offsetX: -5,
                offsetY: -50,
                animationDuration: 0.3,
                rotationMin: 27,
                rotationMax: 35
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
        this.paper = this.container.querySelector('.essay-paper');
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

        // Setup pen (don't show yet - will show when text starts)
        if (this.pen) {
            // Keep pen hidden until positioned
            this.pen.style.opacity = '0';
            this.pen.style.visibility = 'hidden';

            // Apply pen settings from config
            const mobileBreakpoint = WriterSimulatorSiteConfig.breakpoints.mobile;
            const isMobile = window.innerWidth < mobileBreakpoint;
            const penWidth = isMobile ? this.options.pen.mobileWidth : this.options.pen.width;
            this.pen.style.width = `${penWidth}px`;

            // Apply animation settings from config
            const duration = this.options.pen.animationDuration || 0.3;
            const rotMin = this.options.pen.rotationMin || 27;
            const rotMax = this.options.pen.rotationMax || 35;
            this.pen.style.animation = `pen-writing ${duration}s ease-in-out infinite alternate`;
            this.pen.style.setProperty('--pen-rot-min', `${rotMin}deg`);
            this.pen.style.setProperty('--pen-rot-max', `${rotMax}deg`);

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
                    const penHeight = this.pen.offsetHeight || 0;

                    // Calculate position relative to paper element
                    // Pen tip (bottom) should be at cursor, so subtract pen height
                    const penX = lastRect.right - paperRect.left + this.options.pen.offsetX;
                    const penY = lastRect.top - paperRect.top - penHeight + this.options.pen.offsetY;

                    this.pen.style.left = `${penX}px`;
                    this.pen.style.top = `${penY}px`;

                    // Show pen only after we have position
                    if (this.pen.style.opacity !== '1') {
                        this.pen.style.opacity = '1';
                        this.pen.style.visibility = 'visible';
                    }
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
    }

    removePen() {
        if (this.pen) {
            this.pen.remove();
            this.pen = null;
        }
    }

    showFontToggle() {
        // Create font toggle button after handwriting animation
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'essay-font-toggle';
        toggle.setAttribute('aria-label', 'Promeni font');
        toggle.innerHTML = '<span class="toggle-icon">Aa</span>';

        let isCursive = true;
        toggle.addEventListener('click', () => {
            isCursive = !isCursive;
            if (isCursive) {
                this.container.classList.add('cursive-text');
                this.container.classList.remove('normal-text');
            } else {
                this.container.classList.remove('cursive-text');
                this.container.classList.add('normal-text');
            }
        });

        // Insert toggle at bottom of paper
        this.paper.appendChild(toggle);
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
        this.removePen();  // Remove pen from DOM - it's never used again
        this.isAnimating = false;
        this.hasAnimated = true;

        this.container.classList.remove('is-animating');
        this.container.classList.remove('waiting-to-animate');
        this.container.classList.add('has-animated');

        // Remove handwriting-mode class (animation is done)
        this.container.classList.remove('handwriting-mode');

        // Keep cursive font if handwriting mode was used, show font toggle
        if (this.mode === 'handwriting') {
            this.container.classList.add('cursive-text');
            this.showFontToggle();
        }

        if (this.observer) {
            this.observer.disconnect();
        }

        // Notify queue to start next animation
        WriterSimulatorQueue.onComplete();
    }

    destroy() {
        this.stopPenTracking();
        this.removePen();
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
        // Load site config for shared values (breakpoints)
        const siteResponse = await fetch(WriterSimulatorBasePath + 'config/site.json');
        if (siteResponse.ok) {
            const siteConfig = await siteResponse.json();
            if (siteConfig.breakpoints) {
                WriterSimulatorSiteConfig.breakpoints = siteConfig.breakpoints;
            }
        }

        // Load writer simulator specific config
        const response = await fetch(WriterSimulatorBasePath + 'config/writerSimulator.json');
        if (response.ok) {
            settings = await response.json();
        }

        if (window.MV_IS_ADMIN) {
            console.log('WriterSimulator config loaded:', settings);
            console.log('WriterSimulator site config:', WriterSimulatorSiteConfig);
        }
    } catch (error) {
        // Use defaults
        if (window.MV_IS_ADMIN) {
            console.warn('WriterSimulator: Using default config', error);
        }
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
