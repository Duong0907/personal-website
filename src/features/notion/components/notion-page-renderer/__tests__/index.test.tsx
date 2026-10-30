import { render } from '@testing-library/react';
import Link from 'next/link';
import { NotionRenderer } from 'react-notion-x';
import { Code } from 'react-notion-x-code-block';
import { useCurrentTheme } from '@/features/theme/hooks';
import { NotionPageRenderer } from '..';

jest.mock('react-notion-x', () => ({ NotionRenderer: jest.fn() }));
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

  it('forwards extra props to NotionRenderer', () => {
    setup();

    render(<NotionPageRenderer recordMap={recordMap} rootPageId="root-id" />);

    expect(rendererProps().rootPageId).toBe('root-id');
  });
});
