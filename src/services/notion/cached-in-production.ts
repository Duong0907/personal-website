import { unstable_cache } from 'next/cache';

type CacheOptions = Parameters<typeof unstable_cache>[2];

export function cachedInProduction<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  keyParts: string[],
  options?: CacheOptions,
): (...args: Args) => Promise<Result> {
  return process.env.NODE_ENV === 'production' ? unstable_cache(fn, keyParts, options) : fn;
}
