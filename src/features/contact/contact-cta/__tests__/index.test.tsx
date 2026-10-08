import { render, screen } from '@testing-library/react';
import { getTranslations } from 'next-intl/server';
import { ContactCta } from '..';

jest.mock('next-intl/server', () => ({ getTranslations: jest.fn() }));
jest.mock('../../contact-dialog', () => ({
  ContactDialog: () => require('react').createElement('div', { 'data-testid': 'contact-dialog' }),
}));

beforeEach(() => {
  jest.mocked(getTranslations).mockResolvedValue(((key: string) => key) as never);
});

afterEach(() => {
  delete process.env.RESUME_URL;
});

describe('ContactCta', () => {
  it('loads the contact messages', async () => {
    render(await ContactCta());

    expect(getTranslations).toHaveBeenCalledWith('contact');
  });

  it('renders the contact dialog beside the resume link', async () => {
    render(await ContactCta());

    expect(screen.getByTestId('contact-dialog')).toBeInTheDocument();
  });

  it('centres the actions, so pages that do not centre their children still align it', async () => {
    const { container } = render(await ContactCta());

    // The home page centres its own children; about and article render a bare
    // fragment into a block container, so the CTA must centre itself.
    expect(container.firstElementChild).toHaveClass('justify-center');
  });

  it('links the resume in a new tab', async () => {
    render(await ContactCta());

    const link = screen.getByRole('link', { name: 'resume' });

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('points the resume link at RESUME_URL from the environment', async () => {
    process.env.RESUME_URL = 'https://example.com/cv';
    jest.resetModules();
    let Cta!: typeof ContactCta;
    jest.isolateModules(() => {
      // Fresh registry gives a fresh mock, so give it its translations again.
      jest.mocked(require('next-intl/server').getTranslations).mockResolvedValue((key: string) => key);
      Cta = require('..').ContactCta;
    });

    render(await Cta());

    expect(screen.getByRole('link', { name: 'resume' })).toHaveAttribute('href', 'https://example.com/cv');
  });
});
