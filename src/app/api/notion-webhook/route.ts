import { NextResponse } from 'next/server';
import { isSignatureValid, isVerificationHandshake, revalidateNotionRoutes } from './services';

export async function POST(request: Request) {
  const rawBody = await request.text();

  let parsedBody: unknown;

  // Validate request body
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const signatureHeader = request.headers.get('X-Notion-Signature');

  // Notion webhook calls to get the secret token
  if (!signatureHeader && isVerificationHandshake(parsedBody)) {
    console.log('Notion webhook verification token:', parsedBody.verification_token);

    return NextResponse.json({ ok: true });
  }

  const secret = process.env.NOTION_WEBHOOK_SECRET;

  if (!secret) {
    console.error('NOTION_WEBHOOK_SECRET is not configured');

    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  console.log('Invalidate', { signatureHeader, rawBody, secret });

  // Notion webhook events call
  // Validate the signatureHeader
  if (!signatureHeader || !isSignatureValid(rawBody, signatureHeader, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  revalidateNotionRoutes();

  return NextResponse.json({ ok: true });
}
