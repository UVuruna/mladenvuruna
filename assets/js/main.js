/**
 * Main JavaScript - Core functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initAdminModal();
    initSmoothScroll();
});

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close menu when clicking on a link
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.setAttribute('aria-expanded', 'false');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            menuToggle.setAttribute('aria-expanded', 'false');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Admin modal functionality
 */
function initAdminModal() {
    const adminToggle = document.getElementById('admin-toggle');
    const adminModal = document.getElementById('admin-modal');

    if (!adminToggle || !adminModal) return;

    adminToggle.addEventListener('click', function() {
        openAdminModal();
    });

    // Close on overlay click
    const overlay = adminModal.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeAdminModal);
    }

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && adminModal.classList.contains('active')) {
            closeAdminModal();
        }
    });
}

/**
 * Open admin modal
 */
function openAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        // Focus password input
        const passwordInput = modal.querySelector('input[type="password"]');
        if (passwordInput) {
            setTimeout(() => passwordInput.focus(), 100);
        }
    }
}

/**
 * Close admin modal
 */
function closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');

        // Clear password field
        const passwordInput = modal.querySelector('input[type="password"]');
        if (passwordInput) {
            passwordInput.value = '';
        }
    }
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();

                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Make closeAdminModal available globally for onclick handlers
window.closeAdminModal = closeAdminModal;
