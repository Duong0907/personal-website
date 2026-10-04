import { render, screen } from '@testing-library/react';
import { Typography } from '../typography';

describe('Typography', () => {
  it.each([
    ['h1', 'H1', 'text-4xl'],
    ['h2', 'H2', 'text-3xl'],
    ['h3', 'H3', 'text-2xl'],
    ['h4', 'H4', 'text-xl'],
    ['h5', 'H5', 'text-lg'],
    ['h6', 'H6', 'text-base'],
  ] as const)('renders variant %s as <%s> with %s', (variant, tagName, sizeClass) => {
    render(
      <Typography variant={variant} weight="regular">
        Text
      </Typography>,
    );

    const element = screen.getByText('Text');

    expect(element.tagName).toBe(tagName);
    expect(element).toHaveClass(sizeClass);
  });

  it('renders the body variant as a paragraph', () => {
    render(
      <Typography variant="body" weight="regular">
        Text
      </Typography>,
    );

    expect(screen.getByText('Text').tagName).toBe('P');
  });

  it.each([
    ['regular', 'font-normal'],
    ['medium', 'font-medium'],
    ['bold', 'font-bold'],
    ['black', 'font-black'],
    ['light', 'font-light'],
  ] as const)('applies weight %s as %s', (weight, weightClass) => {
    render(
      <Typography variant="body" weight={weight}>
        Text
      </Typography>,
    );

    expect(screen.getByText('Text')).toHaveClass(weightClass);
  });

  it('adds a custom className', () => {
    render(
      <Typography variant="h1" weight="regular" className="text-center mb-2">
        Text
      </Typography>,
    );

    expect(screen.getByText('Text')).toHaveClass('text-4xl', 'text-center', 'mb-2');
  });

  it('lets a custom className override the variant size', () => {
    render(
      <Typography variant="h1" weight="regular" className="text-sm">
        Text
      </Typography>,
    );

    const element = screen.getByText('Text');

    expect(element).toHaveClass('text-sm');
    expect(element).not.toHaveClass('text-4xl');
  });
});
