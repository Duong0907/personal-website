import { getAllProjects } from '@/features/notion/services/project';
import { SITE_URL } from '@/lib/constant';
import sitemap from '../sitemap';

jest.mock('@/i18n/routing', () => ({ routing: { locales: ['en', 'vi'], defaultLocale: 'en' } }));
jest.mock('@/features/notion/services/project', () => ({ getAllProjects: jest.fn() }));

const getAllProjectsMock = jest.mocked(getAllProjects);

function project(id: string) {
  return { id, name: id, status: 'Published', technologies: '', features: '', imageUrl: '' };
}

describe('sitemap', () => {
  it('lists every static path for every locale when there are no projects', async () => {
    getAllProjectsMock.mockResolvedValue([]);

    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).toEqual([
      `${SITE_URL}/en`,
      `${SITE_URL}/en/about`,
      `${SITE_URL}/en/projects`,
      `${SITE_URL}/en/blog`,
      `${SITE_URL}/vi`,
      `${SITE_URL}/vi/about`,
      `${SITE_URL}/vi/projects`,
      `${SITE_URL}/vi/blog`,
    ]);
  });

  it('adds one article URL per project per locale', async () => {
    getAllProjectsMock.mockResolvedValue([project('p1'), project('p2')]);

    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).toHaveLength(12);
    expect(urls.slice(8)).toEqual([
      `${SITE_URL}/en/articles/p1`,
      `${SITE_URL}/en/articles/p2`,
      `${SITE_URL}/vi/articles/p1`,
      `${SITE_URL}/vi/articles/p2`,
    ]);
  });

  it('sets lastModified to a Date on every entry', async () => {
    getAllProjectsMock.mockResolvedValue([project('p1')]);

    const entries = await sitemap();

    for (const entry of entries) {
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });
});
