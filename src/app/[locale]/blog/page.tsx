import { SectionHeader } from '@/components/shared/section-header';
import { Typography } from '@/components/ui/typography';
import { getTranslations } from 'next-intl/server';

export default async function BlogPage() {
  const t = await getTranslations('blog');

  return (
    <>
      <SectionHeader title={t('title')} description={t('description')}></SectionHeader>
      <Typography variant="body" weight="regular" className="text-center text-muted-foreground">
        {t('empty')}
      </Typography>
    </>
  );
}
