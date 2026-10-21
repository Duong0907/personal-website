import { render, screen } from '@testing-library/react';
import { ExternalLink } from '../external-link';

describe('ExternalLink', () => {
  it('opens the href in a new tab without an opener and merges className', () => {
    render(
      <ExternalLink href="https://github.com" className="text-xs">
        GitHub
      </ExternalLink>,
    );

    const link = screen.getByRole('link', { name: 'GitHub' });

    expect(link).toHaveAttribute('href', 'https://github.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveClass('inline-flex', 'text-xs');
  });
});
