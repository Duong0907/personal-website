/**
 * @jest-environment node
 */
import { createHmac } from 'crypto';
import { revalidateTag } from 'next/cache';
import { POST } from '../route';

jest.mock('next/cache', () => ({ revalidateTag: jest.fn() }));

const SECRET = 'test-secret';
const EVENT_BODY = JSON.stringify({ type: 'page.content_updated', entity: { id: 'abc' } });

function sign(body: string) {
  return `sha256=${createHmac('sha256', SECRET).update(body).digest('hex')}`;
}

function makeRequest(body: string, signature?: string) {
  const headers = new Headers({ 'Content-Type': 'application/json' });

  if (signature !== undefined) {
    headers.set('X-Notion-Signature', signature);
  }

  return new Request('http://localhost/api/notion-webhook', { method: 'POST', body, headers });
}

beforeEach(() => {
  process.env.NOTION_WEBHOOK_SECRET = SECRET;
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  delete process.env.NOTION_WEBHOOK_SECRET;
});

describe('POST /api/notion-webhook', () => {
  it('returns 400 for a body that is not JSON', async () => {
    const res = await POST(makeRequest('not json', sign('not json')));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: 'Invalid JSON body' });
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('returns 200 for a verification handshake without a signature', async () => {
    const res = await POST(makeRequest(JSON.stringify({ verification_token: 'tok' })));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('handles the handshake even when the secret is not configured', async () => {
    delete process.env.NOTION_WEBHOOK_SECRET;

    const res = await POST(makeRequest(JSON.stringify({ verification_token: 'tok' })));

    expect(res.status).toBe(200);
  });

  it('returns 500 when the secret is not configured', async () => {
    delete process.env.NOTION_WEBHOOK_SECRET;

    const res = await POST(makeRequest(EVENT_BODY, sign(EVENT_BODY)));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: 'Webhook not configured' });
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('returns 401 for an event without a signature', async () => {
    const res = await POST(makeRequest(EVENT_BODY));

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: 'Invalid signature' });
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('returns 401 for an event with a wrong signature', async () => {
    const res = await POST(makeRequest(EVENT_BODY, sign('{"other":true}')));

    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('returns 401 for a signed handshake-shaped body with a bad signature', async () => {
    const res = await POST(makeRequest(JSON.stringify({ verification_token: 'tok' }), 'sha256=bad'));

    expect(res.status).toBe(401);
  });

  it('revalidates the notion tag for a correctly signed event', async () => {
    const res = await POST(makeRequest(EVENT_BODY, sign(EVENT_BODY)));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(revalidateTag).toHaveBeenCalledTimes(1);
    expect(revalidateTag).toHaveBeenCalledWith('notion', { expire: 0 });
  });
});
