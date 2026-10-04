import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getTranslations } from 'next-intl/server';
import { ImageResponse } from 'next/og';
import OpengraphImage, { alt, contentType, size } from '../opengraph-image';

jest.mock('next-intl/server', () => ({ getTranslations: jest.fn() }));
jest.mock('next/og', () => ({ ImageResponse: jest.fn() }));

beforeEach(() => {
  jest.mocked(getTranslations).mockResolvedValue(((key: string) => `home.${key}`) as never);
});

describe('opengraph-image', () => {
  it('exports the image metadata', () => {
    expect(alt).toBe('Duong Phan');
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe('image/png');
  });

  it('renders the name and the localized title at 1200x630', async () => {
    await OpengraphImage({ params: Promise.resolve({ locale: 'vi' }) });

    expect(getTranslations).toHaveBeenCalledWith({ locale: 'vi', namespace: 'home' });

    const [element, options] = jest.mocked(ImageResponse).mock.calls[0];
    const html = renderToStaticMarkup(element as ReactElement);

    expect(options).toEqual({ width: 1200, height: 630 });
    expect(html).toContain('Duong Phan');
    expect(html).toContain('home.title');
  });

  it('returns an ImageResponse', async () => {
    const result = await OpengraphImage({ params: Promise.resolve({ locale: 'en' }) });

    expect(result).toBeInstanceOf(ImageResponse);
  });
});
