<?php
/**
 * Site header with navigation
 * Shows admin button only for whitelisted IPs
 */
?>

<header id="header">
    <div class="header-container">
        <!-- Logo -->
        <a href="<?php echo $basePath; ?>" class="logo" aria-label="Početna strana">
            <span class="logo-text">Mladen Vuruna</span>
        </a>

        <!-- Mobile menu button -->
        <button id="menu-toggle" class="menu-toggle" aria-label="Otvori meni" aria-expanded="false">
            <span class="hamburger"></span>
        </button>

        <!-- Navigation -->
        <nav id="main-nav" class="main-nav" aria-label="Glavna navigacija">
            <ul class="nav-list">
                <li><a href="<?php echo $basePath; ?>" class="<?php echo ($currentPage ?? '') === 'home' ? 'active' : ''; ?>">Početna</a></li>
                <li><a href="<?php echo $basePath; ?>pages/knjige/" class="<?php echo ($currentPage ?? '') === 'knjige' ? 'active' : ''; ?>">Knjige</a></li>
                <li><a href="<?php echo $basePath; ?>pages/eseji/" class="<?php echo ($currentPage ?? '') === 'eseji' ? 'active' : ''; ?>">Eseji</a></li>
                <li><a href="<?php echo $basePath; ?>pages/galerija/" class="<?php echo ($currentPage ?? '') === 'galerija' ? 'active' : ''; ?>">Galerija</a></li>
                <li><a href="#kontakt" class="nav-contact">Kontakt</a></li>
            </ul>
        </nav>

        <?php if (isAdminIP()): ?>
        <!-- Admin button (only visible to whitelisted IPs) -->
        <button id="admin-toggle" class="admin-toggle" aria-label="Admin pristup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-6a3 3 0 100-6 3 3 0 000 6z"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
        </button>
        <?php endif; ?>

        <!-- Theme switch (day/night) -->
        <label class="theme-switch" aria-label="Prebaci temu dan/noć">
            <input type="checkbox" id="theme-switch-input" class="theme-switch__input">
            <span class="theme-switch__track">
                <!-- SVG Backgrounds (contain stars/clouds) -->
                <span class="theme-switch__night-bg"></span>
                <span class="theme-switch__day-bg"></span>
                <!-- Toggle (sun/moon) -->
                <span class="theme-switch__toggle">
                    <span class="theme-switch__moon">
                        <span class="theme-switch__crater theme-switch__crater--1"></span>
                        <span class="theme-switch__crater theme-switch__crater--2"></span>
                        <span class="theme-switch__crater theme-switch__crater--3"></span>
                    </span>
                    <span class="theme-switch__sun"></span>
                </span>
            </span>
        </label>
    </div>
</header>

<?php if (isAdminIP()): ?>
<!-- Admin password modal -->
<div id="admin-modal" class="modal" role="dialog" aria-labelledby="admin-modal-title" aria-hidden="true">
    <div class="modal-overlay"></div>
    <div class="modal-content">
        <h2 id="admin-modal-title">Admin Pristup</h2>
        <form id="admin-form" method="post" action="<?php echo $basePath; ?>api/admin.php">
            <input type="hidden" name="action" value="login">
            <!-- Hidden username field for password managers and accessibility -->
            <input type="text"
                   name="username"
                   value="admin"
                   autocomplete="username"
                   class="visually-hidden"
                   tabindex="-1"
                   aria-hidden="true">
            <div class="form-group">
                <label for="admin-password">Lozinka:</label>
                <input type="password" id="admin-password" name="password" required autocomplete="current-password">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Otkaži</button>
                <button type="submit" class="btn btn-primary">Pristupi</button>
            </div>
        </form>
    </div>
</div>
<?php endif; ?>
