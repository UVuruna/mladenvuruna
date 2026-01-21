<?php
/**
 * Loading screen - hides layout shifts during page load
 */
?>

<div id="loader" class="loader" aria-hidden="true">
    <div class="loader-content">
        <div class="loader-logo">
            <span>MV</span>
        </div>
        <div class="loader-spinner"></div>
    </div>
</div>

<script>
// Hide loader when page is fully loaded
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('loaded');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});
</script>
