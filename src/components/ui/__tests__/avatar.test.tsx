import { render, screen } from '@testing-library/react';
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '../avatar';

describe('Avatar', () => {
  it('uses the default size', () => {
    render(<Avatar data-testid="avatar" />);

    expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', 'default');
  });

  it('sets data-size from the size prop', () => {
    render(<Avatar size="lg" data-testid="avatar" />);

    expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', 'lg');
  });

  it('shows the fallback while the image has not loaded', () => {
    render(
      <Avatar>
        <AvatarImage src="/avatar.png" alt="Duong" />
        <AvatarFallback>DP</AvatarFallback>
      </Avatar>,
    );

    // jsdom never loads images, so the image stays hidden.
    expect(screen.getByText('DP')).toHaveAttribute('data-slot', 'avatar-fallback');
    expect(screen.queryByRole('img', { name: 'Duong' })).not.toBeInTheDocument();
  });

  it.each([
    ['avatar-badge', AvatarBadge],
    ['avatar-group', AvatarGroup],
    ['avatar-group-count', AvatarGroupCount],
  ] as const)('renders %s with its children', (slot, Part) => {
    render(<Part data-testid="part">+3</Part>);

    const part = screen.getByTestId('part');

    expect(part).toHaveAttribute('data-slot', slot);
    expect(part).toHaveTextContent('+3');
  });
});
