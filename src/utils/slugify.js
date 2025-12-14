// src/utils/slugify.js

const MAX_ID_LEN = 36;
const VALID_CHARS_RE = /[^a-zA-Z0-9_-]/g;

/**
 * Converts a name into a URL-safe slug suitable for use as a document ID
 * @param {string} name - The name to slugify
 * @returns {string} - A slugified ID
 */
export function slugify(name) {
    if (!name) {
        return "item";
    }

    // Strip whitespace and replace spaces with underscores
    let slug = name.trim().replace(/\s+/g, "_");
    
    // Remove invalid characters
    slug = slug.replace(VALID_CHARS_RE, "");

    // Ensure slug starts with alphanumeric character
    if (!slug || !/^[a-zA-Z0-9]/.test(slug)) {
        slug = "x_" + slug;
    }

    // Truncate if too long and add hash suffix
    if (slug.length > MAX_ID_LEN) {
        // Simple hash function for browser compatibility
        const hash = simpleHash(slug).substring(0, 6);
        slug = slug.substring(0, MAX_ID_LEN - 7) + "-" + hash;
    }

    return slug;
}

/**
 * Simple hash function for generating short hashes in the browser
 * @param {string} str - The string to hash
 * @returns {string} - A hexadecimal hash string
 */
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    // Convert to positive hex string
    return Math.abs(hash).toString(16);
}