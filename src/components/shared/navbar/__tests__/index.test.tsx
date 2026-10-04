import { render, screen } from '@testing-library/react';
import { NavBar } from '..';

jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
jest.mock('../component/right-cta-group', () => ({ RightCTAGroup: () => 'right-cta-group' }));

describe('NavBar', () => {
  it('links the main pages', () => {
    render(<NavBar />);

    expect(screen.getByRole('link', { name: 'home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'projects' })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: 'aboutMe' })).toHaveAttribute('href', '/about');
  });

  it('does not link the hidden blog page', () => {
    render(<NavBar />);

    expect(screen.queryByRole('link', { name: 'blog' })).not.toBeInTheDocument();
  });

  it('renders the logo and the right-side controls', () => {
    render(<NavBar />);

    expect(screen.getByRole('link', { name: 'DUONG PHAN' })).toHaveAttribute('href', '/');
    expect(screen.getByText('right-cta-group')).toBeInTheDocument();
  });
});
