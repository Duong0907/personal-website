import { render } from '@testing-library/react';
import { NotionPageSkeleton } from '..';

describe('NotionPageSkeleton', () => {
  it('shows a title, cover image, and paragraph placeholders', () => {
    const { container } = render(<NotionPageSkeleton />);

    expect(container.querySelector('[data-slot="skeleton"].h-9')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="skeleton"].aspect-video')).toBeInTheDocument();
    expect(container.querySelectorAll('.article-lines [data-slot="skeleton"]').length).toBeGreaterThanOrEqual(5);
  });
});
