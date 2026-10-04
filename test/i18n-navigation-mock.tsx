import type { AnchorHTMLAttributes } from 'react';

// Stand-in for '@/i18n/navigation'. next-intl is ESM-only and cannot load in Jest.
let pathname = '/';

export const mockRouter = { back: jest.fn(), replace: jest.fn(), push: jest.fn() };
3;
export function setMockPathname(next: string) {
  pathname = next;
}

export const usePathname = () => pathname;
export const useRouter = () => mockRouter;
export const redirect = jest.fn();

export function Link({
  href,
  children,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      href={href}
      onClick={(event) => {
        // jsdom cannot navigate and logs "Not implemented: navigation".
        event.preventDefault();
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
