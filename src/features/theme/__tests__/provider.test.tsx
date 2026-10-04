/**
 * @jest-environment node
 */
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProvider } from '../provider';

jest.mock('next-themes', () => ({ ThemeProvider: jest.fn() }));

const globals = globalThis as { window?: unknown };

describe('ThemeProvider', () => {
  it('wraps next-themes and passes no scriptProps on the server', () => {
    const element = ThemeProvider({ attribute: 'class', children: 'child' });

    expect(element.type).toBe(NextThemesProvider);
    expect(element.props).toEqual({ attribute: 'class', scriptProps: undefined, children: 'child' });
  });

  it('marks the theme script as JSON in the browser', () => {
    globals.window = {};

    try {
      const element = ThemeProvider({ children: 'child' });

      expect(element.props.scriptProps).toEqual({ type: 'application/json' });
    } finally {
      delete globals.window;
    }
  });
});
