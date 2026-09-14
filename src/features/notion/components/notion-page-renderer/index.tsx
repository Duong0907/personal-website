'use client';

import 'react-notion-x/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

import Image, { type ImageProps } from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { NotionRenderer } from 'react-notion-x';
import { useCurrentTheme } from '@/features/theme/hooks';

const NotionImage = ({ alt, ...props }: ImageProps) => <Image alt={alt} loading="lazy" {...props}></Image>;

// Set this as a emtpy function to avoid library's warning
const NotionCollection = () => {};

export function NotionPageRenderer({ recordMap, ...props }: ComponentProps<typeof NotionRenderer>) {
  const { isDarkTheme } = useCurrentTheme();

  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={false}
      darkMode={isDarkTheme}
      components={{ nextImage: NotionImage, nextLink: Link, Collection: NotionCollection }}
      {...props}
    />
  );
}
