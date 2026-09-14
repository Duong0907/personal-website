import type { QueryDataSourceResponse } from '@notionhq/client';

export type DataSourceRow = QueryDataSourceResponse['results'][number];

export type NotionPageResult = { id: string; properties?: Record<string, any> };
