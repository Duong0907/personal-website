import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Typography } from '@/components/ui/typography';
import { buttonVariants } from '@/components/ui/button-variants';
import { ROOT_URL } from '@/lib/url';

export default async function NotFound() {
  const t = await getTranslations('not-found');

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Typography variant="h1" weight="regular">
        {t('title')}
      </Typography>
      <Typography variant="body" weight="regular" className="text-muted-foreground">
        {t('description')}
      </Typography>
      <Link href={ROOT_URL} className={buttonVariants({ className: 'mt-6' })}>
        {t('home')}
      </Link>
    </div>
  );
}
