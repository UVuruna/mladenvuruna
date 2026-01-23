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
        if (this.isOpen || this.isAnimating) return;
        this.isAnimating = true;

        const size = this.getSize();
        const landscape = this.isLandscape();

        // Set CSS variable for sizing
        this.wrapper.style.setProperty('--page-width', `${size.width}px`);
        this.wrapper.style.setProperty('--page-height', `${size.height}px`);

        // Build pages
        this.buildPages();

        // Show flipbook
        this.flipbookEl.style.display = 'block';

        // Initialize PageFlip
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

        // Load pages
        this.pageFlip.loadFromHTML(this.flipbookEl.querySelectorAll('.page'));

        // Listen for page changes to update centering
        this.pageFlip.on('flip', (e) => {
            const page = e.data;
            const totalPages = this.pageFlip.getPageCount();

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

        // Set initial centering state (front cover)
        this.updateCentering('front-cover');

        // Add keyboard listener
        document.addEventListener('keydown', this.handleKeyDown);

        // Wait a moment, then flip to first content page
        setTimeout(() => {
            this.pageFlip.flip(1);
            this.isAnimating = false;
        }, this.TRANSITION_DURATION);
    }

    close() {
        if (!this.isOpen || this.isAnimating) return;
        this.isAnimating = true;

        document.removeEventListener('keydown', this.handleKeyDown);

        // Flip back to front cover
        this.pageFlip.flip(0);

        // Wait for flip, then cleanup
        setTimeout(() => {
            this.updateCentering('front-cover');

            setTimeout(() => {
                this.pageFlip.destroy();
                this.pageFlip = null;

                this.flipbookEl.style.display = 'none';
                this.flipbookEl.innerHTML = '';
                this.cover.style.display = '';

                this.isOpen = false;
                this.isAnimating = false;
                this.currentState = 'closed';
                this.wrapper.classList.remove('is-open');
                this.wrapper.dataset.state = 'closed';
                this.wrapper.style.transform = '';
                this.entry.classList.remove('is-reading');
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
