import { get, map } from 'lodash';
import type { QueryDataSourceResponse } from '@notionhq/client';
import { notion } from './notion';
import type { Project } from '@/interfaces/project';
import { cachedInProduction } from './cached-in-production';

const NOTION_DATASOURCE_ID = process.env.NOTION_DATASOURCE_ID || '';

type DataSourceRow = QueryDataSourceResponse['results'][number];

const mapProjectEntity = (item: DataSourceRow): Project => {
  const props = get(item, 'properties', {});

  return {
    id: get(item, 'id'),
    name: get(props, 'Name.title[0].plain_text', 'Untitled Project'),
    status: get(props, 'Status.select.name', 'N/A'),
    technologies: get(props, 'Technologies.rich_text[0].plain_text', 'N/A'),
    features: get(props, 'Features.rich_text[0].plain_text', 'N/A'),
    imageUrl: get(props, 'Thumbnail.files[0].file.url', ''),
  };
};

const getProjectLists = (response: QueryDataSourceResponse): Project[] => {
  const results = get(response, 'results', []);

  return map(results, mapProjectEntity);
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

export const getAllProjects = cachedInProduction(fetchAllProjects, ['notion-get-all-projects'], { tags: ['notion'] });
