import { getLocale, getTranslations } from 'next-intl/server';
import { Typography } from '@/components/ui/typography';

// Notion content is written in English only; tell Vietnamese readers before they start.
export async function EnglishOnlyNotice() {
  const locale = await getLocale();

  if (locale !== 'vi') return null;

  const t = await getTranslations('notion');

  return (
    <Typography variant="body" weight="regular" className="w-full text-center text-sm text-muted-foreground">
      {t('englishOnly')}
    </Typography>
  );
}
