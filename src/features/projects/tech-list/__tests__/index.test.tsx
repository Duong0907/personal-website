import { render, screen } from '@testing-library/react';
import { splitTechnologies, TechList } from '..';

describe('splitTechnologies', () => {
  it('splits, trims and drops empty and N/A entries', () => {
    expect(splitTechnologies(' Next.js, ,Notion , N/A')).toEqual(['Next.js', 'Notion']);
  });
});

describe('TechList', () => {
  it('renders one item per technology', () => {
    render(<TechList technologies="Next.js, Notion" />);

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Next.js', 'Notion']);
  });

  it('renders nothing when there is no stack', () => {
    const { container } = render(<TechList technologies="N/A" />);

    expect(container).toBeEmptyDOMElement();
  });
});
