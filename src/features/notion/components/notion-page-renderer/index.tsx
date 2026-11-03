'use client';

import 'react-notion-x/styles.css';
import 'katex/dist/katex.min.css';

import { Code } from 'react-notion-x-code-block';

import Image, { type ImageProps } from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { NotionRenderer } from 'react-notion-x';
import { defaultMapImageUrl } from 'notion-utils';
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
      // Notion-hosted images get signed URLs that expire after an hour, so point them at a stable route that re-signs.
      mapImageUrl={(url, block) =>
        block.type === 'image' && recordMap.signed_urls?.[block.id]
          ? `/api/notion-image/${block.id}`
          : defaultMapImageUrl(url, block)
      }
      components={{ nextImage: NotionImage, nextLink: Link, Collection: NotionCollection, Code }}
      {...props}
    />
  );
}
