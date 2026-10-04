import { createHmac } from 'crypto';
import { revalidateTag } from 'next/cache';
import { isSignatureValid, isVerificationHandshake, revalidateNotionRoutes } from '../services';

jest.mock('next/cache', () => ({ revalidateTag: jest.fn() }));

const SECRET = 'test-secret';
const BODY = JSON.stringify({ type: 'page.content_updated' });

function sign(body: string, secret: string) {
  return `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
}

describe('isSignatureValid', () => {
  it('accepts a signature made with the same secret and body', () => {
    expect(isSignatureValid(BODY, sign(BODY, SECRET), SECRET)).toBe(true);
  });

  it('rejects a signature made with a different secret', () => {
    expect(isSignatureValid(BODY, sign(BODY, 'other-secret'), SECRET)).toBe(false);
  });

  it('rejects a signature when the body was changed', () => {
    expect(isSignatureValid(`${BODY} `, sign(BODY, SECRET), SECRET)).toBe(false);
  });

  it('rejects a signature without the sha256= prefix', () => {
    const bare = createHmac('sha256', SECRET).update(BODY).digest('hex');

    expect(isSignatureValid(BODY, bare, SECRET)).toBe(false);
  });

  it('rejects a signature of a different length without throwing', () => {
    expect(isSignatureValid(BODY, 'sha256=abc', SECRET)).toBe(false);
    expect(isSignatureValid(BODY, '', SECRET)).toBe(false);
  });
});

describe('isVerificationHandshake', () => {
  it('returns true for an object with a string verification_token', () => {
    expect(isVerificationHandshake({ verification_token: 'tok' })).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a string', 'verification_token'],
    ['a number', 42],
    ['an object without the token', { type: 'page.created' }],
    ['a number token', { verification_token: 123 }],
    ['a null token', { verification_token: null }],
  ])('returns false for %s', (_label, body) => {
    expect(isVerificationHandshake(body)).toBe(false);
  });
});

describe('revalidateNotionRoutes', () => {
  it('expires the notion cache tag immediately', () => {
    revalidateNotionRoutes();

    expect(revalidateTag).toHaveBeenCalledWith('notion', { expire: 0 });
  });
});
