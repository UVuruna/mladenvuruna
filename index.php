<?php
/**
 * Mladen Vuruna - Homepage
 */

$basePath = "./";
require_once "{$basePath}config.php";
require_once "{$basePath}includes/db.php";

// Page configuration
$currentPage = 'home';
$pageTitle = null; // Will show default title
$pageDescription = 'Mladen Vuruna - srpski pisac i umetnik. Pogledajte knjige, eseje i umetničku galeriju.';

// Page-specific styles and scripts
$styles = ['home'];
$scripts = [];
?>
<!DOCTYPE html>
<html lang="sr">
<?php include "{$basePath}includes/head.php"; ?>
<body>
    <?php include "{$basePath}includes/loader.php"; ?>

    <?php include "{$basePath}includes/header.php"; ?>

    <main id="main-content">
        <!-- Hero Section -->
        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <h1 class="hero-title">Mladen Vuruna</h1>
                    <p class="hero-subtitle">Pisac i umetnik</p>
                    <p class="hero-description">
                        Dobrodošli u moj svet reči i slika. Ovde možete otkriti moje knjige,
                        eseje i umetnička dela.
                    </p>
                    <div class="hero-actions">
                        <a href="<?php echo $basePath; ?>pages/knjige/" class="btn btn-primary">Pogledaj knjige</a>
                        <a href="#kontakt" class="btn btn-secondary">Kontakt</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Books Preview Section -->
        <section class="section section-books">
            <div class="container">
                <h2 class="section-title">Knjige</h2>
                <p class="section-subtitle">Odlomci iz mojih knjiga</p>

                <div class="preview-grid">
                    <!-- Books will be loaded dynamically -->
                    <div class="preview-placeholder">
                        <p>Knjige uskoro...</p>
                    </div>
                </div>

                <div class="section-action">
                    <a href="<?php echo $basePath; ?>pages/knjige/" class="btn btn-secondary">Sve knjige</a>
                </div>
            </div>
        </section>

        <!-- Essays Preview Section -->
        <section class="section section-essays">
            <div class="container">
                <h2 class="section-title">Eseji</h2>
                <p class="section-subtitle">Misli i razmišljanja</p>

                <div class="preview-grid">
                    <!-- Essays will be loaded dynamically -->
                    <div class="preview-placeholder">
                        <p>Eseji uskoro...</p>
                    </div>
                </div>

                <div class="section-action">
                    <a href="<?php echo $basePath; ?>pages/eseji/" class="btn btn-secondary">Svi eseji</a>
                </div>
            </div>
        </section>

        <!-- Gallery Preview Section -->
        <section class="section section-gallery">
            <div class="container">
                <h2 class="section-title">Galerija</h2>
                <p class="section-subtitle">Umetnička dela</p>

                <div class="preview-grid gallery-grid">
                    <!-- Gallery items will be loaded dynamically -->
                    <div class="preview-placeholder">
                        <p>Galerija uskoro...</p>
                    </div>
                </div>

                <div class="section-action">
                    <a href="<?php echo $basePath; ?>pages/galerija/" class="btn btn-secondary">Cela galerija</a>
                </div>
            </div>
        </section>
    </main>

    <?php include "{$basePath}includes/footer.php"; ?>
</body>
</html>
