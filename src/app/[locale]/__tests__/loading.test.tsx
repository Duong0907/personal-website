import { render, screen } from '@testing-library/react';
import Loading from '../loading';

describe('Loading', () => {
  it('shows a large spinner', () => {
    render(<Loading />);

    expect(screen.getByRole('status', { name: 'Loading' })).toHaveClass('size-10');
  });
});
