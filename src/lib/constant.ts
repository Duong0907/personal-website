export const FALLBACK_CARD_IMAGE_URL = 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg';

// Notion file URLs (S3 presigned) expire after ~1 hour; refresh the cache
// slightly before that so image URLs never go stale between real edits.
export const NOTION_IMAGE_URL_CACHE_TTL_SECONDS = 55 * 60;

// Server-only; set the real value in .env.local before deploying.
// Falls back to localhost so dev/sitemap/OG-image generation still work unset.
export const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
