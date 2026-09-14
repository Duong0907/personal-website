import dynamic from 'next/dynamic';
import { getNotionPage } from '@/services/notion/page';
import { getAllProjects } from '@/services/notion/project';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/shared/back-button';

const NotionPageRenderer = dynamic(() =>
  import('@/components/shared/notion-page-renderer').then((m) => m.NotionPageRenderer),
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
      <div className="w-full my-4">
        <BackButton />
      </div>

      <NotionPageRenderer recordMap={recordMap} />
    </>
  );
}
