export const FALLBACK_CARD_IMAGE_URL = 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg';

// Notion file URLs (S3 presigned) expire after ~1 hour; refresh the cache
// slightly before that so image URLs never go stale between real edits.
export const NOTION_IMAGE_URL_CACHE_TTL_SECONDS = 55 * 60;

// Server-only; set the real value in .env.local before deploying.
// Falls back to localhost so dev/sitemap/OG-image generation still work unset.
export const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

// Server-only; read it from a server component only. Without a NEXT_PUBLIC_
// prefix, a client component would inline this as the fallback at build time.
// The document is hosted off-site and updated live, so this is a URL, not a file.
export const RESUME_URL = process.env.RESUME_URL || 'https://black-korrie-48.tiiny.site/';
