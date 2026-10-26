import { render, screen } from '@testing-library/react';
import Loading from '../loading';

describe('About Loading', () => {
  it('exposes an accessible loading status', () => {
    render(<Loading />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('shows a section header and Notion page placeholders', () => {
    const { container } = render(<Loading />);

    expect(container.querySelector('[data-slot="skeleton"].mb-16')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="skeleton"].aspect-video')).toBeInTheDocument();
    expect(container.querySelectorAll('.article-lines [data-slot="skeleton"]').length).toBeGreaterThanOrEqual(5);
  });
});
