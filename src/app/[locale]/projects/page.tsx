import { ProjectList } from '@/components/shared/project-list';
import { SectionHeader } from '@/components/shared/section-header';
import { getAllProjects } from '@/services/notion/project';
import { getTranslations } from 'next-intl/server';

export default async function ProjectPage() {
  const [t, projects] = await Promise.all([getTranslations('projects'), getAllProjects()]);

  return (
    <>
      <SectionHeader title={t('title')} description={t('description')}></SectionHeader>
      <ProjectList projects={projects} />
    </>
  );
}
