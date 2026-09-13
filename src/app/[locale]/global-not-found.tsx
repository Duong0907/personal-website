import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Typography } from '@/components/ui/typography';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center justify-center text-sm max-md:px-4 py-20">
            <Typography
              variant="h1"
              weight="bold"
              className="bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent"
            >
              404 Not Found
            </Typography>
            <div className="h-px w-80 rounded bg-linear-to-r from-gray-400 to-gray-800 my-5 md:my-7"></div>
            <Typography variant="body" weight="light" className="text-gray-400 max-w-lg text-center">
              You may go to the wrong place :)
            </Typography>
            <Link
              href="/"
              className="group flex items-center gap-1 bg-white hover:bg-gray-200 px-7 py-2.5 text-gray-800 rounded-full mt-10 font-medium active:scale-95 transition-all"
            >
              Back to Home
              <svg
                className="group-hover:translate-x-0.5 transition"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.583 11h12.833m0 0L11 4.584M17.416 11 11 17.417"
                  stroke="#1E1E1E"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
