import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/shared/back-button';
import { GoToTop } from '@/components/shared/back-to-top-button';
import { getAllProjects } from '@/features/notion/services/project';
import { getNotionPage } from '@/features/notion/services/page';

const NotionPageRenderer = dynamic(() =>
  import('@/features/notion/components/notion-page-renderer').then((m) => m.NotionPageRenderer),
);

export async function generateStaticParams() {
  const projects = await getAllProjects();

  return projects.map((project) => ({ blockId: project.id }));
}

export default async function ArticlePage({ params }: { params: Promise<{ blockId: string }> }) {
  const { blockId } = await params;

  const recordMap = await getNotionPage(blockId);

  if (!recordMap) notFound();

  return (
    <>
      <div className="w-full">
        <BackButton />
      </div>

      <NotionPageRenderer recordMap={recordMap} />

      <GoToTop />
    </>
  );
}
