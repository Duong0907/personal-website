export const FALLBACK_CARD_IMAGE_URL = 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg';

// Notion file URLs (S3 presigned) expire after ~1 hour; refresh the cache
// slightly before that so image URLs never go stale between real edits.
export const NOTION_IMAGE_URL_CACHE_TTL_SECONDS = 55 * 60;
