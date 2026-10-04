import { notion } from '../notion';
import { getAllProjects } from '../project';

jest.mock('../notion', () => ({ notion: { dataSources: { query: jest.fn() } } }));
jest.mock('next/cache', () => ({ unstable_cache: jest.fn() }));

const query = jest.mocked(notion.dataSources.query);

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
  },
};

const fallbackProject = {
  name: 'Untitled Project',
  status: 'N/A',
  technologies: 'N/A',
  features: 'N/A',
  imageUrl: '',
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
        imageUrl: 'https://example.com/a.png',
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
        },
      },
    ]);

    await expect(getAllProjects()).resolves.toEqual([{ id: 'page-3', ...fallbackProject }]);
  });

  it('uses an empty image URL for an external (non-file) thumbnail', async () => {
    mockResults([{ id: 'page-4', properties: { Thumbnail: { files: [{ external: { url: 'https://x.y/z.png' } }] } } }]);

    const [project] = await getAllProjects();

    expect(project.imageUrl).toBe('');
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
