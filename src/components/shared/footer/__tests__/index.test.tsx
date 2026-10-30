import { render, screen } from '@testing-library/react';
import { Footer } from '..';

jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

describe('Footer', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the current year', () => {
    jest.useFakeTimers().setSystemTime(new Date('2030-05-01T00:00:00Z'));

    render(<Footer />);

    expect(screen.getByText('name © 2030')).toBeInTheDocument();
  });
});
