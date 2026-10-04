import type { ImageProps } from 'next/image';

// Plain <img> stand-in for next/image. Keeps the props that tests assert on.
export default function NextImageMock({
  src,
  alt,
  fill,
  priority,
  width,
  height,
  sizes,
  loading,
  draggable,
  className,
}: ImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === 'string' ? src : undefined}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={loading}
      draggable={draggable}
      className={className}
      data-fill={fill ? 'true' : undefined}
      data-priority={priority ? 'true' : undefined}
    />
  );
}
