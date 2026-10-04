import { render, screen } from '@testing-library/react';
import { SectionHeader } from '..';

describe('SectionHeader', () => {
  it('renders the title as h1 and the description as h4', () => {
    render(<SectionHeader title="Projects" description="Show what I built" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Show what I built' })).toBeInTheDocument();
  });
});
