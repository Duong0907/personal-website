import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import { getNotionPage } from '@/features/notion/services/page';
import { getAllProjects } from '@/features/notion/services/project';
import ArticlePage, { generateStaticParams } from '../page';

jest.mock('next/navigation', () => ({ notFound: jest.fn() }));
jest.mock('@/features/notion/services/page', () => ({ getNotionPage: jest.fn() }));
jest.mock('@/features/notion/services/project', () => ({ getAllProjects: jest.fn() }));
jest.mock('@/components/shared/back-button', () => ({ BackButton: () => 'back-button' }));
jest.mock('@/components/shared/back-to-top-button', () => ({ GoToTop: () => 'go-to-top' }));
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () =>
    function MockNotionPageRenderer({ recordMap }: { recordMap: { id: string } }) {
      return `notion-page-renderer:${recordMap.id}`;
    },
}));

beforeEach(() => {
  jest.mocked(notFound).mockImplementation(() => {
    throw new Error('NEXT_NOT_FOUND');
  });
});

describe('generateStaticParams', () => {
  it('returns one blockId per published project', async () => {
    jest.mocked(getAllProjects).mockResolvedValue([
      { id: 'p1', name: '', status: '', technologies: '', features: '', imageUrl: '' },
      { id: 'p2', name: '', status: '', technologies: '', features: '', imageUrl: '' },
    ]);

    await expect(generateStaticParams()).resolves.toEqual([{ blockId: 'p1' }, { blockId: 'p2' }]);
  });
});

describe('ArticlePage', () => {
  it('loads the Notion page for the blockId and renders it with navigation buttons', async () => {
    jest.mocked(getNotionPage).mockResolvedValue({ id: 'article-record-map' } as never);

    const { container } = render(await ArticlePage({ params: Promise.resolve({ blockId: 'abc' }) }));

    expect(getNotionPage).toHaveBeenCalledWith('abc');
    expect(container).toHaveTextContent('back-button');
    expect(container).toHaveTextContent('notion-page-renderer:article-record-map');
    expect(container).toHaveTextContent('go-to-top');
  });

  it('returns 404 when the Notion page cannot be loaded', async () => {
    jest.mocked(getNotionPage).mockResolvedValue(null);

    await expect(ArticlePage({ params: Promise.resolve({ blockId: 'missing' }) })).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
