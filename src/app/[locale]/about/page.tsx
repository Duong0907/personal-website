import 'react-notion-x/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

import { NotionPageRenderer } from '@/components/shared/notion-page-renderer';
import { SectionHeader } from '@/components/shared/section-header';
import { getNotionPage } from '@/services/notion/page';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default async function AboutPage() {
  const t = await getTranslations('about-me');

  const aboutPageId = process.env.ABOUT_PAGE_ID;

  if (!aboutPageId) {
    notFound();
  }

  const recordMap = await getNotionPage(aboutPageId);

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
