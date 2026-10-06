import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ImageResponse } from 'next/og';
import { getProjectById } from '@/features/notion/services/project';
import OpengraphImage, { alt, contentType, size } from '../opengraph-image';

jest.mock('next/og', () => ({ ImageResponse: jest.fn() }));
jest.mock('@/features/notion/services/project', () => ({ getProjectById: jest.fn() }));

const params = Promise.resolve({ locale: 'en', blockId: 'p1' });

function renderedHtml() {
  const [element] = jest.mocked(ImageResponse).mock.calls[0];

  return renderToStaticMarkup(element as ReactElement);
}

describe('article opengraph-image', () => {
  it('exports the image metadata', () => {
    expect(alt).toBe('Duong Phan');
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe('image/png');
  });

  it('renders the project name and technologies at 1200x630', async () => {
    jest.mocked(getProjectById).mockResolvedValue({
      id: 'p1',
      name: 'Portfolio',
      status: 'Published',
      technologies: 'Next.js, Notion',
      features: '',
      imageUrl: '',
    });

    const result = await OpengraphImage({ params });

    expect(getProjectById).toHaveBeenCalledWith('p1');
    expect(result).toBeInstanceOf(ImageResponse);
    expect(jest.mocked(ImageResponse).mock.calls[0][1]).toEqual({ width: 1200, height: 630 });
    expect(renderedHtml()).toContain('Portfolio');
    expect(renderedHtml()).toContain('Next.js, Notion');
  });

  it('falls back to the site name when the project is unknown', async () => {
    jest.mocked(getProjectById).mockResolvedValue(undefined);

    await OpengraphImage({ params });

    expect(renderedHtml()).toContain('Duong Phan');
  });
});
