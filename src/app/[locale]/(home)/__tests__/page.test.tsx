import { render, screen } from '@testing-library/react';
import { getTranslations } from 'next-intl/server';
import HomePage from '../page';

jest.mock('next-intl/server', () => ({ getTranslations: jest.fn() }));
jest.mock('@/features/contact/contact-cta', () => ({
  ContactCta: () => require('react').createElement('div', { 'data-testid': 'contact-cta' }),
}));

const URLS = {
  FACEBOOK_URL: 'https://facebook.com/duong',
  GITHUB_URL: 'https://github.com/duong',
  EMAIL_URL: 'mailto:duong@example.com',
  LINKEDIN_URL: 'https://linkedin.com/in/duong',
};

beforeEach(() => {
  Object.assign(process.env, URLS);
  jest.mocked(getTranslations).mockResolvedValue(((key: string) => key) as never);
});

afterEach(() => {
  for (const key of Object.keys(URLS)) {
    delete process.env[key];
  }
});

describe('HomePage', () => {
  it('loads the home messages', async () => {
    render(await HomePage());

    expect(getTranslations).toHaveBeenCalledWith('home');
  });

  it('shows the name, title and description', async () => {
    render(await HomePage());

    expect(screen.getByRole('heading', { level: 1, name: 'name' })).toBeInTheDocument();
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('description')).toBeInTheDocument();
    expect(screen.getAllByRole('heading')).toHaveLength(1);
  });

  it('links the open-to-work badge to LinkedIn in a new tab', async () => {
    render(await HomePage());

    const badge = screen.getByText('openToWork').closest('a');

    expect(badge).toHaveAttribute('href', URLS.LINKEDIN_URL);
    expect(badge).toHaveAttribute('target', '_blank');
    expect(badge).toHaveAttribute('rel', 'noopener noreferrer');
    expect(badge).toHaveTextContent('myLinkedIn');
  });

  it('renders the contact CTA between the description and the social icons', async () => {
    const { container } = render(await HomePage());

    const description = screen.getByText('description');
    const cta = screen.getByTestId('contact-cta');
    const social = container.querySelector('.social-group') as HTMLElement;

    expect(description.compareDocumentPosition(cta) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(cta.compareDocumentPosition(social) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(social).not.toContainElement(cta);
  });

  it.each([
    ['facebook', '/icons/facebook.svg', URLS.FACEBOOK_URL],
    ['email', '/icons/mail.svg', URLS.EMAIL_URL],
    ['linkedin', '/icons/linkedin.svg', URLS.LINKEDIN_URL],
    ['github', '/icons/github.svg', URLS.GITHUB_URL],
  ])('links the %s icon to its profile in a new tab', async (label, src, href) => {
    const { container } = render(await HomePage());

    const link = container.querySelector(`.social-group a[aria-label="${label}"]`);

    expect(link?.querySelector('img')).toHaveAttribute('src', src);
    expect(link).toHaveAttribute('href', href);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
