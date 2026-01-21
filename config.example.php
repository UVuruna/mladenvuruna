<?php
/**
 * Configuration file for Mladen Vuruna website
 *
 * SETUP:
 * 1. Copy this file to config.php
 * 2. Fill in your actual values
 * 3. Never commit config.php to git!
 */

define('CONFIG', [
    // Database
    'db_path' => __DIR__ . '/data/mvuruna.db',

    // Admin access
    'admin_ips' => [
        '127.0.0.1',           // localhost
        // Add Mladen's IP here
        // Add your IP here
    ],
    'admin_password_hash' => '', // Use password_hash('your_password', PASSWORD_DEFAULT)

    // Image conversion settings
    'image_sizes' => [
        'thumbnail' => ['width' => 400, 'quality' => 60],
        'medium'    => ['width' => 800, 'quality' => 75],
        'full'      => ['width' => 1200, 'quality' => 85],
    ],

    // Paths
    'upload_path' => __DIR__ . '/data/',
    'books_path'  => __DIR__ . '/data/books/',
    'essays_path' => __DIR__ . '/data/essays/',
    'gallery_path'=> __DIR__ . '/data/gallery/',
    'pdf_path'    => __DIR__ . '/data/pdf/',

    // Site info
    'site_name' => 'Mladen Vuruna',
    'site_url'  => 'https://mladenvuruna.com',

    // Analytics
    'track_analytics' => true,
    'geolocation_api' => 'http://ip-api.com/json/', // Free API, no key needed
]);

/**
 * Check if current visitor is admin (by IP)
 */
function isAdminIP(): bool {
    $visitor_ip = $_SERVER['REMOTE_ADDR'] ?? '';
    return in_array($visitor_ip, CONFIG['admin_ips']);
}

/**
 * Check if admin is logged in (session)
 */
function isAdminLoggedIn(): bool {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

/**
 * Verify admin password
 */
function verifyAdminPassword(string $password): bool {
    return password_verify($password, CONFIG['admin_password_hash']);
}

// Start session for admin features
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set timezone
date_default_timezone_set('Europe/Belgrade');
