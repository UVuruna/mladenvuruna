<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php echo $pageDescription ?? 'Mladen Vuruna - pisac i umetnik. Knjige, eseji i umetnička dela.'; ?>">
    <meta name="author" content="Mladen Vuruna">

    <title><?php echo isset($pageTitle) ? "$pageTitle | Mladen Vuruna" : 'Mladen Vuruna - Pisac i Umetnik'; ?></title>

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="<?php echo $basePath; ?>assets/img/favicon.svg">

    <!-- Preload critical fonts -->
    <?php if (isset($preloadFonts) && $preloadFonts): ?>
    <link rel="preload" href="<?php echo $basePath; ?>assets/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
    <?php endif; ?>

    <!-- Admin flag for JS (debug logging) -->
    <script>window.MV_IS_ADMIN = <?php echo isAdminIP() ? 'true' : 'false'; ?>;</script>

    <!-- Base styles (always loaded) -->
    <link rel="stylesheet" href="<?php echo $basePath; ?>assets/css/root.css">
    <link rel="stylesheet" href="<?php echo $basePath; ?>assets/css/loader.css">
    <link rel="stylesheet" href="<?php echo $basePath; ?>assets/css/header.css">
    <link rel="stylesheet" href="<?php echo $basePath; ?>assets/css/footer.css">
    <link rel="stylesheet" href="<?php echo $basePath; ?>assets/css/theme-switch.css">

    <!-- Theme switch (loaded early to prevent flash) -->
    <script src="<?php echo $basePath; ?>assets/js/themeSwitch.js"></script>

    <!-- Page-specific styles -->
    <?php if (isset($styles) && is_array($styles)): ?>
        <?php foreach ($styles as $style): ?>
    <link rel="stylesheet" href="<?php echo $basePath; ?>assets/css/<?php echo $style; ?>.css">
        <?php endforeach; ?>
    <?php endif; ?>

    <!-- StPageFlip library (for book reader) -->
    <?php if (in_array('book-reader', $styles ?? [])): ?>
    <script src="https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js"></script>
    <?php endif; ?>

    <!-- Open Graph -->
    <meta property="og:title" content="<?php echo $pageTitle ?? 'Mladen Vuruna'; ?>">
    <meta property="og:description" content="<?php echo $pageDescription ?? 'Pisac i umetnik'; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo CONFIG['site_url'] . ($_SERVER['REQUEST_URI'] ?? ''); ?>">
    <meta property="og:image" content="<?php echo CONFIG['site_url']; ?>/assets/img/og-image.jpg">

    <!-- Theme color -->
    <meta name="theme-color" content="#1a1a2e">
</head>
