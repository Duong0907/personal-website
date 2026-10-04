import { render, screen } from '@testing-library/react';
import { AspectRatio } from '../aspect-ratio';

describe('AspectRatio', () => {
  it('sets the --ratio CSS variable from the ratio prop', () => {
    render(<AspectRatio ratio={1.5} data-testid="box" />);

    expect(screen.getByTestId('box').style.getPropertyValue('--ratio')).toBe('1.5');
  });

  it('renders children and merges className', () => {
    render(
      <AspectRatio ratio={1} className="overflow-hidden" data-testid="box">
        <span>child</span>
      </AspectRatio>,
    );

    const box = screen.getByTestId('box');

    expect(box).toHaveClass('relative', 'overflow-hidden');
    expect(box).toHaveAttribute('data-slot', 'aspect-ratio');
    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
