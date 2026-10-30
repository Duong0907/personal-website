'use client';

import { Typography } from '@/components/ui/typography';
import { Link, usePathname } from '@/i18n/navigation';
import { ROOT_URL } from '@/lib/url';
import { cn } from '@/lib/utils';
import classNames from 'classnames';
import { useMemo } from 'react';

const isActivePath = (pathname: string, href: string) => {
  if (href === ROOT_URL) return pathname === ROOT_URL;

  return pathname === href || pathname.startsWith(`${href}/`);
};

export function NavBarItem({ title, href }: { title: string; href: string }) {
  const pathname: string = usePathname();

  const isActive = useMemo(() => isActivePath(pathname, href), [pathname, href]);

  return (
    <Link
      className={classNames(
        'group inline-block py-4 px-2 cursor-pointer select-none w-full text-center text-foreground border-b border-transparent hover:border-foreground transition-colors duration-600 ease-in-out',
        {
          'border-highlight!': isActive,
        },
      )}
      href={href}
      aria-current={isActive ? 'page' : undefined}
      draggable={false}
    >
      <Typography
        variant="body"
        weight="regular"
        className={cn('transition-colors duration-600 ease-in-out', {
          'text-highlight!': isActive,
        })}
      >
        {title}
      </Typography>
    </Link>
  );
}
