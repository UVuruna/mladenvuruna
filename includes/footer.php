<?php
/**
 * Site footer with contact section
 */
?>

<!-- Contact Section -->
<section id="kontakt" class="contact-section">
    <div class="container">
        <h2>Kontakt</h2>
        <p class="contact-intro">Ostavite poruku ili komentar</p>

        <form id="contact-form" class="contact-form" method="post" action="<?php echo $basePath; ?>api/comments.php">
            <input type="hidden" name="action" value="submit">
            <input type="hidden" name="content_id" value="<?php echo $contentId ?? ''; ?>">

            <!-- Honeypot field for spam protection -->
            <div class="hp-field" aria-hidden="true">
                <input type="text" name="website" tabindex="-1" autocomplete="off">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="contact-name">Ime (opciono)</label>
                    <input type="text" id="contact-name" name="author_name" maxlength="100">
                </div>
                <div class="form-group">
                    <label for="contact-email">Email (opciono)</label>
                    <input type="email" id="contact-email" name="author_email" maxlength="255">
                </div>
            </div>

            <div class="form-group">
                <label for="contact-message">Poruka *</label>
                <textarea id="contact-message" name="message" rows="5" required maxlength="2000"></textarea>
            </div>

            <button type="submit" class="btn btn-primary">Pošalji poruku</button>
        </form>
    </div>
</section>

<!-- Footer -->
<footer id="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-brand">
                <span class="footer-logo">Mladen Vuruna</span>
                <p class="footer-tagline">Pisac i umetnik</p>
            </div>

            <nav class="footer-nav" aria-label="Footer navigacija">
                <a href="<?php echo $basePath; ?>">Početna</a>
                <a href="<?php echo $basePath; ?>pages/knjige/">Knjige</a>
                <a href="<?php echo $basePath; ?>pages/eseji/">Eseji</a>
                <a href="<?php echo $basePath; ?>pages/galerija/">Galerija</a>
            </nav>
        </div>

        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> Mladen Vuruna. Sva prava zadržana.</p>
        </div>
    </div>
</footer>

<!-- Base scripts -->
<script src="<?php echo $basePath; ?>assets/js/main.js"></script>

<!-- Library scripts (third-party) - must load before page scripts -->
<?php if (isset($libraries) && is_array($libraries)): ?>
    <?php foreach ($libraries as $lib): ?>
<script src="<?php echo $basePath; ?>assets/libraries/<?php echo $lib; ?>.js"></script>
    <?php endforeach; ?>
<?php endif; ?>

<!-- Page-specific scripts -->
<?php if (isset($scripts) && is_array($scripts)): ?>
    <?php foreach ($scripts as $script): ?>
<script src="<?php echo $basePath; ?>assets/js/<?php echo $script; ?>.js"></script>
    <?php endforeach; ?>
<?php endif; ?>

<!-- Analytics (if enabled) -->
<?php if (CONFIG['track_analytics']): ?>
<script src="<?php echo $basePath; ?>assets/js/analytics.js"></script>
<?php endif; ?>
