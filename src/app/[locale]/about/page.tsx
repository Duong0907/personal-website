import dynamic from 'next/dynamic';
import { SectionHeader } from '@/components/shared/section-header';

import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getNotionPage } from '@/features/notion/services/page';

const NotionPageRenderer = dynamic(() =>
  import('@/features/notion/components/notion-page-renderer').then((m) => m.NotionPageRenderer),
);

export default async function AboutPage() {
  const aboutPageId = process.env.ABOUT_PAGE_ID;

  if (!aboutPageId) {
    notFound();
  }

  const [t, recordMap] = await Promise.all([getTranslations('about-me'), getNotionPage(aboutPageId)]);

  if (!recordMap) {
    notFound();
  }

  return (
    <>
      <SectionHeader title={t('title')} description={t('description')}></SectionHeader>

      <NotionPageRenderer recordMap={recordMap} />
    </>
  );
}
