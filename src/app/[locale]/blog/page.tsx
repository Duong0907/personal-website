import { SectionHeader } from '@/components/shared/section-header';
import { getTranslations } from 'next-intl/server';

// The revalidate time (second) of notions pages
// Should be bigger than the  NOTION_CACHE_REVALIDATE_TIME to get the latest data
export const revalidate = 60;

export default async function BlogPage() {
  const t = await getTranslations('blog');

  return <SectionHeader title={t('title')} description={t('description')}></SectionHeader>;
}
