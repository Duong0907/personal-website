import { createRef } from 'react';
import { render } from '@testing-library/react';
import Link from 'next/link';
import { NotionRenderer } from 'react-notion-x';
import { Code } from 'react-notion-x/third-party/code';
import { useCurrentTheme } from '@/features/theme/hooks';
import { useInView } from '@/hooks/use-in-view';
import { NotionPageRenderer } from '..';

jest.mock('react-notion-x', () => ({ NotionRenderer: jest.fn() }));
jest.mock('react-notion-x/third-party/code', () => ({ Code: function MockCode() {} }));
jest.mock('@/features/theme/hooks', () => ({ useCurrentTheme: jest.fn() }));
jest.mock('@/hooks/use-in-view', () => ({ useInView: jest.fn() }));

const rendererMock = jest.mocked(NotionRenderer);
const recordMap = { block: {} } as never;

function setup({ isDarkTheme = false, isVisible = false } = {}) {
  jest.mocked(useCurrentTheme).mockReturnValue({ isDarkTheme, theme: undefined, setTheme: jest.fn() });
  jest.mocked(useInView).mockReturnValue({ ref: createRef<HTMLElement>(), isVisible });
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

  it('stays hidden until it scrolls into view', () => {
    setup({ isVisible: false });

    const { container } = render(<NotionPageRenderer recordMap={recordMap} />);

    expect(container.firstChild).toHaveClass('opacity-0', 'translate-y-6');
  });

  it('is shown once it is in view', () => {
    setup({ isVisible: true });

    const { container } = render(<NotionPageRenderer recordMap={recordMap} />);

    expect(container.firstChild).toHaveClass('opacity-100', 'translate-y-0');
  });
});
