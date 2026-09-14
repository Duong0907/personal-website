import { SectionHeader } from '@/components/shared/section-header';
import { getTranslations } from 'next-intl/server';

export default async function BlogPage() {
  const t = await getTranslations('blog');

  return <SectionHeader title={t('title')} description={t('description')}></SectionHeader>;
}
