import { render, screen } from '@testing-library/react';
import { setMockPathname } from '../../../../../../../test/i18n-navigation-mock';
import { NavBarItem } from '..';

describe('NavBarItem', () => {
  beforeEach(() => {
    setMockPathname('/');
  });

  it('renders a link with the title', () => {
    render(<NavBarItem title="Projects" href="/projects" />);

    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
  });

  it('highlights the item when the pathname matches the href', () => {
    setMockPathname('/projects');

    render(<NavBarItem title="Projects" href="/projects" />);

    expect(screen.getByRole('link', { name: 'Projects' })).toHaveClass('border-highlight!');
    expect(screen.getByText('Projects')).toHaveClass('text-highlight!');
  });

  it('does not highlight the item on another page', () => {
    setMockPathname('/about');

    render(<NavBarItem title="Projects" href="/projects" />);

    expect(screen.getByRole('link', { name: 'Projects' })).not.toHaveClass('border-highlight!');
    expect(screen.getByText('Projects')).not.toHaveClass('text-highlight!');
  });

  it('does not highlight on a nested path of the href', () => {
    setMockPathname('/projects/abc');

    render(<NavBarItem title="Projects" href="/projects" />);

    expect(screen.getByRole('link', { name: 'Projects' })).not.toHaveClass('border-highlight!');
  });
});
