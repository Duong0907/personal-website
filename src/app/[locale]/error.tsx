'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { buttonVariants } from '@/components/ui/button-variants';
import { ROOT_URL } from '@/lib/url';

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Typography variant="h1" weight="regular">
        {t('title')}
      </Typography>
      <Typography variant="body" weight="regular" className="text-muted-foreground">
        {t('description')}
      </Typography>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
        <Button onClick={() => retry()}>{t('retry')}</Button>
        <Link href={ROOT_URL} className={buttonVariants({ variant: 'outline' })}>
          {t('home')}
        </Link>
      </div>
    </div>
  );
}
