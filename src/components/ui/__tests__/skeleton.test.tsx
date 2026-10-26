import { render } from '@testing-library/react';
import { Skeleton } from '../skeleton';

describe('Skeleton', () => {
  it('renders a pulsing placeholder', () => {
    const { container } = render(<Skeleton />);

    expect(container.querySelector('[data-slot="skeleton"]')).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted');
  });

  it('lets a custom className override the shape', () => {
    const { container } = render(<Skeleton className="rounded-full size-8" />);

    const skeleton = container.querySelector('[data-slot="skeleton"]');

    expect(skeleton).toHaveClass('rounded-full', 'size-8', 'animate-pulse');
    expect(skeleton).not.toHaveClass('rounded-md');
  });
});
