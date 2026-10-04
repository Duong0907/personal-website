import { renderToStaticMarkup } from 'react-dom/server';
import GlobalNotFound, { metadata } from '../global-not-found';

describe('GlobalNotFound', () => {
  it('renders a 404 message with a link back home', () => {
    const html = renderToStaticMarkup(<GlobalNotFound />);

    expect(html).toContain('<html lang="en"');
    expect(html).toContain('404 Not Found');
    expect(html).toMatch(/<a [^>]*href="\/"[^>]*>Back to Home/);
  });

  it('sets the 404 page metadata', () => {
    expect(metadata.title).toBe('404 - Page Not Found');
  });
});
