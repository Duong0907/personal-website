import 'server-only';

import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';

const globalForNotion = globalThis as unknown as { notion: Client; notionApi: NotionAPI };

export const notion: Client =
  globalForNotion.notion ||
  new Client({
    auth: process.env.NOTION_TOKEN,
  });

export const notionApi = globalForNotion.notionApi || new NotionAPI();

if (process.env.NODE_ENV !== 'production') {
  globalForNotion.notion = notion;
  globalForNotion.notionApi = notionApi;
}
