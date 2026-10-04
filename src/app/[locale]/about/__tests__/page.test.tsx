import { render, screen } from '@testing-library/react';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getNotionPage } from '@/features/notion/services/page';
import AboutPage from '../page';

jest.mock('next-intl/server', () => ({ getTranslations: jest.fn() }));
jest.mock('next/navigation', () => ({ notFound: jest.fn() }));
jest.mock('@/features/notion/services/page', () => ({ getNotionPage: jest.fn() }));
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () =>
    function MockNotionPageRenderer({ recordMap }: { recordMap: { id: string } }) {
      return `notion-page-renderer:${recordMap.id}`;
    },
}));

const recordMap = { id: 'about-record-map' };

beforeEach(() => {
  process.env.ABOUT_PAGE_ID = 'about-page-id';
  jest.mocked(getTranslations).mockResolvedValue(((key: string) => key) as never);
  jest.mocked(getNotionPage).mockResolvedValue(recordMap as never);
  jest.mocked(notFound).mockImplementation(() => {
    throw new Error('NEXT_NOT_FOUND');
  });
});

afterEach(() => {
  delete process.env.ABOUT_PAGE_ID;
});

describe('AboutPage', () => {
  it('loads the about-me messages and the configured Notion page', async () => {
    await AboutPage();

    expect(getTranslations).toHaveBeenCalledWith('about-me');
    expect(getNotionPage).toHaveBeenCalledWith('about-page-id');
  });

  it('renders the header and the Notion content', async () => {
    render(await AboutPage());

    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'description' })).toBeInTheDocument();
    expect(screen.getByText('notion-page-renderer:about-record-map')).toBeInTheDocument();
  });

  it('returns 404 when ABOUT_PAGE_ID is not set', async () => {
    delete process.env.ABOUT_PAGE_ID;

    await expect(AboutPage()).rejects.toThrow('NEXT_NOT_FOUND');
    expect(getNotionPage).not.toHaveBeenCalled();
  });

  it('returns 404 when the Notion page cannot be loaded', async () => {
    jest.mocked(getNotionPage).mockResolvedValue(null);

    await expect(AboutPage()).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
