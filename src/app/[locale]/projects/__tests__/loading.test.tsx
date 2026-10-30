import { render, screen } from '@testing-library/react';
import Loading from '../loading';

describe('Projects Loading', () => {
  it('exposes an accessible loading status', () => {
    render(<Loading />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('shows four placeholder project cards in a single column', () => {
    const { container } = render(<Loading />);

    const list = container.querySelector('ul');

    expect(list).toHaveClass('flex-col');
    expect(list?.querySelectorAll('li [data-slot="card"]')).toHaveLength(4);
  });
});
