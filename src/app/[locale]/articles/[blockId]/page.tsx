import 'react-notion-x/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

import { NotionPageRenderer } from '@/components/shared/notion-page-renderer';
import { getNotionPage } from '@/services/notion/page';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/shared/back-button';

export default async function ArticlePage({ params }: { params: Promise<{ blockId: string }> }) {
  const { blockId } = await params;

  const recordMap = await getNotionPage(blockId);

  if (!recordMap) notFound();

  return (
    <>
      <div className="w-full my-4">
        <BackButton />
      </div>

      <NotionPageRenderer recordMap={recordMap} />
    </>
  );
}
