/**
 * WriterSimulator - Essay writing animation
 * Supports two modes:
 * 1. Typewriter - Normal font with blinking cursor (Typed.js)
 * 2. Handwriting - Cursive font with pen following strokes (Vara.js)
 */

// Detect base path from script location
const WriterSimulatorBasePath = (() => {
    const scripts = document.querySelectorAll('script[src*="writerSimulator"]');
    if (scripts.length > 0) {
        const src = scripts[0].src;
        // Extract path before 'assets/js/writerSimulator.js'
        const match = src.match(/(.*)assets\/js\/writerSimulator\.js/);
        if (match) {
            return match[1];
        }
    }
    // Fallback: try to detect from current page URL
    const path = window.location.pathname;
    // If we're in /pages/something/, basePath would be ../../
    const match = path.match(/^(.*?)(pages\/[^/]+\/)/);
    if (match) {
        return match[1] || '/';
    }
    return '/';
})();

class WriterSimulator {
    constructor(container, options = {}) {
        this.container = container;
        this.options = this.mergeOptions(options);

        this.mode = this.options.defaultMode;
        this.isAnimating = false;
        this.hasAnimated = false;

        // Instances
        this.typed = null;
        this.vara = null;
        this.observer = null;
        this.animationFrame = null;

        this.init();
    }

    /**
     * Merge user options with defaults
     */
    mergeOptions(options) {
        const defaults = {
            defaultMode: 'typewriter',
            typewriter: {
                speed: 50,
                startDelay: 500,
                cursorChar: '|',
                cursorBlink: true
            },
            handwriting: {
                duration: 3000,
                delay: 200,
                strokeWidth: 2,
                color: '#2a1a0a',
                font: 'Satisfy',
                fontSize: 28
            },
            pen: {
                enabled: true,
                offsetX: -8,
                offsetY: -45
            },
            scrollTrigger: {
                threshold: 0.3,
                rootMargin: '0px'
            }
        };

        // Deep merge
        return {
            ...defaults,
            ...options,
            typewriter: { ...defaults.typewriter, ...options.typewriter },
            handwriting: { ...defaults.handwriting, ...options.handwriting },
            pen: { ...defaults.pen, ...options.pen },
            scrollTrigger: { ...defaults.scrollTrigger, ...options.scrollTrigger }
        };
    }

    /**
     * Initialize component
     */
    init() {
        // Get DOM elements
        this.parchment = this.container.querySelector('.essay-parchment');
        this.paper = this.container.querySelector('.essay-paper');
        this.titleEl = this.container.querySelector('.essay-title');
        this.contentEl = this.container.querySelector('.essay-content');
        this.pen = this.container.querySelector('.essay-pen');
        this.skipBtn = this.container.querySelector('.essay-skip');
        this.modeToggle = this.container.querySelector('.essay-mode-toggle');

        // Generate unique ID for content element (needed for Vara.js selector)
        if (this.contentEl && !this.contentEl.id) {
            this.contentEl.id = 'essay-content-' + Math.random().toString(36).substr(2, 9);
        }
        this.contentSelector = this.contentEl ? '#' + this.contentEl.id : null;

        // Check if mode is preset via data attribute
        const presetMode = this.container.dataset.mode;
        if (presetMode && (presetMode === 'typewriter' || presetMode === 'handwriting')) {
            this.mode = presetMode;
            this.modeIsLocked = true; // Don't allow changing
        } else {
            this.modeIsLocked = false;
        }

        // Get text from data attribute
        this.rawText = this.contentEl?.dataset.text || '';
        this.title = this.titleEl?.dataset.text || this.titleEl?.textContent || '';

        // Clear content (will be filled by animation)
        if (this.contentEl) {
            this.contentEl.innerHTML = '';
        }

        // Setup
        this.setupModeToggle();
        this.setupSkipButton();
        this.setupScrollTrigger();
    }

    /**
     * Setup mode toggle buttons
     */
    setupModeToggle() {
        // If mode is locked (preset via data attribute), no toggle exists
        if (!this.modeToggle || this.modeIsLocked) return;

        const buttons = this.modeToggle.querySelectorAll('button[data-mode]');
        buttons.forEach(btn => {
            // Set initial active state
            if (btn.dataset.mode === this.mode) {
                btn.classList.add('active');
            }

            btn.addEventListener('click', () => {
                if (this.isAnimating || this.hasAnimated) return;

                // Update mode
                this.mode = btn.dataset.mode;

                // Update active button
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    /**
     * Setup skip button
     */
    setupSkipButton() {
        if (!this.skipBtn) return;

        this.skipBtn.addEventListener('click', () => {
            this.skip();
        });
    }

    /**
     * Setup IntersectionObserver for scroll trigger
     */
    setupScrollTrigger() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated && !this.isAnimating) {
                        this.start();
                    }
                });
            },
            {
                threshold: this.options.scrollTrigger.threshold,
                rootMargin: this.options.scrollTrigger.rootMargin
            }
        );

        this.observer.observe(this.container);
    }

    /**
     * Parse basic Markdown to HTML for final display (with paragraphs)
     * Supports: **bold**, *italic*, paragraphs
     */
    parseMarkdown(text) {
        if (!text) return '';

        // Split into paragraphs
        const paragraphs = text.split(/\n\n+/);

        return paragraphs
            .map(p => {
                let html = p.trim();

                // Bold: **text** or __text__
                html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

                // Italic: *text* or _text_
                html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
                html = html.replace(/_(.+?)_/g, '<em>$1</em>');

                // Line breaks within paragraph
                html = html.replace(/\n/g, '<br>');

                return `<p>${html}</p>`;
            })
            .join('');
    }

    /**
     * Parse Markdown for typing animation (inline, no block elements)
     * Uses <br> for paragraph breaks so cursor stays inline
     */
    parseMarkdownInline(text) {
        if (!text) return '';

        let html = text;

        // Bold: **text** or __text__
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

        // Italic: *text* or _text_
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.+?)_/g, '<em>$1</em>');

        // Paragraph breaks: double newline -> double <br>
        html = html.replace(/\n\n+/g, '<br><br>');

        // Single line breaks
        html = html.replace(/\n/g, '<br>');

        return html;
    }

    /**
     * Start the animation
     */
    start() {
        if (this.isAnimating || this.hasAnimated) return;

        this.isAnimating = true;
        this.container.classList.add('is-animating');

        if (this.mode === 'typewriter') {
            this.startTypewriter();
        } else {
            this.startHandwriting();
        }
    }

    /**
     * Start typewriter animation using Typed.js
     */
    startTypewriter() {
        // Check if Typed.js is loaded
        if (typeof Typed === 'undefined') {
            console.error('WriterSimulator: Typed.js not loaded');
            this.showFullText();
            return;
        }

        // Parse markdown to inline HTML (no <p> tags so cursor stays inline)
        const htmlContent = this.parseMarkdownInline(this.rawText);

        // Calculate typing speed (ms per character)
        const typeSpeed = Math.round(1000 / this.options.typewriter.speed);

        // Create a wrapper span for Typed.js
        // Typed.js puts cursor as sibling AFTER target element,
        // so we need a wrapper inside .essay-content to keep cursor inline
        this.typedWrapper = document.createElement('span');
        this.typedWrapper.className = 'typed-wrapper';
        this.contentEl.appendChild(this.typedWrapper);

        // Initialize Typed.js on the wrapper
        this.typed = new Typed(this.typedWrapper, {
            strings: [htmlContent],
            typeSpeed: typeSpeed,
            startDelay: this.options.typewriter.startDelay,
            cursorChar: this.options.typewriter.cursorChar,
            showCursor: this.options.typewriter.cursorBlink,
            contentType: 'html',
            onComplete: () => {
                // Replace inline format with proper paragraphs
                this.contentEl.innerHTML = this.parseMarkdown(this.rawText);
                this.onComplete();
            }
        });
    }

    /**
     * Start handwriting animation using Vara.js
     */
    startHandwriting() {
        // Check if Vara.js is loaded
        if (typeof Vara === 'undefined') {
            console.error('WriterSimulator: Vara.js not loaded');
            this.showFullText();
            return;
        }

        // Show pen
        this.container.classList.add('handwriting-mode');

        // For Vara.js, we need to limit text length for performance
        // Split into paragraphs and take first few
        const paragraphs = this.rawText.split(/\n\n+/).map(p => p.trim()).filter(p => p);

        // Create text blocks for Vara
        // Each paragraph gets its own block with y offset
        const lineHeight = this.options.handwriting.fontSize * 1.8;
        const textBlocks = [];
        let currentY = 0;

        paragraphs.forEach((paragraph, pIndex) => {
            // Split long paragraphs into lines (approx 50 chars per line)
            const maxCharsPerLine = 45;
            const words = paragraph.split(' ');
            let currentLine = '';
            let lineIndex = 0;

            words.forEach(word => {
                if ((currentLine + ' ' + word).length > maxCharsPerLine && currentLine) {
                    textBlocks.push({
                        text: currentLine.trim(),
                        fontSize: this.options.handwriting.fontSize,
                        strokeWidth: this.options.handwriting.strokeWidth,
                        color: this.options.handwriting.color,
                        duration: this.options.handwriting.duration,
                        y: currentY,
                        queued: true,
                        delay: 100
                    });
                    currentY += lineHeight;
                    currentLine = word;
                    lineIndex++;
                } else {
                    currentLine += (currentLine ? ' ' : '') + word;
                }
            });

            // Add remaining text
            if (currentLine.trim()) {
                textBlocks.push({
                    text: currentLine.trim(),
                    fontSize: this.options.handwriting.fontSize,
                    strokeWidth: this.options.handwriting.strokeWidth,
                    color: this.options.handwriting.color,
                    duration: this.options.handwriting.duration,
                    y: currentY,
                    queued: true,
                    delay: 100
                });
                currentY += lineHeight;
            }

            // Add paragraph spacing
            currentY += lineHeight * 0.5;
        });

        // Limit to prevent performance issues (max 10 lines for demo)
        const limitedBlocks = textBlocks.slice(0, 10);

        // Get Vara font path
        const fontPath = this.getVaraFontPath();

        try {
            this.vara = new Vara(
                this.contentSelector,
                fontPath,
                limitedBlocks,
                {
                    fontSize: this.options.handwriting.fontSize,
                    strokeWidth: this.options.handwriting.strokeWidth,
                    color: this.options.handwriting.color,
                    duration: this.options.handwriting.duration,
                    textAlign: 'left'
                }
            );

            // Start pen tracking after fonts load
            this.vara.ready(() => {
                if (this.options.pen.enabled && this.pen) {
                    this.startPenTracking();
                }
            });

            // Listen for animation end
            this.vara.animationEnd((i, obj) => {
                // Check if this is the last block
                if (i === limitedBlocks.length - 1) {
                    this.onComplete();
                }
            });

        } catch (error) {
            console.error('WriterSimulator: Vara.js error', error);
            this.showFullText();
        }
    }

    /**
     * Get Vara.js font file path
     */
    getVaraFontPath() {
        // Vara.js font files use specific naming (e.g., SatisfySL.json)
        // Local fonts stored in assets/fonts/vara/
        return WriterSimulatorBasePath + 'assets/fonts/vara/SatisfySL.json';
    }

    /**
     * Track pen position during Vara.js animation
     */
    startPenTracking() {
        if (!this.pen || !this.contentEl) return;

        // Show pen
        this.pen.style.opacity = '1';

        const updatePen = () => {
            if (!this.isAnimating) {
                this.pen.style.opacity = '0';
                return;
            }

            // Find all SVG paths created by Vara
            const svg = this.contentEl.querySelector('svg');
            if (!svg) {
                this.animationFrame = requestAnimationFrame(updatePen);
                return;
            }

            const paths = svg.querySelectorAll('path');
            let activePoint = null;
            let svgRect = svg.getBoundingClientRect();

            // Find the currently animating stroke
            paths.forEach(path => {
                try {
                    const length = path.getTotalLength();
                    const style = getComputedStyle(path);
                    const dashOffset = parseFloat(style.strokeDashoffset);

                    // If dashOffset is between 0 and length, path is animating
                    if (!isNaN(dashOffset) && dashOffset > 0 && dashOffset < length) {
                        const progress = length - dashOffset;
                        if (progress > 0) {
                            const point = path.getPointAtLength(progress);

                            // Convert SVG coordinates to screen coordinates
                            const svgPoint = svg.createSVGPoint();
                            svgPoint.x = point.x;
                            svgPoint.y = point.y;

                            const screenCTM = svg.getScreenCTM();
                            if (screenCTM) {
                                const screenPoint = svgPoint.matrixTransform(screenCTM);
                                activePoint = {
                                    x: screenPoint.x - svgRect.left + svg.scrollLeft,
                                    y: screenPoint.y - svgRect.top + svg.scrollTop
                                };
                            }
                        }
                    }
                } catch (e) {
                    // Some paths may not support these operations
                }
            });

            if (activePoint) {
                this.movePenAbsolute(activePoint.x, activePoint.y);
            }

            this.animationFrame = requestAnimationFrame(updatePen);
        };

        this.animationFrame = requestAnimationFrame(updatePen);
    }

    /**
     * Move pen to absolute position within content area
     */
    movePenAbsolute(x, y) {
        if (!this.pen) return;

        const penX = x + this.options.pen.offsetX;
        const penY = y + this.options.pen.offsetY;

        this.pen.style.left = `${penX}px`;
        this.pen.style.top = `${penY}px`;
    }

    /**
     * Move pen to position
     */
    movePen(x, y) {
        if (!this.pen) return;

        const contentRect = this.contentEl.getBoundingClientRect();
        const parchmentRect = this.parchment.getBoundingClientRect();

        // Calculate position relative to parchment
        const penX = (contentRect.left - parchmentRect.left) + x + this.options.pen.offsetX;
        const penY = (contentRect.top - parchmentRect.top) + y + this.options.pen.offsetY;

        this.pen.style.left = `${penX}px`;
        this.pen.style.top = `${penY}px`;
    }

    /**
     * Skip animation and show full text
     */
    skip() {
        // Stop tracking
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        // Destroy typed instance
        if (this.typed) {
            this.typed.destroy();
            this.typed = null;
        }

        // For Vara.js, we need to force complete the animation
        // Since Vara doesn't have a built-in skip, we just show the plain text
        if (this.vara) {
            // Vara doesn't have destroy method, just clear and show text
        }

        this.showFullText();
        this.onComplete();
    }

    /**
     * Show full text immediately
     */
    showFullText() {
        if (this.contentEl) {
            // For typewriter mode, show parsed HTML
            if (this.mode === 'typewriter') {
                this.contentEl.innerHTML = this.parseMarkdown(this.rawText);
            } else {
                // For handwriting mode, show plain paragraphs
                const paragraphs = this.rawText.split(/\n\n+/);
                this.contentEl.innerHTML = paragraphs
                    .map(p => `<p>${p.trim()}</p>`)
                    .join('');
            }
        }

        // Remove cursor if exists
        const cursor = this.container.querySelector('.typed-cursor');
        if (cursor) {
            cursor.remove();
        }
    }

    /**
     * Called when animation completes
     */
    onComplete() {
        // Stop pen tracking
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        // Update state
        this.isAnimating = false;
        this.hasAnimated = true;

        // Update classes
        this.container.classList.remove('is-animating');
        this.container.classList.remove('handwriting-mode');
        this.container.classList.add('has-animated');

        // Hide pen
        if (this.pen) {
            this.pen.style.opacity = '0';
        }

        // Disconnect observer (no need to observe anymore)
        if (this.observer) {
            this.observer.disconnect();
        }

        // For handwriting mode, replace SVG with regular text for readability
        if (this.mode === 'handwriting' && this.contentEl) {
            // Small delay to let animation fully complete
            setTimeout(() => {
                const paragraphs = this.rawText.split(/\n\n+/);
                this.contentEl.innerHTML = paragraphs
                    .map(p => `<p>${p.trim()}</p>`)
                    .join('');
            }, 500);
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        if (this.typed) {
            this.typed.destroy();
        }

        if (this.observer) {
            this.observer.disconnect();
        }

        this.container.classList.remove('is-animating', 'has-animated', 'handwriting-mode');
    }
}

/**
 * Initialize all essay entries on page load
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Load settings from JSON
    let settings = {};

    try {
        const response = await fetch(WriterSimulatorBasePath + 'config/writerSimulator.json');
        if (response.ok) {
            settings = await response.json();
        }
    } catch (error) {
        console.warn('WriterSimulator: Could not load settings, using defaults');
    }

    // Skip if disabled
    if (settings.enabled === false) {
        return;
    }

    // Initialize each essay entry
    document.querySelectorAll('.essay-entry').forEach(container => {
        new WriterSimulator(container, settings);
    });
});
