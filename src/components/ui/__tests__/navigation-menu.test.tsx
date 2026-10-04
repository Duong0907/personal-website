import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../navigation-menu';

function TestMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/about">About</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            More
            <NavigationMenuIndicator data-testid="indicator" />
          </NavigationMenuTrigger>
          <NavigationMenuContent>Hidden content</NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

describe('NavigationMenu', () => {
  it('renders a navigation landmark with one list item per item', () => {
    render(<TestMenu />);

    expect(screen.getByRole('navigation')).toHaveAttribute('data-slot', 'navigation-menu');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders links with their href', () => {
    render(<TestMenu />);

    const link = screen.getByRole('link', { name: 'About' });

    expect(link).toHaveAttribute('href', '/about');
    expect(link).toHaveAttribute('data-slot', 'navigation-menu-link');
  });

  it('renders the trigger with the indicator', () => {
    render(<TestMenu />);

    expect(screen.getByRole('button', { name: 'More' })).toHaveAttribute('data-slot', 'navigation-menu-trigger');
    expect(screen.getByTestId('indicator')).toHaveAttribute('data-slot', 'navigation-menu-indicator');
  });

  it('shows the content after the trigger is clicked', async () => {
    render(<TestMenu />);

    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'More' }));

    expect(await screen.findByText('Hidden content')).toHaveAttribute('data-slot', 'navigation-menu-content');
  });
});

describe('navigationMenuTriggerStyle', () => {
  it('returns the trigger classes', () => {
    expect(navigationMenuTriggerStyle()).toContain('inline-flex');
  });
});
