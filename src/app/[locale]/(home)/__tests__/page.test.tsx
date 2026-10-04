import { render, screen } from '@testing-library/react';
import { getTranslations } from 'next-intl/server';
import HomePage from '../page';

jest.mock('next-intl/server', () => ({ getTranslations: jest.fn() }));

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

    expect(screen.getByRole('heading', { level: 1, name: 'Duong Phan' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'title' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'description' })).toBeInTheDocument();
  });

  it('links the open-to-work badge to LinkedIn in a new tab', async () => {
    render(await HomePage());

    const badge = screen.getByText('openToWork').closest('a');

    expect(badge).toHaveAttribute('href', URLS.LINKEDIN_URL);
    expect(badge).toHaveAttribute('target', '_blank');
    expect(badge).toHaveTextContent('myLinkedIn');
  });

  it.each([
    ['facebook-icon', '/icons/facebook.svg', URLS.FACEBOOK_URL],
    ['mail-icon', '/icons/mail.svg', URLS.EMAIL_URL],
    ['linkedin-icon', '/icons/linkedin.svg', URLS.LINKEDIN_URL],
    ['github-icon', '/icons/github.svg', URLS.GITHUB_URL],
  ])('links the %s to its profile in a new tab', async (alt, src, href) => {
    render(await HomePage());

    const icon = screen.getByRole('img', { name: alt });
    const link = icon.closest('a');

    expect(icon).toHaveAttribute('src', src);
    expect(link).toHaveAttribute('href', href);
    expect(link).toHaveAttribute('target', '_blank');
  });
});
