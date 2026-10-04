import { unstable_cache } from 'next/cache';
import { cachedInProduction } from '../cached-in-production';

jest.mock('next/cache', () => ({ unstable_cache: jest.fn() }));

const cacheMock = jest.mocked(unstable_cache);

describe('cachedInProduction', () => {
  it('returns the original function outside production', () => {
    const fn = jest.fn(async () => 'value');

    const result = cachedInProduction(fn, ['key']);

    expect(result).toBe(fn);
    expect(cacheMock).not.toHaveBeenCalled();
  });

  it('wraps the function with unstable_cache in production', () => {
    jest.replaceProperty(process.env, 'NODE_ENV', 'production');
    const wrapped = jest.fn(async () => 'cached');
    cacheMock.mockReturnValue(wrapped);
    const fn = jest.fn(async () => 'value');
    const options = { tags: ['notion'], revalidate: 60 };

    const result = cachedInProduction(fn, ['key'], options);

    expect(cacheMock).toHaveBeenCalledWith(fn, ['key'], options);
    expect(result).toBe(wrapped);
  });
});
