import NextLink from 'next/link';

import { cn } from '@/lib/utils';

// Opens in a new tab. For internal routes, use Link from '@/i18n/navigation'.
function ExternalLink({ className, ...props }: React.ComponentProps<typeof NextLink>) {
  return (
    <NextLink
      data-slot="external-link"
      target="_blank"
      rel="noopener noreferrer"
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    />
  );
}

export { ExternalLink };
