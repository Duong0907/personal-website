import { Typography } from '@/components/ui/typography';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('site');
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center my-8">
      <div className="divider border-t w-full max-w-138.75 mb-12"></div>
      <Typography variant="body" weight="regular">
        {t('name')} © {currentYear}
      </Typography>
    </div>
  );
}
