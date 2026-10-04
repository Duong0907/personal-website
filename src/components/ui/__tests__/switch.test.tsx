import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../switch';

describe('Switch', () => {
  it('is unchecked by default', () => {
    render(<Switch />);

    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('reflects the checked prop', () => {
    render(<Switch checked onCheckedChange={() => {}} />);

    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('calls onCheckedChange with the next value on click', async () => {
    const onCheckedChange = jest.fn();
    render(<Switch checked={false} onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByRole('switch'));

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('does not call onCheckedChange when disabled', async () => {
    const onCheckedChange = jest.fn();
    render(<Switch disabled onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByRole('switch'));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('sets data-size from the size prop', () => {
    render(<Switch size="xl" />);

    expect(screen.getByRole('switch')).toHaveAttribute('data-size', 'xl');
  });

  it('uses the default size when none is given', () => {
    render(<Switch />);

    expect(screen.getByRole('switch')).toHaveAttribute('data-size', 'default');
  });

  it('renders both icons inside the thumb', () => {
    render(<Switch iconOn={<span>on-icon</span>} iconOff={<span>off-icon</span>} />);

    expect(screen.getByText('on-icon')).toBeInTheDocument();
    expect(screen.getByText('off-icon')).toBeInTheDocument();
  });

  it('renders an empty thumb when no icons are given', () => {
    const { container } = render(<Switch />);

    expect(container.querySelector('[data-slot="switch-thumb"]')?.children).toHaveLength(0);
  });
});
