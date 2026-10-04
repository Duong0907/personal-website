import { render, screen } from '@testing-library/react';
import { Footer } from '..';

describe('Footer', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the current year', () => {
    jest.useFakeTimers().setSystemTime(new Date('2030-05-01T00:00:00Z'));

    render(<Footer />);

    expect(screen.getByText('Phan Thanh Duong @ 2030')).toBeInTheDocument();
  });
});
