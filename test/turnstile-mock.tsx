import { useEffect, useImperativeHandle, type Ref } from 'react';

export const TURNSTILE_TEST_TOKEN = 'test-token';

// Shared so tests can assert on it. clearMocks wipes its calls between tests.
export const turnstileReset = jest.fn();

// Stand-in for '@marsidev/react-turnstile'. The real widget injects a remote
// Cloudflare script that jsdom cannot load. The hidden input mimics the token
// field the real widget adds; the ref exposes a spy `reset`.
export function Turnstile({
  onSuccess,
  ref,
}: {
  siteKey?: string;
  options?: Record<string, unknown>;
  onSuccess?: (token: string) => void;
  ref?: Ref<{ reset: () => void }>;
}) {
  useImperativeHandle(ref, () => ({ reset: turnstileReset }), []);
  useEffect(() => {
    onSuccess?.(TURNSTILE_TEST_TOKEN);
  }, [onSuccess]);
  return <input type="hidden" name="cf-turnstile-response" value={TURNSTILE_TEST_TOKEN} readOnly />;
}
