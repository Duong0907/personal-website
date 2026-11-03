import { notion } from '../notion';
import { getAllProjects, getProjectById, getProjectThumbnailUrl } from '../project';

// project.ts reads NOTION_DATASOURCE_ID at import; this hoisted factory runs before that.
jest.mock('../notion', () => {
  process.env.NOTION_DATASOURCE_ID = 'ds-1';

  return { notion: { dataSources: { query: jest.fn() }, pages: { retrieve: jest.fn() } } };
});
jest.mock('next/cache', () => ({ unstable_cache: jest.fn() }));

const query = jest.mocked(notion.dataSources.query);
const retrieve = jest.mocked(notion.pages.retrieve);

function mockResults(results: unknown[]) {
  query.mockResolvedValue({ results } as never);
}

const fullRow = {
  id: 'page-1',
  properties: {
    Name: { title: [{ plain_text: 'Portfolio' }] },
    Status: { select: { name: 'Published' } },
    Technologies: { rich_text: [{ plain_text: 'Next.js' }] },
    Features: { rich_text: [{ plain_text: 'i18n' }] },
    Thumbnail: { files: [{ file: { url: 'https://example.com/a.png' } }] },
    'Github Frontend': { rich_text: [{ text: { content: 'https://github.com/me/portfolio' } }] },
    'Github Backend': { rich_text: [{ text: { content: 'https://github.com/me/portfolio-api' } }] },
    Website: { rich_text: [{ text: { content: 'https://portfolio.dev' } }] },
  },
};

const fallbackProject = {
  name: 'Untitled Project',
  status: 'N/A',
  technologies: 'N/A',
  features: 'N/A',
  imageUrl: '',
  githubFrontendUrl: '',
  githubBackendUrl: '',
  websiteUrl: '',
};

describe('getAllProjects', () => {
  it('queries only published rows', async () => {
    mockResults([]);

    await getAllProjects();

    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: { property: 'Status', select: { equals: 'Published' }, type: 'select' },
      }),
    );
  });

  it('maps every property of a full row', async () => {
    mockResults([fullRow]);

    await expect(getAllProjects()).resolves.toEqual([
      {
        id: 'page-1',
        name: 'Portfolio',
        status: 'Published',
        technologies: 'Next.js',
        features: 'i18n',
        imageUrl: '/api/notion-image/page-1',
        githubFrontendUrl: 'https://github.com/me/portfolio',
        githubBackendUrl: 'https://github.com/me/portfolio-api',
        websiteUrl: 'https://portfolio.dev',
      },
    ]);
  });

  it('uses fallbacks when the row has no properties key', async () => {
    mockResults([{ id: 'page-2' }]);

    await expect(getAllProjects()).resolves.toEqual([{ id: 'page-2', ...fallbackProject }]);
  });

  it('uses fallbacks when properties exist but are empty', async () => {
    mockResults([
      {
        id: 'page-3',
        properties: {
          Name: { title: [] },
          Status: { select: null },
          Technologies: { rich_text: [] },
          Features: { rich_text: [] },
          Thumbnail: { files: [] },
          'Github Frontend': { rich_text: [] },
          'Github Backend': { rich_text: [] },
          Website: { rich_text: [] },
        },
      },
    ]);

    await expect(getAllProjects()).resolves.toEqual([{ id: 'page-3', ...fallbackProject }]);
  });

  it('points an external thumbnail at the image route too', async () => {
    mockResults([{ id: 'page-4', properties: { Thumbnail: { files: [{ external: { url: 'https://x.y/z.png' } }] } } }]);

    const [project] = await getAllProjects();

    expect(project.imageUrl).toBe('/api/notion-image/page-4');
  });

  it('keeps the order of the results', async () => {
    mockResults([{ id: 'b' }, { id: 'a' }]);

    const projects = await getAllProjects();

    expect(projects.map((p) => p.id)).toEqual(['b', 'a']);
  });

  it('returns an empty list and logs when the query fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    query.mockRejectedValue(new Error('rate limited'));

    await expect(getAllProjects()).resolves.toEqual([]);
    expect(consoleError).toHaveBeenCalledWith('Error fetching projects from Notion:', expect.any(Error));
  });
});

describe('getProjectById', () => {
  it('returns the project with the matching id', async () => {
    mockResults([fullRow, { id: 'page-2' }]);

    await expect(getProjectById('page-1')).resolves.toEqual(
      expect.objectContaining({ id: 'page-1', name: 'Portfolio' }),
    );
  });

  it('returns undefined when no project has the id', async () => {
    mockResults([fullRow]);

    await expect(getProjectById('missing')).resolves.toBeUndefined();
  });
});

describe('getProjectThumbnailUrl', () => {
  const page = (dataSourceId: string, status: string) => ({
    parent: { data_source_id: dataSourceId },
    properties: {
      Status: { select: { name: status } },
      Thumbnail: { files: [{ file: { url: 'https://example.com/fresh.png' } }] },
    },
  });

  it('returns the freshly signed thumbnail URL of a published project', async () => {
    retrieve.mockResolvedValue(page('ds-1', 'Published') as never);

    await expect(getProjectThumbnailUrl('page-1')).resolves.toBe('https://example.com/fresh.png');
    expect(retrieve).toHaveBeenCalledWith({ page_id: 'page-1' });
  });

  it('returns the URL of an external thumbnail', async () => {
    retrieve.mockResolvedValue({
      parent: { data_source_id: 'ds-1' },
      properties: {
        Status: { select: { name: 'Published' } },
        Thumbnail: { files: [{ external: { url: 'https://x.y/z.png' } }] },
      },
    } as never);

    await expect(getProjectThumbnailUrl('page-1')).resolves.toBe('https://x.y/z.png');
  });

  it('returns null for a page outside the projects data source', async () => {
    retrieve.mockResolvedValue(page('other', 'Published') as never);

    await expect(getProjectThumbnailUrl('page-1')).resolves.toBeNull();
  });

  it('returns null for an unpublished project', async () => {
    retrieve.mockResolvedValue(page('ds-1', 'Craft') as never);

    await expect(getProjectThumbnailUrl('page-1')).resolves.toBeNull();
  });

  it('returns null when the project has no uploaded thumbnail', async () => {
    retrieve.mockResolvedValue({
      parent: { data_source_id: 'ds-1' },
      properties: { Status: { select: { name: 'Published' } } },
    } as never);

    await expect(getProjectThumbnailUrl('page-1')).resolves.toBeNull();
  });

  it('returns null and logs when Notion fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    retrieve.mockRejectedValue(new Error('not found'));

    await expect(getProjectThumbnailUrl('page-1')).resolves.toBeNull();
    expect(consoleError).toHaveBeenCalledWith('Error fetching project thumbnail from Notion:', expect.any(Error));
  });
});
