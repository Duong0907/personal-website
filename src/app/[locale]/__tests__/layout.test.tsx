import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locale as getLocale } from 'next/root-params';
import { ThemeProvider } from '@/features/theme/provider';
import { SITE_URL } from '@/lib/constant';
import RootLayout, { generateMetadata, generateStaticParams } from '../layout';

jest.mock('next-intl', () => ({
  hasLocale: (locales: readonly string[], locale: unknown) => typeof locale === 'string' && locales.includes(locale),
  NextIntlClientProvider: jest.fn(),
}));
jest.mock('next-intl/server', () => ({ getMessages: jest.fn(), getTranslations: jest.fn() }));
jest.mock('next/root-params', () => ({ locale: jest.fn() }));
jest.mock('next/navigation', () => ({ notFound: jest.fn() }));
jest.mock('@/i18n/routing', () => ({ routing: { locales: ['en', 'vi'], defaultLocale: 'en' } }));
jest.mock('@/components/shared/navbar', () => ({ NavBar: () => 'navbar' }));
jest.mock('@/components/shared/footer', () => ({ Footer: () => 'footer' }));
jest.mock('@/features/theme/provider', () => ({ ThemeProvider: jest.fn() }));

const messages = { home: { title: 'Software Engineer' } };
const passThrough = (({ children }: { children: ReactNode }) => children) as never;

beforeEach(() => {
  jest.mocked(getLocale).mockResolvedValue('vi');
  jest.mocked(getMessages).mockResolvedValue(messages as never);
  jest.mocked(getTranslations).mockResolvedValue(((key: string) => key) as never);
  jest.mocked(NextIntlClientProvider).mockImplementation(passThrough);
  jest.mocked(ThemeProvider).mockImplementation(passThrough);
  jest.mocked(notFound).mockImplementation(() => {
    throw new Error('NEXT_NOT_FOUND');
  });
});

describe('generateStaticParams', () => {
  it('returns one entry per locale', () => {
    expect(generateStaticParams()).toEqual([{ locale: 'en' }, { locale: 'vi' }]);
  });
});

describe('generateMetadata', () => {
  it('builds metadata from the locale metadata messages', async () => {
    const metadata = await generateMetadata();

    expect(getTranslations).toHaveBeenCalledWith({ locale: 'vi', namespace: 'metadata' });
    expect(String(metadata.metadataBase)).toBe(new URL(SITE_URL).href);
    expect(metadata).toMatchObject({
      title: 'title',
      description: 'description',
      openGraph: { title: 'title', description: 'description', type: 'website', locale: 'vi' },
      twitter: { card: 'summary_large_image', title: 'title', description: 'description' },
    });
  });

  it('returns 404 for an unsupported locale', async () => {
    jest.mocked(getLocale).mockResolvedValue('fr');

    await expect(generateMetadata()).rejects.toThrow('NEXT_NOT_FOUND');
  });
});

describe('RootLayout', () => {
  it('renders the document in the request locale with navbar, page and footer', async () => {
    const html = renderToStaticMarkup(await RootLayout({ children: 'page-content' }));

    expect(html).toContain('<html lang="vi"');
    expect(html).toMatch(/navbar.*page-content.*footer/);
  });

  it('passes messages and theme settings to the providers', async () => {
    renderToStaticMarkup(await RootLayout({ children: 'page-content' }));

    expect(jest.mocked(NextIntlClientProvider).mock.calls[0][0]).toEqual(expect.objectContaining({ messages }));
    expect(jest.mocked(ThemeProvider).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        attribute: 'class',
        defaultTheme: 'system',
        enableSystem: true,
        disableTransitionOnChange: true,
      }),
    );
  });

  it('returns 404 for an unsupported locale before loading messages', async () => {
    jest.mocked(getLocale).mockResolvedValue('fr');

    await expect(RootLayout({ children: 'page-content' })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(getMessages).not.toHaveBeenCalled();
  });
});
