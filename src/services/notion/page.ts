import { unstable_cache } from 'next/cache';
import { notionApi } from './notion';
import { NOTION_CACHE_REVALIDATE_TIME } from '@/lib/constant';

export const getNotionPage = unstable_cache(
  async (blockId) => {
    try {
      const recordMap = await notionApi.getPage(blockId);

      return recordMap;
    } catch (error) {
      console.error('Error fetching page from Notion:', error);

      return null;
    }
  },
  ['notion-record-map'],
  {
    revalidate: NOTION_CACHE_REVALIDATE_TIME,
  },
);
