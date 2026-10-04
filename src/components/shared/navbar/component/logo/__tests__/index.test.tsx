import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Logo } from '..';

describe('Logo', () => {
  it('links the brand name to the home page', () => {
    render(<Logo />);

    const link = screen.getByRole('link', { name: 'DUONG PHAN' });

    expect(link).toHaveAttribute('href', '/');
    expect(screen.getByRole('heading', { level: 4, name: 'DUONG PHAN' })).toBeInTheDocument();
  });
});
