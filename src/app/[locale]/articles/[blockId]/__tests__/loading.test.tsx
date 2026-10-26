import { render, screen } from '@testing-library/react';
import Loading from '../loading';

describe('Article Loading', () => {
  it('exposes an accessible loading status', () => {
    render(<Loading />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('shows a back button, cover image, and paragraph placeholders', () => {
    const { container } = render(<Loading />);

    expect(container.querySelector('[data-slot="skeleton"].size-10')).toHaveClass('rounded-full');
    expect(container.querySelector('[data-slot="skeleton"].aspect-video')).toBeInTheDocument();
    expect(container.querySelectorAll('.article-lines [data-slot="skeleton"]').length).toBeGreaterThanOrEqual(5);
  });
});
