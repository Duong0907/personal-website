import { Typography } from '@/components/ui/typography';
import { Link } from '@/i18n/navigation';
import { ROOT_URL } from '@/lib/url';
import { useTranslations } from 'next-intl';

export function Logo() {
  const t = useTranslations('site');

  return (
    <div className="logo-wrapper flex justify-center">
      <Link href={ROOT_URL}>
        <Typography variant="body" weight="bold" className="text-xl uppercase">
          {t('name')}
        </Typography>
      </Link>
    </div>
  );
}
