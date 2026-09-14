import { revalidateTag } from 'next/cache';
import { createHmac, timingSafeEqual } from 'crypto';

export function revalidateNotionRoutes() {
  revalidateTag('notion', { expire: 0 });
}

export function isVerificationHandshake(body: unknown): body is { verification_token: string } {
  return (
    typeof body === 'object' &&
    body !== null &&
    'verification_token' in body &&
    typeof (body as { verification_token: unknown }).verification_token === 'string'
  );
}

export function isSignatureValid(rawBody: string, signatureHeader: string, secret: string): boolean {
  const expected = `sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`;
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signatureHeader);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}
