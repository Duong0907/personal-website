import { ProjectList } from '@/features/projects/project-list';
import { SectionHeader } from '@/components/shared/section-header';
import { getTranslations } from 'next-intl/server';
import { getAllProjects } from '@/features/notion/services/project';

export default async function ProjectPage() {
  const [t, projects] = await Promise.all([getTranslations('projects'), getAllProjects()]);

  return (
    <>
      <SectionHeader title={t('title')} description={t('description')}></SectionHeader>
      <ProjectList projects={projects} />
    </>
  );
}
