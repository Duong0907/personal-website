import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/shared/back-button';
import { GoToTop } from '@/components/shared/back-to-top-button';
import { Typography } from '@/components/ui/typography';
import { getAllProjects, getProjectById } from '@/features/notion/services/project';
import { getNotionPage } from '@/features/notion/services/page';
import { EnglishOnlyNotice } from '@/features/notion/components/english-only-notice';
import { ContactCta } from '@/features/contact/contact-cta';
import { ProjectLinks } from '@/features/projects/project-card';
import { TechList } from '@/features/projects/tech-list';

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

  const [recordMap, project] = await Promise.all([getNotionPage(blockId), getProjectById(blockId)]);

  if (!recordMap) notFound();

  return (
    <>
      <div className="w-full">
        <BackButton />
      </div>

      {project && (
        // Matches react-notion-x's .notion-full-width padding so header and body share one left edge.
        <header className="mb-10 flex w-full flex-col gap-4 px-[min(96px,8vw)]">
          <Typography variant="h1" weight="bold">
            {project.name}
          </Typography>
          {project.features !== 'N/A' && (
            <Typography variant="body" weight="light" className="text-xl">
              {project.features}
            </Typography>
          )}
          <TechList technologies={project.technologies} />
          <ProjectLinks githubUrl={project.githubUrl} websiteUrl={project.websiteUrl} />
        </header>
      )}

      <EnglishOnlyNotice />

      <NotionPageRenderer recordMap={recordMap} />

      <ContactCta withLeadIn />

      <GoToTop />
    </>
  );
}
