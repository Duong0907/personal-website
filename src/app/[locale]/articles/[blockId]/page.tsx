import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/shared/back-button';
import { GoToTop } from '@/components/shared/back-to-top-button';
import { getAllProjects, getProjectById } from '@/features/notion/services/project';
import { getNotionPage } from '@/features/notion/services/page';
import { ContactCta } from '@/features/contact/contact-cta';

const NotionPageRenderer = dynamic(() =>
  import('@/features/notion/components/notion-page-renderer').then((m) => m.NotionPageRenderer),
);

export async function generateStaticParams() {
  const projects = await getAllProjects();

  return projects.map((project) => ({ blockId: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; blockId: string }>;
}): Promise<Metadata> {
  const { locale, blockId } = await params;
  const project = await getProjectById(blockId);

  if (!project) return {};

  const title = `${project.name} | Duong Phan`;
  const description = project.features;

  return {
    title,
    description,
    openGraph: { title, description, type: 'article', locale },
    twitter: { card: 'summary_large_image', title, description },
  };
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

      <ContactCta />

      <GoToTop />
    </>
  );
}
