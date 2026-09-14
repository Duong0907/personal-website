import { notionApi } from './notion';
import { cachedInProduction } from './cached-in-production';
import { NOTION_IMAGE_URL_CACHE_TTL_SECONDS } from '@/lib/constant';

async function fetchNotionPage(blockId: string) {
  try {
    const recordMap = await notionApi.getPage(blockId);

    return recordMap;
  } catch (error) {
    console.error('Error fetching page from Notion:', error);

    return null;
  }
}

export const getNotionPage = cachedInProduction(fetchNotionPage, ['notion-record-map'], {
  tags: ['notion'],
  revalidate: NOTION_IMAGE_URL_CACHE_TTL_SECONDS,
});
