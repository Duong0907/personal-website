import type { QueryDataSourceResponse } from '@notionhq/client';
import { notion } from './notion';
import type { Project } from '@/interfaces/project';
import { cachedInProduction } from './cached-in-production';
import { NOTION_IMAGE_URL_CACHE_TTL_SECONDS } from '@/lib/constant';
import type { DataSourceRow, NotionPageResult } from '../types';

const NOTION_DATASOURCE_ID = process.env.NOTION_DATASOURCE_ID || '';

// Notion file URLs expire after an hour, so the card points at a stable route that re-signs on request.
// External links go through the same route, so next/image optimizes them without listing each host.
const mapProjectEntity = (item: DataSourceRow): Project => {
  const { id, properties: props = {} } = item as NotionPageResult;

  return {
    id,
    name: props.Name?.title?.[0]?.plain_text ?? 'Untitled Project',
    status: props.Status?.select?.name ?? 'N/A',
    technologies: props.Technologies?.rich_text?.[0]?.plain_text ?? 'N/A',
    features: props.Features?.rich_text?.[0]?.plain_text ?? 'N/A',
    imageUrl: props.Thumbnail?.files?.[0] ? `/api/notion-image/${id}` : '',
    githubFrontendUrl: props['Github Frontend']?.rich_text?.[0]?.text?.content ?? '',
    githubBackendUrl: props['Github Backend']?.rich_text?.[0]?.text?.content ?? '',
    websiteUrl: props.Website?.rich_text?.[0]?.text?.content ?? '',
  };
};

const getProjectLists = (response: QueryDataSourceResponse): Project[] => {
  return response.results.map(mapProjectEntity);
};

async function fetchAllProjects(): Promise<Project[]> {
  try {
    const response = await notion.dataSources.query({
      data_source_id: NOTION_DATASOURCE_ID,
      filter: {
        property: 'Status',
        select: { equals: 'Published' },
        type: 'select',
      },
    });

    return getProjectLists(response);
  } catch (error) {
    console.error('Error fetching projects from Notion:', error);

    return [];
  }
}

export const getAllProjects = cachedInProduction(fetchAllProjects, ['notion-get-all-projects'], {
  tags: ['notion'],
  revalidate: NOTION_IMAGE_URL_CACHE_TTL_SECONDS,
});

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getAllProjects();

  return projects.find((project) => project.id === id);
}

// Uncached on purpose: every call returns a freshly signed Notion file URL.
export async function getProjectThumbnailUrl(id: string): Promise<string | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const { parent, properties: props = {} } = page as NotionPageResult & { parent?: { data_source_id?: string } };

    if (parent?.data_source_id !== NOTION_DATASOURCE_ID || props.Status?.select?.name !== 'Published') {
      return null;
    }

    const thumbnail = props.Thumbnail?.files?.[0];

    return thumbnail?.file?.url ?? thumbnail?.external?.url ?? null;
  } catch (error) {
    console.error('Error fetching project thumbnail from Notion:', error);

    return null;
  }
}
