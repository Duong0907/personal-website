import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';
import { Textarea } from '../textarea';

describe('Input', () => {
  it('renders a 44px rounded field that accepts typing', async () => {
    render(<Input aria-label="Name" />);

    const input = screen.getByRole('textbox', { name: 'Name' });
    await userEvent.type(input, 'Linh');

    expect(input).toHaveValue('Linh');
    expect(input).toHaveAttribute('data-slot', 'input');
    expect(input).toHaveClass('h-11', 'rounded-lg', 'focus-visible:ring-highlight');
  });

  it('merges a custom className', () => {
    render(<Input aria-label="Quantity" className="w-24 bg-muted" />);

    expect(screen.getByRole('textbox', { name: 'Quantity' })).toHaveClass('w-24', 'bg-muted');
  });
});

describe('Textarea', () => {
  it('shares the input styling without the fixed height', () => {
    render(<Textarea aria-label="Message" />);

    const textarea = screen.getByRole('textbox', { name: 'Message' });

    expect(textarea).toHaveAttribute('data-slot', 'textarea');
    expect(textarea).toHaveClass('rounded-lg', 'min-h-28');
    expect(textarea).not.toHaveClass('h-11');
  });
});
