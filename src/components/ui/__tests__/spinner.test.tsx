import { render, screen } from '@testing-library/react';
import { Spinner } from '../spinner';

describe('Spinner', () => {
  it('renders an accessible loading status', () => {
    render(<Spinner />);

    expect(screen.getByRole('status', { name: 'Loading' })).toHaveClass('size-4', 'animate-spin');
  });

  it('lets a custom className override the size', () => {
    render(<Spinner className="size-8" />);

    const spinner = screen.getByRole('status', { name: 'Loading' });

    expect(spinner).toHaveClass('size-8', 'animate-spin');
    expect(spinner).not.toHaveClass('size-4');
  });
});
