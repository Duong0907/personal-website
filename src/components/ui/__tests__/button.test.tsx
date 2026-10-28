import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, buttonVariants } from '../button';

describe('Button', () => {
  it('renders a button with its children', () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('data-slot', 'button');
  });

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies the default variant and size', () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
      'bg-foreground',
      'h-11',
      'rounded-lg',
      'uppercase',
    );
  });

  it('applies the requested variant and size', () => {
    render(
      <Button variant="outline" size="icon">
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toHaveClass('border-foreground/20', 'size-11');
    expect(button).not.toHaveClass('bg-foreground');
  });

  it('drops control height and padding for the link variant', () => {
    render(<Button variant="link">Read more</Button>);

    const button = screen.getByRole('button', { name: 'Read more' });

    expect(button).toHaveClass('h-auto', 'px-0', 'normal-case');
    expect(button).not.toHaveClass('h-11', 'px-6');
  });

  it('merges a custom className', () => {
    render(<Button className="rounded-full">Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass('rounded-full');
  });
});

describe('buttonVariants', () => {
  it('returns the classes for a variant without rendering', () => {
    expect(buttonVariants({ variant: 'clear' })).toContain('text-foreground');
  });
});
