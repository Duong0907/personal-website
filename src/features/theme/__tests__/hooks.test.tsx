import { renderHook } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { useCurrentTheme } from '../hooks';

jest.mock('next-themes', () => ({ useTheme: jest.fn() }));

const useThemeMock = jest.mocked(useTheme);
const setTheme = jest.fn();

function mockResolvedTheme(resolvedTheme: string | undefined) {
  useThemeMock.mockReturnValue({ resolvedTheme, setTheme, themes: [] });
}

describe('useCurrentTheme', () => {
  it('reports dark when the resolved theme is dark', () => {
    mockResolvedTheme('dark');

    const { result } = renderHook(() => useCurrentTheme());

    expect(result.current.isDarkTheme).toBe(true);
    expect(result.current.theme).toBe('dark');
  });

  it('reports not dark when the resolved theme is light', () => {
    mockResolvedTheme('light');

    const { result } = renderHook(() => useCurrentTheme());

    expect(result.current.isDarkTheme).toBe(false);
  });

  it('reports not dark before the theme is resolved', () => {
    mockResolvedTheme(undefined);

    const { result } = renderHook(() => useCurrentTheme());

    expect(result.current.isDarkTheme).toBe(false);
  });

  it('updates when the resolved theme changes', () => {
    mockResolvedTheme('light');
    const { result, rerender } = renderHook(() => useCurrentTheme());

    mockResolvedTheme('dark');
    rerender();

    expect(result.current.isDarkTheme).toBe(true);
  });

  it('passes setTheme through', () => {
    mockResolvedTheme('light');

    const { result } = renderHook(() => useCurrentTheme());
    result.current.setTheme('dark');

    expect(setTheme).toHaveBeenCalledWith('dark');
  });
});
