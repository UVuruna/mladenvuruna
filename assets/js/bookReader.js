/**
 * BookReader - Using StPageFlip library
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
        this.cover = container.querySelector('.book-cover');
        this.flipbookEl = container.querySelector('.book-flipbook');
        this.controls = container.querySelector('.book-controls');

        this.pages = JSON.parse(container.dataset.pages || '[]');
        this.coverFront = container.dataset.front;
        this.coverBack = container.dataset.back;

        this.pageFlip = null;
        this.isOpen = false;

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
        if (!this.isOpen) return;

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

    getSize() {
        // Responsive sizing
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const isLandscape = vw > vh;

        let width, height;

        if (isLandscape) {
            // Desktop: 2-page view, each page ~30% of viewport width
            height = Math.min(vh * 0.7, 600);
            width = height * 0.65;
        } else {
            // Mobile: 1-page view, ~85% of viewport width
            width = Math.min(vw * 0.85, 400);
            height = width / 0.65;
        }

        return { width: Math.round(width), height: Math.round(height) };
    }

    buildPages() {
        // Clear previous
        this.flipbookEl.innerHTML = '';

        // Front cover
        const frontPage = document.createElement('div');
        frontPage.className = 'page page-cover';
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
        backPage.innerHTML = `<img src="${this.coverBack}" alt="Back Cover">`;
        this.flipbookEl.appendChild(backPage);
    }

    open() {
        if (this.isOpen) return;

        const size = this.getSize();
        const isLandscape = window.innerWidth > window.innerHeight;

        this.buildPages();

        // Hide cover, show flipbook
        this.cover.style.display = 'none';
        this.flipbookEl.style.display = 'block';
        this.controls.style.display = 'flex';

        // Initialize PageFlip
        this.pageFlip = new St.PageFlip(this.flipbookEl, {
            width: size.width,
            height: size.height,
            size: 'stretch',
            minWidth: 200,
            maxWidth: 600,
            minHeight: 300,
            maxHeight: 900,
            showCover: true,
            mobileScrollSupport: false,
            useMouseEvents: true,
            swipeDistance: 30,
            clickEventForward: true,
            usePortrait: !isLandscape,
            startPage: 0,
            drawShadow: true,
            flippingTime: 800,
            startZIndex: 0,
            autoSize: true,
            maxShadowOpacity: 0.5,
            showPageCorners: true,
        });

        // Load pages
        this.pageFlip.loadFromHTML(this.flipbookEl.querySelectorAll('.page'));

        this.isOpen = true;
        this.container.classList.add('is-open');

        // Add keyboard listener
        document.addEventListener('keydown', this.handleKeyDown);

        // Flip to first content page
        setTimeout(() => this.pageFlip.flip(1), 100);
    }

    close() {
        if (!this.isOpen) return;

        // Remove keyboard listener
        document.removeEventListener('keydown', this.handleKeyDown);

        // Flip back to cover first
        this.pageFlip.flip(0);

        setTimeout(() => {
            this.pageFlip.destroy();
            this.pageFlip = null;

            this.flipbookEl.style.display = 'none';
            this.flipbookEl.innerHTML = '';
            this.controls.style.display = 'none';
            this.cover.style.display = 'block';

            this.isOpen = false;
            this.container.classList.remove('is-open');
        }, 500);
    }

    prev() {
        this.pageFlip?.flipPrev();
    }

    next() {
        this.pageFlip?.flipNext();
    }
}
