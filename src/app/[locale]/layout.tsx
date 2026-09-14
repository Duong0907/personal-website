import { NavBar } from '@/components/shared/navbar';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constant';
import './global.css';

import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { Source_Serif_4, Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/shared/footer';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const sourceSerif4 = Source_Serif_4({
  weight: '400',
  variable: '--font-source-serif-4',
});

import { getMessages, getTranslations } from 'next-intl/server';
import { locale as getLocale } from 'next/root-params';
import { ThemeProvider } from '@/features/theme/provider';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="root-layout text-foreground source-serif-4-regular space-y-18 px-3 flex flex-col items-center">
      <NavBar />
      <div className="md:min-w-139 md:max-w-250">{children}</div>
      <Footer />
    </div>
  );
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={cn('font-sans [scrollbar-gutter:stable]', geist.variable)} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* This is false positive (a bug) in app router */}
        {/* eslint-disable @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
        />
      </head>

      <body className={sourceSerif4.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Layout>{children}</Layout>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
