import { render, screen } from '@testing-library/react';
import { RightCTAGroup } from '..';

jest.mock('../../theme-switch', () => ({ ThemeSwitch: () => 'theme-switch' }));
jest.mock('../../language-switch', () => ({ LanguageSwitch: () => 'language-switch' }));
jest.mock('../../nav-dialog', () => ({ NavDialog: () => 'nav-dialog' }));

describe('RightCTAGroup', () => {
  // The mocked switches render as adjacent text nodes in one <div>, so check text content, not getByText.
  it('renders the theme switch, language switch and mobile menu', () => {
    const { container } = render(<RightCTAGroup />);

    expect(container).toHaveTextContent('theme-switch');
    expect(container).toHaveTextContent('language-switch');
    expect(container).toHaveTextContent('nav-dialog');
  });

  it('renders the avatar fallback while the image loads', () => {
    render(<RightCTAGroup />);

    expect(screen.getByText('Duong Phan')).toBeInTheDocument();
  });
});
