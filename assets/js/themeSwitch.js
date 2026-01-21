/**
 * Theme Switch - Day/Night mode with sunrise/sunset calculation
 * Default location: Belgrade (44.82°N, 20.46°E)
 */

const ThemeSwitch = (function() {
    'use strict';

    // Belgrade coordinates (hardcoded)
    const BELGRADE_LAT = 44.82;
    const BELGRADE_LNG = 20.46;

    // Storage key
    const STORAGE_KEY = 'mv_theme_preference';

    // DOM elements
    let switchInput = null;
    let switchContainer = null;

    // Transition duration (must match CSS --wipe-duration)
    const WIPE_DURATION = 600;

    /**
     * Calculate day of year (1-365)
     * @param {Date} date
     * @returns {number}
     */
    function getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    /**
     * Convert degrees to radians
     * @param {number} degrees
     * @returns {number}
     */
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Convert radians to degrees
     * @param {number} radians
     * @returns {number}
     */
    function toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    /**
     * Calculate sunrise and sunset times for a given date and location
     * Based on NOAA Solar Calculator algorithm
     * @param {Date} date
     * @param {number} latitude
     * @param {number} longitude
     * @returns {{sunrise: Date, sunset: Date}}
     */
    function calculateSunTimes(date, latitude, longitude) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const dayOfYear = getDayOfYear(date);

        // Fractional year (gamma) in radians
        const gamma = (2 * Math.PI / 365) * (dayOfYear - 1);

        // Equation of time (in minutes)
        const eqTime = 229.18 * (
            0.000075 +
            0.001868 * Math.cos(gamma) -
            0.032077 * Math.sin(gamma) -
            0.014615 * Math.cos(2 * gamma) -
            0.040849 * Math.sin(2 * gamma)
        );

        // Solar declination (in radians)
        const decl = 0.006918 -
            0.399912 * Math.cos(gamma) +
            0.070257 * Math.sin(gamma) -
            0.006758 * Math.cos(2 * gamma) +
            0.000907 * Math.sin(2 * gamma) -
            0.002697 * Math.cos(3 * gamma) +
            0.00148 * Math.sin(3 * gamma);

        // Hour angle for sunrise/sunset (in degrees)
        const latRad = toRadians(latitude);
        const zenith = toRadians(90.833); // Official zenith for sunrise/sunset

        const cosHourAngle = (Math.cos(zenith) / (Math.cos(latRad) * Math.cos(decl))) -
            (Math.tan(latRad) * Math.tan(decl));

        // Clamp to valid range (handles polar day/night)
        const clampedCos = Math.max(-1, Math.min(1, cosHourAngle));
        const hourAngle = toDegrees(Math.acos(clampedCos));

        // Solar noon in minutes from midnight UTC
        // longitude correction: 4 minutes per degree (360° = 1440 minutes)
        const solarNoonUTC = 720 - eqTime - (4 * longitude);

        // Sunrise and sunset in minutes from midnight UTC
        const sunriseUTC = solarNoonUTC - (hourAngle * 4);
        const sunsetUTC = solarNoonUTC + (hourAngle * 4);

        // Create dates using UTC - they will display in local time automatically
        const sunrise = new Date(Date.UTC(year, month, day, 0, Math.round(sunriseUTC)));
        const sunset = new Date(Date.UTC(year, month, day, 0, Math.round(sunsetUTC)));

        return { sunrise, sunset };
    }

    /**
     * Format time as HH:MM
     * @param {Date} date
     * @returns {string}
     */
    function formatTime(date) {
        return date.toLocaleTimeString('sr-RS', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    /**
     * Determine if it's currently daytime
     * @returns {boolean}
     */
    function isDaytime() {
        const now = new Date();
        const { sunrise, sunset } = calculateSunTimes(now, BELGRADE_LAT, BELGRADE_LNG);

        const isDay = now >= sunrise && now < sunset;

        // Debug logging (only for admin)
        if (window.MV_IS_ADMIN) {
            console.group('🌅 Theme Switch - Sunrise/Sunset Calculation');
            console.log('Location: Belgrade (44.82°N, 20.46°E)');
            console.log('Current time:', formatTime(now));
            console.log('Sunrise:', formatTime(sunrise));
            console.log('Sunset:', formatTime(sunset));
            console.log('Is daytime:', isDay);
            console.groupEnd();
        }

        return isDay;
    }

    /**
     * Get the appropriate theme based on time or user preference
     * @returns {'light' | 'dark'}
     */
    function getInitialTheme() {
        // Check sessionStorage for user preference
        const stored = sessionStorage.getItem(STORAGE_KEY);

        if (stored) {
            if (window.MV_IS_ADMIN) {
                console.log('🎨 Theme: Using stored preference:', stored);
            }
            return stored;
        }

        // Calculate based on sunrise/sunset
        const theme = isDaytime() ? 'light' : 'dark';

        if (window.MV_IS_ADMIN) {
            console.log('🎨 Theme: Calculated from sun position:', theme);
        }

        return theme;
    }

    /**
     * Apply theme to document
     * @param {'light' | 'dark'} theme
     */
    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        // Sync checkbox state
        if (switchInput) {
            switchInput.checked = theme === 'light';
        }
    }

    /**
     * Toggle theme and save preference
     * Handles bidirectional wipe animation
     */
    function toggleTheme() {
        const currentTheme = document.documentElement.hasAttribute('data-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // Set transition direction class BEFORE applying theme
        if (switchContainer) {
            // Remove any existing direction class
            switchContainer.classList.remove('theme-switch--to-day', 'theme-switch--to-night');

            // Add appropriate direction class
            if (newTheme === 'light') {
                // Going to DAY: wipe from LEFT to RIGHT
                switchContainer.classList.add('theme-switch--to-day');
            } else {
                // Going to NIGHT: wipe from RIGHT to LEFT
                switchContainer.classList.add('theme-switch--to-night');
            }
        }

        applyTheme(newTheme);
        sessionStorage.setItem(STORAGE_KEY, newTheme);

        if (window.MV_IS_ADMIN) {
            console.log('🎨 Theme: User toggled to:', newTheme);
        }

        // Remove direction class after transition completes
        setTimeout(() => {
            if (switchContainer) {
                switchContainer.classList.remove('theme-switch--to-day', 'theme-switch--to-night');
            }
        }, WIPE_DURATION + 50);
    }

    /**
     * Initialize theme switch
     */
    function init() {
        // Apply initial theme immediately (before DOM ready to prevent flash)
        const initialTheme = getInitialTheme();
        applyTheme(initialTheme);

        // Wait for DOM to set up event listener
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupEventListener);
        } else {
            setupEventListener();
        }
    }

    /**
     * Set up event listener for toggle
     */
    function setupEventListener() {
        switchInput = document.getElementById('theme-switch-input');
        switchContainer = document.querySelector('.theme-switch');

        if (switchInput) {
            // Sync initial state
            const currentTheme = document.documentElement.hasAttribute('data-theme') ? 'light' : 'dark';
            switchInput.checked = currentTheme === 'light';

            // Listen for changes
            switchInput.addEventListener('change', toggleTheme);
        }
    }

    // Public API
    return {
        init: init,
        isDaytime: isDaytime,
        getTheme: function() {
            return document.documentElement.hasAttribute('data-theme') ? 'light' : 'dark';
        }
    };
})();

// Initialize immediately
ThemeSwitch.init();
