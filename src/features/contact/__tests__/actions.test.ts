import { sendContactMessage, type ContactState } from '../actions';

const mockSend = jest.fn();
jest.mock('resend', () => ({
  Resend: class {
    constructor(key?: string) {
      // The real client throws without a key.
      if (!key) throw new Error('Missing API key');
    }
    emails = { send: (...args: unknown[]) => mockSend(...args) };
  },
}));

const idle: ContactState = { status: 'idle' };
const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Hello there',
  ref_code: '',
  'cf-turnstile-response': 'token-123',
};

function form(overrides: Record<string, string | undefined> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ ...valid, ...overrides })) {
    if (value !== undefined) data.set(key, value);
  }
  return data;
}

const submitted = { name: valid.name, email: valid.email, message: valid.message };

beforeEach(() => {
  process.env.RESEND_API_KEY = 're_test';
  process.env.CONTACT_TO_EMAIL = 'owner@example.com';
  process.env.CONTACT_FROM_EMAIL = 'site@example.com';
  process.env.TURNSTILE_SECRET_KEY = 'secret';
  fetchMock.mockResolvedValue({ json: async () => ({ success: true }) });
  mockSend.mockResolvedValue({ data: { id: 'email-1' }, error: null });
});

function expectNothingSent() {
  expect(mockSend).not.toHaveBeenCalled();
}

function expectNoNetworkCall() {
  expectNothingSent();
  expect(fetchMock).not.toHaveBeenCalled();
}

describe('sendContactMessage', () => {
  it('returns success and does nothing when the honeypot is filled', async () => {
    const result = await sendContactMessage(idle, form({ ref_code: 'http://spam.example' }));

    expect(result).toEqual({ status: 'success' });
    expectNothingSent();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ['name missing', { name: undefined }],
    ['name blank', { name: '   ' }],
    ['email missing', { email: undefined }],
    ['email malformed', { email: 'not-an-email' }],
    ['email with an embedded newline', { email: 'ada@example.com\r\nBcc: victim@example.net' }],
    ['email with embedded whitespace', { email: 'ada @example.com' }],
    ['name over 100 characters', { name: 'a'.repeat(101) }],
    ['email over 200 characters', { email: `${'a'.repeat(190)}@example.com` }],
    ['message over 5000 characters', { message: 'a'.repeat(5001) }],
    ['message missing', { message: undefined }],
    ['message blank', { message: '  ' }],
  ])('%s returns error, echoes values, sends nothing', async (_label, override) => {
    const result = await sendContactMessage(idle, form(override));

    expect(result.status).toBe('error');
    const expected = { ...submitted, ...override };
    expect(result.values).toEqual({
      name: expected.name?.trim() ?? '',
      email: expected.email ?? '',
      message: expected.message?.trim() ?? '',
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expectNothingSent();
  });

  it('returns error without calling fetch when the token is missing', async () => {
    const result = await sendContactMessage(idle, form({ 'cf-turnstile-response': undefined }));

    expect(result).toEqual({ status: 'error', values: submitted });
    expect(fetchMock).not.toHaveBeenCalled();
    expectNothingSent();
  });

  it('returns error when siteverify says success:false', async () => {
    fetchMock.mockResolvedValue({ json: async () => ({ success: false }) });

    const result = await sendContactMessage(idle, form());

    expect(result).toEqual({ status: 'error', values: submitted });
    expectNothingSent();
  });

  it('returns error when fetch rejects', async () => {
    fetchMock.mockRejectedValue(new Error('network'));

    const result = await sendContactMessage(idle, form());

    expect(result).toEqual({ status: 'error', values: submitted });
    expectNothingSent();
  });

  it.each(['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_TO_EMAIL', 'TURNSTILE_SECRET_KEY'])(
    'returns error before any network call when %s is unset',
    async (key) => {
      delete process.env[key];

      const result = await sendContactMessage(idle, form());

      expect(result).toEqual({ status: 'error', values: submitted });
      expectNoNetworkCall();
    },
  );

  it('returns error when send rejects', async () => {
    mockSend.mockRejectedValue(new Error('boom'));

    expect(await sendContactMessage(idle, form())).toEqual({ status: 'error', values: submitted });
  });

  it('returns error when send returns an error object', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'bad' } });

    expect(await sendContactMessage(idle, form())).toEqual({ status: 'error', values: submitted });
  });

  it('verifies the token, then emails the owner with replyTo set to the visitor', async () => {
    const result = await sendContactMessage(idle, form());

    expect(result).toEqual({ status: 'success' });

    const [url, init] = fetchMock.mock.calls[0];

    expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    expect(init.method).toBe('POST');
    expect(new URLSearchParams(init.body).get('secret')).toBe('secret');
    expect(new URLSearchParams(init.body).get('response')).toBe('token-123');

    const sent = mockSend.mock.calls[0][0];

    expect(sent).toMatchObject({ from: 'site@example.com', to: 'owner@example.com', replyTo: 'ada@example.com' });
    expect(sent.text).toContain('Ada Lovelace');
    expect(sent.text).toContain('Hello there');
  });

  it('strips CR and LF from the name used in the subject', async () => {
    await sendContactMessage(idle, form({ name: 'Ada\r\nBcc: victim@example.net' }));

    expect(mockSend.mock.calls[0][0].subject).not.toMatch(/[\r\n]/);
  });
});
