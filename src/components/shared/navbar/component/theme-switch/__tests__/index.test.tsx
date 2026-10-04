import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCurrentTheme } from '@/features/theme/hooks';
import { ThemeSwitch } from '..';

jest.mock('@/features/theme/hooks', () => ({ useCurrentTheme: jest.fn() }));

const setTheme = jest.fn();

function mockTheme(isDarkTheme: boolean) {
  jest.mocked(useCurrentTheme).mockReturnValue({ isDarkTheme, theme: isDarkTheme ? 'dark' : 'light', setTheme });
}

describe('ThemeSwitch', () => {
  it('is unchecked in light mode and switches to dark on click', async () => {
    mockTheme(false);
    render(<ThemeSwitch />);

    const toggle = screen.getByRole('switch');
    expect(toggle).not.toBeChecked();

    await userEvent.click(toggle);

    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('is checked in dark mode and switches to light on click', async () => {
    mockTheme(true);
    render(<ThemeSwitch />);

    const toggle = screen.getByRole('switch');
    expect(toggle).toBeChecked();

    await userEvent.click(toggle);

    expect(setTheme).toHaveBeenCalledWith('light');
  });
});
