<?php
/**
 * Database connection and initialization
 */

require_once __DIR__ . '/../config.php';

/**
 * Get SQLite database connection (singleton pattern)
 */
function getDB(): PDO {
    static $db = null;

    if ($db === null) {
        $dbPath = CONFIG['db_path'];
        $dbDir = dirname($dbPath);

        // Create data directory if it doesn't exist
        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0755, true);
        }

        $isNewDb = !file_exists($dbPath);

        $db = new PDO("sqlite:$dbPath");
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        // Enable foreign keys
        $db->exec("PRAGMA foreign_keys = ON");

        // Initialize tables if new database
        if ($isNewDb) {
            initializeTables($db);
        }
    }

    return $db;
}

/**
 * Create database tables
 */
function initializeTables(PDO $db): void {
    $db->exec("
        -- Content table (books, essays, art)
        CREATE TABLE IF NOT EXISTS content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL CHECK(type IN ('book', 'essay', 'art')),
            title TEXT NOT NULL,
            description TEXT,
            cover_image TEXT,
            page_count INTEGER DEFAULT 0,
            pdf_path TEXT,
            sort_order INTEGER DEFAULT 0,
            is_visible INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Pages for books and essays
        CREATE TABLE IF NOT EXISTS pages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content_id INTEGER NOT NULL,
            page_number INTEGER NOT NULL,
            thumbnail_path TEXT,
            medium_path TEXT,
            full_path TEXT,
            FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
            UNIQUE(content_id, page_number)
        );

        -- Visitors tracking
        CREATE TABLE IF NOT EXISTS visitors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT NOT NULL,
            country TEXT,
            city TEXT,
            user_agent TEXT,
            first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
            visit_count INTEGER DEFAULT 1
        );

        -- Page views
        CREATE TABLE IF NOT EXISTS page_views (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            visitor_id INTEGER NOT NULL,
            page_url TEXT NOT NULL,
            time_spent INTEGER DEFAULT 0,
            visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE
        );

        -- Comments
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            visitor_id INTEGER,
            content_id INTEGER,
            author_name TEXT,
            author_email TEXT,
            message TEXT NOT NULL,
            is_approved INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE SET NULL,
            FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
        CREATE INDEX IF NOT EXISTS idx_content_visible ON content(is_visible);
        CREATE INDEX IF NOT EXISTS idx_visitors_ip ON visitors(ip_address);
        CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views(visitor_id);
        CREATE INDEX IF NOT EXISTS idx_comments_content ON comments(content_id);
    ");
}
