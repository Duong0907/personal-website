import './[locale]/global.css';
import { Source_Serif_4 } from 'next/font/google';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography';
import { buttonVariants } from '@/components/ui/button-variants';
import { ThemeProvider } from '@/features/theme/provider';

const sourceSerif4 = Source_Serif_4({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

// Bypasses the [locale] layout, so it applies the stored theme itself.
export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={sourceSerif4.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
            <Typography variant="h1" weight="bold">
              404 Not Found
            </Typography>
            <Typography variant="body" weight="regular" className="text-muted-foreground">
              This page does not exist or has moved.
            </Typography>
            <Link href="/" className={buttonVariants({ className: 'mt-6' })}>
              Back to Home
            </Link>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
