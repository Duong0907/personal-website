'use client';

import 'react-notion-x/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

import { Code } from 'react-notion-x/third-party/code';

import Image, { type ImageProps } from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { NotionRenderer } from 'react-notion-x';
import { useCurrentTheme } from '@/features/theme/hooks';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

const NotionImage = ({ alt, ...props }: ImageProps) => <Image alt={alt} loading="lazy" {...props}></Image>;

// Set this as a emtpy function to avoid library's warning
const NotionCollection = () => {};

export function NotionPageRenderer({ recordMap, ...props }: ComponentProps<typeof NotionRenderer>) {
  const { isDarkTheme } = useCurrentTheme();
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-500 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      )}
    >
      <NotionRenderer
        recordMap={recordMap}
        fullPage={false}
        darkMode={isDarkTheme}
        components={{ nextImage: NotionImage, nextLink: Link, Collection: NotionCollection, Code }}
        {...props}
      />
    </div>
  );
}
