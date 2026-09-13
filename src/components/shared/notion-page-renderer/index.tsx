'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { NotionRenderer } from 'react-notion-x';
import { useCurrentTheme } from '@/custom-hook/use-current-theme';

export function NotionPageRenderer({ recordMap, ...props }: ComponentProps<typeof NotionRenderer>) {
  const { isDarkTheme } = useCurrentTheme();

  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={false}
      darkMode={isDarkTheme}
      {...props}
      components={{
        nextImage: Image,
        nextLink: Link,
      }}
    />
  );
}
