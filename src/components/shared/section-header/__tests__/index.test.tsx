import { render, screen } from '@testing-library/react';
import { SectionHeader } from '..';

describe('SectionHeader', () => {
  it('renders the title as h1 and the description as text below it', () => {
    render(<SectionHeader title="Projects" description="Show what I built" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByText('Show what I built').tagName).toBe('P');
    expect(screen.getAllByRole('heading')).toHaveLength(1);
  });
});
