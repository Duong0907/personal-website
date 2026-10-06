import type { QueryDataSourceResponse } from '@notionhq/client';
import { notion } from './notion';
import type { Project } from '@/interfaces/project';
import { cachedInProduction } from './cached-in-production';
import { NOTION_IMAGE_URL_CACHE_TTL_SECONDS } from '@/lib/constant';
import type { DataSourceRow, NotionPageResult } from '../types';

const NOTION_DATASOURCE_ID = process.env.NOTION_DATASOURCE_ID || '';

// TODO: Handle external image url structure:
// { Thumbnail: { files: [{ external: { url: 'https://x.y/z.png' } }] } }
const mapProjectEntity = (item: DataSourceRow): Project => {
  const { id, properties: props = {} } = item as NotionPageResult;

  return {
    id,
    name: props.Name?.title?.[0]?.plain_text ?? 'Untitled Project',
    status: props.Status?.select?.name ?? 'N/A',
    technologies: props.Technologies?.rich_text?.[0]?.plain_text ?? 'N/A',
    features: props.Features?.rich_text?.[0]?.plain_text ?? 'N/A',
    imageUrl: props.Thumbnail?.files?.[0]?.file?.url ?? '',
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
