import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocale } from 'next-intl';
import { mockRouter, setMockPathname } from '../../../../../../../test/i18n-navigation-mock';
import { LanguageSwitch } from '..';

jest.mock('next-intl', () => ({ useLocale: jest.fn() }));

const useLocaleMock = jest.mocked(useLocale);

describe('LanguageSwitch', () => {
  beforeEach(() => {
    setMockPathname('/projects');
  });

  it('is unchecked in English and switches to Vietnamese on click', async () => {
    useLocaleMock.mockReturnValue('en');
    render(<LanguageSwitch />);

    const toggle = screen.getByRole('switch');
    expect(toggle).not.toBeChecked();

    await userEvent.click(toggle);

    expect(mockRouter.replace).toHaveBeenCalledWith('/projects', { locale: 'vi' });
  });

  it('is checked in Vietnamese and switches to English on click', async () => {
    useLocaleMock.mockReturnValue('vi');
    render(<LanguageSwitch />);

    const toggle = screen.getByRole('switch');
    expect(toggle).toBeChecked();

    await userEvent.click(toggle);

    expect(mockRouter.replace).toHaveBeenCalledWith('/projects', { locale: 'en' });
  });

  it('names the switch by the language it turns on', () => {
    useLocaleMock.mockReturnValue('en');
    render(<LanguageSwitch />);

    expect(screen.getByRole('switch', { name: 'Tiếng Việt' })).toBeInTheDocument();
  });

  it('renders both flag icons as decoration', () => {
    useLocaleMock.mockReturnValue('en');
    const { container } = render(<LanguageSwitch />);

    const sources = Array.from(container.querySelectorAll('img')).map((img) => [img.getAttribute('src'), img.alt]);

    expect(sources).toEqual([
      ['/icons/vietnam.svg', ''],
      ['/icons/england.svg', ''],
    ]);
  });
});
