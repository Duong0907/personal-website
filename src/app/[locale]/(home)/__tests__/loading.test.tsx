import { render, screen } from '@testing-library/react';
import Loading from '../loading';

describe('Home Loading', () => {
  it('exposes an accessible loading status', () => {
    render(<Loading />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('shows a round avatar placeholder and four social icon placeholders', () => {
    const { container } = render(<Loading />);

    expect(container.querySelector('[data-slot="skeleton"].size-37\\.5')).toHaveClass('rounded-full');
    expect(container.querySelectorAll('.social-group [data-slot="skeleton"]')).toHaveLength(4);
  });
});
