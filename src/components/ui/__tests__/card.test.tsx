import { render, screen } from '@testing-library/react';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card';

describe('Card', () => {
  it('uses the default size', () => {
    render(<Card data-testid="card" />);

    expect(screen.getByTestId('card')).toHaveAttribute('data-size', 'default');
  });

  it('accepts the sm size', () => {
    render(<Card size="sm" data-testid="card" />);

    expect(screen.getByTestId('card')).toHaveAttribute('data-size', 'sm');
  });

  it('merges a custom className', () => {
    render(<Card className="cursor-pointer" data-testid="card" />);

    expect(screen.getByTestId('card')).toHaveClass('flex', 'cursor-pointer');
  });

  it.each([
    ['card-header', CardHeader],
    ['card-title', CardTitle],
    ['card-description', CardDescription],
    ['card-action', CardAction],
    ['card-content', CardContent],
    ['card-footer', CardFooter],
  ] as const)('renders %s with its children', (slot, Part) => {
    render(<Part data-testid="part">content</Part>);

    const part = screen.getByTestId('part');

    expect(part).toHaveAttribute('data-slot', slot);
    expect(part).toHaveTextContent('content');
  });
});
