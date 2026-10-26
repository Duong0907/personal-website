import { render, screen } from '@testing-library/react';
import Loading from '../loading';

describe('Projects Loading', () => {
  it('exposes an accessible loading status', () => {
    render(<Loading />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('shows four placeholder project cards in the project grid', () => {
    const { container } = render(<Loading />);

    const grid = container.querySelector('ul.grid');

    expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2');
    expect(grid?.querySelectorAll('li [data-slot="card"]')).toHaveLength(4);
  });
});
