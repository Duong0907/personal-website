import { NextResponse } from 'next/server';
import { getNotionImageUrl } from '@/features/notion/services/image';

const NOTION_ID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

// shortcut: a changed image can take a few hours to show (image optimizer cache), add a version query if that matters.
const CACHE_CONTROL = 'public, max-age=3600';
const UPSTREAM_TIMEOUT_MS = 10_000;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const url = NOTION_ID.test(id) ? await getNotionImageUrl(id) : null;

  if (!url) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const upstreamResponse = await fetch(url, { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) }).catch(() => null);
  const contentType = upstreamResponse?.headers.get('Content-Type') ?? '';

  // Serve images only, so a non-image file in Notion is never returned from this origin.
  if (!upstreamResponse?.ok || !upstreamResponse.body || !contentType.startsWith('image/')) {
    return NextResponse.json({ error: 'Image unavailable' }, { status: 502 });
  }

  return new Response(upstreamResponse.body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': CACHE_CONTROL,
      'X-Content-Type-Options': 'nosniff',
      // Blocks scripts in an SVG opened directly from this origin.
      'Content-Security-Policy': "default-src 'none'",
    },
  });
}
