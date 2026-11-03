/**
 * @jest-environment node
 */
import { getNotionImageUrl } from '@/features/notion/services/image';
import { GET } from '../route';

jest.mock('@/features/notion/services/image', () => ({ getNotionImageUrl: jest.fn() }));

const ID = '32ffbda4-1c7a-8075-b628-d1509e13bebc';
const SIGNED_URL = 'https://prod-files-secure.s3.us-west-2.amazonaws.com/a.png?X-Amz-Signature=x';

const thumbnailUrl = jest.mocked(getNotionImageUrl);

function get(id: string) {
  return GET(new Request(`http://localhost/api/notion-image/${id}`), { params: Promise.resolve({ id }) });
}

function mockUpstream(response: Response) {
  return jest.spyOn(global, 'fetch').mockResolvedValue(response);
}

describe('GET /api/notion-image/[id]', () => {
  it('streams the freshly signed image with a cache header', async () => {
    thumbnailUrl.mockResolvedValue(SIGNED_URL);
    const fetchSpy = mockUpstream(new Response('png-bytes', { headers: { 'Content-Type': 'image/png' } }));

    const res = await get(ID);

    expect(fetchSpy).toHaveBeenCalledWith(SIGNED_URL, { signal: expect.any(AbortSignal) });
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/png');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600');
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(res.headers.get('Content-Security-Policy')).toBe("default-src 'none'");
    await expect(res.text()).resolves.toBe('png-bytes');
  });

  it('returns 404 without calling Notion for an id that is not a Notion id', async () => {
    const res = await get('../secret');

    expect(res.status).toBe(404);
    expect(thumbnailUrl).not.toHaveBeenCalled();
  });

  it('returns 404 when the project has no servable image', async () => {
    thumbnailUrl.mockResolvedValue(null);

    const res = await get(ID);

    expect(res.status).toBe(404);
  });

  it('returns 502 when the upstream request fails', async () => {
    thumbnailUrl.mockResolvedValue(SIGNED_URL);
    mockUpstream(new Response('expired', { status: 403, headers: { 'Content-Type': 'image/png' } }));

    expect((await get(ID)).status).toBe(502);
  });

  it('returns 502 when the upstream request throws', async () => {
    thumbnailUrl.mockResolvedValue(SIGNED_URL);
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('network'));

    expect((await get(ID)).status).toBe(502);
  });

  it('returns 502 when the upstream file is not an image', async () => {
    thumbnailUrl.mockResolvedValue(SIGNED_URL);
    mockUpstream(new Response('<script>', { headers: { 'Content-Type': 'text/html' } }));

    expect((await get(ID)).status).toBe(502);
  });
});
