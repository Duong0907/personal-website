'use server';

import { Resend } from 'resend';

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  values?: { name: string; email: string; message: string };
};

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const field = (data: FormData, key: string) => {
  const value = data.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: report success so bots do not retry.
  if (field(formData, 'ref_code')) return { status: 'success' };

  const values = {
    name: field(formData, 'name'),
    email: field(formData, 'email'),
    message: field(formData, 'message'),
  };
  const token = field(formData, 'cf-turnstile-response');
  const fail: ContactState = { status: 'error', values };

  if (!values.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !values.message || !token) return fail;

  // The client's maxLength is advisory. Caps match the form's.
  if (values.name.length > 100 || values.email.length > 200 || values.message.length > 5000) return fail;

  // Missing server config fails closed, before any network call.
  const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, TURNSTILE_SECRET_KEY } = process.env;

  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !CONTACT_TO_EMAIL || !TURNSTILE_SECRET_KEY) return fail;

  try {
    const verify = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      body: new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token }),
    });

    if (!(await verify.json()).success) return fail;

    const { error } = await new Resend(RESEND_API_KEY).emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: values.email,
      subject: `Portfolio message from ${values.name.replace(/[\r\n]+/g, ' ')}`,
      text: `From: ${values.name} <${values.email}>\n\n${values.message}`,
    });

    return error ? fail : { status: 'success' };
  } catch (error) {
    console.log(error);

    return fail;
  }
}
