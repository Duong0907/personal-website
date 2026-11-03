import { notion } from '../notion';
import { getProjectThumbnailUrl } from '../project';
import { getNotionImageUrl } from '../image';

jest.mock('../notion', () => ({ notion: { blocks: { retrieve: jest.fn() } } }));
jest.mock('../project', () => ({ getProjectThumbnailUrl: jest.fn() }));

const retrieve = jest.mocked(notion.blocks.retrieve);

function mockBlock(block: unknown) {
  retrieve.mockResolvedValue(block as never);
}

describe('getNotionImageUrl', () => {
  it('returns the freshly signed URL of an uploaded image block', async () => {
    mockBlock({ type: 'image', image: { type: 'file', file: { url: 'https://example.com/fresh.png' } } });

    await expect(getNotionImageUrl('img1')).resolves.toBe('https://example.com/fresh.png');
    expect(retrieve).toHaveBeenCalledWith({ block_id: 'img1' });
  });

  it('returns null for an external image block', async () => {
    mockBlock({ type: 'image', image: { type: 'external', external: { url: 'https://x.y/z.png' } } });

    await expect(getNotionImageUrl('img1')).resolves.toBeNull();
  });

  it('returns the project thumbnail for a project page', async () => {
    mockBlock({ type: 'child_page' });
    jest.mocked(getProjectThumbnailUrl).mockResolvedValue('https://example.com/thumb.png');

    await expect(getNotionImageUrl('page-1')).resolves.toBe('https://example.com/thumb.png');
    expect(getProjectThumbnailUrl).toHaveBeenCalledWith('page-1');
  });

  it('returns null for any other block type', async () => {
    mockBlock({ type: 'paragraph' });

    await expect(getNotionImageUrl('p1')).resolves.toBeNull();
  });

  it('returns null for a partial block response', async () => {
    mockBlock({ object: 'block', id: 'x' });

    await expect(getNotionImageUrl('x')).resolves.toBeNull();
  });

  it('returns null and logs when Notion fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    retrieve.mockRejectedValue(new Error('not found'));

    await expect(getNotionImageUrl('img1')).resolves.toBeNull();
    expect(consoleError).toHaveBeenCalledWith('Error fetching image from Notion:', expect.any(Error));
  });
});
