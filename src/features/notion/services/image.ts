import { notion } from './notion';
import { getProjectThumbnailUrl } from './project';

// Uncached on purpose: every call returns a freshly signed Notion file URL.
// Serves article image blocks, and project pages (their Thumbnail).
export async function getNotionImageUrl(id: string): Promise<string | null> {
  try {
    const block = await notion.blocks.retrieve({ block_id: id });

    if (!('type' in block)) return null;

    // Image in NotionPageRenderer: the external images
    // are already handled in NotionPageRenderer component
    if (block.type === 'image') return block.image.type === 'file' ? block.image.file.url : null;

    // Image in page's properties
    if (block.type === 'child_page') return getProjectThumbnailUrl(id);

    return null;
  } catch (error) {
    console.error('Error fetching image from Notion:', error);

    return null;
  }
}
