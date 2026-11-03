import { render } from '@testing-library/react';
import Link from 'next/link';
import { NotionRenderer } from 'react-notion-x';
import { defaultMapImageUrl } from 'notion-utils';
import { Code } from 'react-notion-x-code-block';
import { useCurrentTheme } from '@/features/theme/hooks';
import { NotionPageRenderer } from '..';

jest.mock('react-notion-x', () => ({ NotionRenderer: jest.fn() }));
// ESM-only package, which Jest cannot load.
jest.mock('notion-utils', () => ({ defaultMapImageUrl: jest.fn(() => 'default-url') }));
// Package ships only a "module" entry, which Jest cannot resolve.
jest.mock('react-notion-x-code-block', () => ({ Code: function MockCode() {} }), { virtual: true });
jest.mock('@/features/theme/hooks', () => ({ useCurrentTheme: jest.fn() }));

const rendererMock = jest.mocked(NotionRenderer);
const recordMap = { block: {} } as never;

function setup({ isDarkTheme = false } = {}) {
  jest.mocked(useCurrentTheme).mockReturnValue({ isDarkTheme, theme: undefined, setTheme: jest.fn() });
}

function rendererProps() {
  return rendererMock.mock.calls[0][0];
}

describe('NotionPageRenderer', () => {
  it('renders the record map as a non-full page', () => {
    setup();

    render(<NotionPageRenderer recordMap={recordMap} />);

    expect(rendererProps()).toEqual(expect.objectContaining({ recordMap, fullPage: false, darkMode: false }));
  });

  it('turns on dark mode when the theme is dark', () => {
    setup({ isDarkTheme: true });

    render(<NotionPageRenderer recordMap={recordMap} />);

    expect(rendererProps().darkMode).toBe(true);
  });

  it('wires the Next.js image and link, the code block, and a no-op collection', () => {
    setup();

    render(<NotionPageRenderer recordMap={recordMap} />);

    const { components } = rendererProps();

    expect(components?.nextLink).toBe(Link);
    expect(components?.Code).toBe(Code);
    expect(components?.nextImage).toEqual(expect.any(Function));
    expect(components?.Collection).toEqual(expect.any(Function));
  });

  it('points Notion-hosted image blocks at the re-signing image route', () => {
    setup();

    render(<NotionPageRenderer recordMap={{ block: {}, signed_urls: { img1: 'https://s3/signed.png' } } as never} />);

    const { mapImageUrl } = rendererProps();

    expect(mapImageUrl?.('https://s3/signed.png', { id: 'img1', type: 'image' } as never)).toBe(
      '/api/notion-image/img1',
    );
  });

  it('keeps the default mapping for images without a signed URL', () => {
    setup();

    render(<NotionPageRenderer recordMap={{ block: {}, signed_urls: {} } as never} />);

    const block = { id: 'img2', type: 'image' } as never;

    expect(rendererProps().mapImageUrl?.('https://x.y/z.png', block)).toBe('default-url');
    expect(defaultMapImageUrl).toHaveBeenCalledWith('https://x.y/z.png', block);
  });

  it('forwards extra props to NotionRenderer', () => {
    setup();

    render(<NotionPageRenderer recordMap={recordMap} rootPageId="root-id" />);

    expect(rendererProps().rootPageId).toBe('root-id');
  });
});
