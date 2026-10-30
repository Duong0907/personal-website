import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Logo } from '..';

jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

describe('Logo', () => {
  it('links the brand name to the home page', () => {
    render(<Logo />);

    const link = screen.getByRole('link', { name: 'name' });

    expect(link).toHaveAttribute('href', '/');
    expect(link.querySelector('p')).toHaveClass('uppercase');
  });
});
