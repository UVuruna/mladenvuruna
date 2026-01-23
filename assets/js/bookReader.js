/**
 * BookReader - Using StPageFlip library with in-place animation
 * v4 - Proper centering for 3 states + maximize size
 * https://github.com/Nodlik/StPageFlip
 */

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.book-container').forEach(container => {
        new BookReader(container);
    });
});

class BookReader {
    constructor(container) {
        this.container = container;
        this.wrapper = container.closest('.book-wrapper');
        this.stage = container.closest('.book-stage');
        this.entry = container.closest('.book-entry');
        this.cover = container.querySelector('.book-cover');
        this.flipbookEl = container.querySelector('.book-flipbook');
        this.controls = this.entry.querySelector('.book-controls');

        this.pages = JSON.parse(container.dataset.pages || '[]');
        this.coverFront = container.dataset.front;
        this.coverBack = container.dataset.back;

        this.pageFlip = null;
        this.isOpen = false;
        this.isAnimating = false;
        this.currentState = 'closed'; // 'closed', 'front-cover', 'spread', 'back-cover'

        // Timing constants (ms)
        this.TRANSITION_DURATION = 400;
        this.FLIP_DURATION = 800;

        this.init();
    }

    init() {
        // Click cover to open
        this.cover.addEventListener('click', () => this.open());

        // Controls
        this.controls.querySelector('.btn-prev')?.addEventListener('click', () => this.prev());
        this.controls.querySelector('.btn-next')?.addEventListener('click', () => this.next());
        this.controls.querySelector('.btn-close')?.addEventListener('click', () => this.close());

        // Keyboard support
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleKeyDown(e) {
        if (!this.isOpen || this.isAnimating) return;

        switch (e.key) {
            case 'Escape':
                this.close();
                break;
            case 'ArrowLeft':
                this.prev();
                break;
            case 'ArrowRight':
                this.next();
                break;
        }
    }

    /**
     * Calculate optimal page size to maximize available space
     * Priority: max width, but constrain if height exceeds 95% of available
     */
    getSize() {
        const headerHeight = 80;
        const padding = 40;
        const controlsHeight = 80;

        const availableWidth = this.stage.clientWidth;
        const availableHeight = window.innerHeight - headerHeight - padding - controlsHeight;
        const maxHeight = availableHeight * 0.95;

        const aspectRatio = 0.65;
        const isLandscape = window.innerWidth > window.innerHeight && window.innerWidth >= 768;

        let pageWidth, pageHeight;

        if (isLandscape) {
            const maxTotalWidth = availableWidth;
            pageWidth = maxTotalWidth / 2;
            pageHeight = pageWidth / aspectRatio;

            if (pageHeight > maxHeight) {
                pageHeight = maxHeight;
                pageWidth = pageHeight * aspectRatio;
            }
        } else {
            // Mobile: use available width without extra reduction
            pageWidth = availableWidth;
            pageHeight = pageWidth / aspectRatio;

            if (pageHeight > maxHeight) {
                pageHeight = maxHeight;
                pageWidth = pageHeight * aspectRatio;
            }
        }

        return {
            width: Math.round(pageWidth),
            height: Math.round(pageHeight)
        };
    }

    isLandscape() {
        return window.innerWidth > window.innerHeight && window.innerWidth >= 768;
    }

    buildPages() {
        // Clear previous
        this.flipbookEl.innerHTML = '';

        // Front cover
        const frontPage = document.createElement('div');
        frontPage.className = 'page page-cover';
        frontPage.dataset.density = 'hard';
        frontPage.innerHTML = `<img src="${this.coverFront}" alt="Cover">`;
        this.flipbookEl.appendChild(frontPage);

        // Content pages
        this.pages.forEach((src, i) => {
            const page = document.createElement('div');
            page.className = 'page';
            page.innerHTML = `<img src="${src}" alt="Page ${i + 1}">`;
            this.flipbookEl.appendChild(page);
        });

        // Back cover
        const backPage = document.createElement('div');
        backPage.className = 'page page-cover';
        backPage.dataset.density = 'hard';
        backPage.innerHTML = `<img src="${this.coverBack}" alt="Back Cover">`;
        this.flipbookEl.appendChild(backPage);
    }

    /**
     * Update wrapper position based on current state
     * - front-cover: center the single right page
     * - spread: center the spine (middle)
     * - back-cover: center the single left page
     */
    updateCentering(state) {
        const size = this.getSize();
        const isLandscape = this.isLandscape();

        this.currentState = state;
        this.wrapper.dataset.state = state;

        if (!isLandscape) {
            // Mobile: always centered, no translation needed
            this.wrapper.style.transform = 'translateX(0)';
            return;
        }

        // Desktop 2-page mode
        switch (state) {
            case 'front-cover':
                // Single page on RIGHT side of container
                // Need to shift LEFT so the page is centered
                this.wrapper.style.transform = `translateX(-${size.width / 2}px)`;
                break;

            case 'spread':
                // Both pages visible, center the spine (no translation)
                this.wrapper.style.transform = 'translateX(0)';
                break;

            case 'back-cover':
                // Single page on LEFT side of container
                // Need to shift RIGHT so the page is centered
                this.wrapper.style.transform = `translateX(${size.width / 2}px)`;
                break;

            default:
                this.wrapper.style.transform = 'translateX(0)';
        }
    }

    open() {
        console.log('=== OPEN START ===');
        console.log('isOpen:', this.isOpen, 'isAnimating:', this.isAnimating);

        if (this.isOpen || this.isAnimating) {
            console.log('BLOCKED - already open or animating');
            return;
        }
        this.isAnimating = true;

        const size = this.getSize();
        const landscape = this.isLandscape();
        console.log('Size:', size, 'Landscape:', landscape);

        // SAFETY: Clean up any leftover StPageFlip elements from previous session
        console.log('Cleaning up previous session...');
        console.log('pageFlip exists:', !!this.pageFlip);

        if (this.pageFlip) {
            try {
                this.pageFlip.destroy();
                console.log('pageFlip.destroy() called');
            } catch (e) {
                console.error('PageFlip cleanup ERROR:', e);
            }
            this.pageFlip = null;
        }

        // Re-find flipbookEl in case it was corrupted or removed
        // This ensures we always have a valid reference
        let flipbook = this.container.querySelector('.book-flipbook');
        if (!flipbook) {
            console.log('flipbookEl not found, creating new one...');
            flipbook = document.createElement('div');
            flipbook.className = 'book-flipbook';
            this.container.appendChild(flipbook);
        }
        this.flipbookEl = flipbook;

        // Clean any stray stf__ elements everywhere
        this.container.querySelectorAll('[class*="stf__"]').forEach(el => {
            console.log('Removing stf element:', el.className);
            el.remove();
        });
        this.stage.querySelectorAll('[class*="stf__"]').forEach(el => {
            console.log('Removing stf element from stage:', el.className);
            el.remove();
        });

        // Reset flipbook element completely
        this.flipbookEl.innerHTML = '';
        this.flipbookEl.style.cssText = '';
        this.flipbookEl.className = 'book-flipbook'; // Reset class in case library modified it

        console.log('Cleanup done. flipbookEl ready:', !!this.flipbookEl.parentNode);

        // Set CSS variable for sizing
        this.wrapper.style.setProperty('--page-width', `${size.width}px`);
        this.wrapper.style.setProperty('--page-height', `${size.height}px`);

        // Build pages
        this.buildPages();
        console.log('Pages built. flipbookEl children:', this.flipbookEl.children.length);
        console.log('Page elements:', this.flipbookEl.querySelectorAll('.page').length);

        // Show flipbook
        this.flipbookEl.style.display = 'block';
        console.log('flipbookEl display set to block');

        // Initialize PageFlip
        console.log('Creating new St.PageFlip...');
        this.pageFlip = new St.PageFlip(this.flipbookEl, {
            width: size.width,
            height: size.height,
            size: 'fixed',
            minWidth: 200,
            maxWidth: 1000,
            minHeight: 300,
            maxHeight: 1400,
            showCover: true,
            mobileScrollSupport: false,
            useMouseEvents: true,
            swipeDistance: 30,
            clickEventForward: true,
            usePortrait: !landscape,
            startPage: 0,
            drawShadow: true,
            flippingTime: this.FLIP_DURATION,
            startZIndex: 0,
            autoSize: false,
            maxShadowOpacity: 0.5,
            showPageCorners: true,
        });
        console.log('PageFlip created:', this.pageFlip);

        // Load pages
        const pageElements = this.flipbookEl.querySelectorAll('.page');
        console.log('Loading pages from HTML, count:', pageElements.length);
        this.pageFlip.loadFromHTML(pageElements);
        console.log('loadFromHTML done');
        console.log('PageFlip page count:', this.pageFlip.getPageCount());

        // Check what StPageFlip created
        console.log('stf__ elements AFTER loadFromHTML:', this.container.querySelectorAll('[class*="stf__"]').length);
        console.log('flipbookEl innerHTML length AFTER loadFromHTML:', this.flipbookEl.innerHTML.length);
        console.log('flipbookEl children AFTER loadFromHTML:', this.flipbookEl.children.length);

        // Listen for page changes to update centering
        this.pageFlip.on('flip', (e) => {
            const page = e.data;
            const totalPages = this.pageFlip.getPageCount();
            console.log('FLIP event - page:', page, 'total:', totalPages);

            if (page === 0) {
                this.updateCentering('front-cover');
            } else if (page >= totalPages - 1) {
                this.updateCentering('back-cover');
            } else {
                this.updateCentering('spread');
            }
        });

        // Mark as open (CSS hides cover via .is-open class)
        this.isOpen = true;
        this.wrapper.classList.add('is-open');
        this.entry.classList.add('is-reading');
        console.log('Classes added. wrapper.is-open:', this.wrapper.classList.contains('is-open'));

        // Set initial centering state (front cover)
        this.updateCentering('front-cover');

        // Add keyboard listener
        document.addEventListener('keydown', this.handleKeyDown);

        // Wait a moment, then flip to first content page
        setTimeout(() => {
            console.log('Flipping to page 1...');
            this.pageFlip.flip(1);
            this.isAnimating = false;
            console.log('=== OPEN COMPLETE ===');
        }, this.TRANSITION_DURATION);
    }

    close() {
        console.log('=== CLOSE START ===');
        console.log('isOpen:', this.isOpen, 'isAnimating:', this.isAnimating);

        if (!this.isOpen || this.isAnimating) {
            console.log('BLOCKED - not open or animating');
            return;
        }
        this.isAnimating = true;

        document.removeEventListener('keydown', this.handleKeyDown);

        // Flip back to front cover
        console.log('Flipping to page 0...');
        this.pageFlip.flip(0);

        // Wait for flip, then cleanup
        setTimeout(() => {
            console.log('First timeout done (FLIP_DURATION)');
            this.updateCentering('front-cover');

            setTimeout(() => {
                console.log('Second timeout done (TRANSITION_DURATION)');

                try {
                    // Destroy PageFlip instance
                    if (this.pageFlip) {
                        console.log('Calling pageFlip.destroy()...');
                        this.pageFlip.destroy();
                        this.pageFlip = null;
                    }

                    // Clean up ALL stf__ elements from entire stage
                    this.stage.querySelectorAll('[class*="stf__"]').forEach(el => {
                        console.log('Removing:', el.className);
                        el.remove();
                    });

                    // Ensure flipbookEl exists and is clean
                    let flipbook = this.container.querySelector('.book-flipbook');
                    if (!flipbook) {
                        console.log('flipbookEl was removed, recreating...');
                        flipbook = document.createElement('div');
                        flipbook.className = 'book-flipbook';
                        this.container.appendChild(flipbook);
                    }
                    this.flipbookEl = flipbook;
                    this.flipbookEl.innerHTML = '';
                    this.flipbookEl.style.cssText = '';
                    this.flipbookEl.className = 'book-flipbook';

                } catch (e) {
                    console.error('Cleanup error:', e);
                }

                // Reset state - ALWAYS do this, even if cleanup had errors
                this.cover.style.display = '';
                this.isOpen = false;
                this.isAnimating = false;
                this.currentState = 'closed';
                this.wrapper.classList.remove('is-open');
                this.wrapper.dataset.state = 'closed';
                this.wrapper.style.transform = '';
                this.entry.classList.remove('is-reading');

                console.log('=== CLOSE COMPLETE ===');
            }, this.TRANSITION_DURATION);
        }, this.FLIP_DURATION);
    }

    prev() {
        if (this.isAnimating) return;
        this.pageFlip?.flipPrev();
    }

    next() {
        if (this.isAnimating) return;
        this.pageFlip?.flipNext();
    }
}
