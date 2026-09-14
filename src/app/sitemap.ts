import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAllProjects } from '@/features/notion/services/project';
import { SITE_URL } from '@/lib/constant';

const STATIC_PATHS = ['', '/about', '/projects', '/blog'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  const lastModified = new Date();

  const staticEntries = routing.locales.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified,
    })),
  );

  const articleEntries = routing.locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${SITE_URL}/${locale}/articles/${project.id}`,
      lastModified,
    })),
  );

  return [...staticEntries, ...articleEntries];
}
