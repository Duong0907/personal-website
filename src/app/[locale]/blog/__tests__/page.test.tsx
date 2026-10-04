import { render, screen } from '@testing-library/react';
import { getTranslations } from 'next-intl/server';
import BlogPage from '../page';

jest.mock('next-intl/server', () => ({ getTranslations: jest.fn() }));

describe('BlogPage', () => {
  it('renders the blog header from the blog messages', async () => {
    jest.mocked(getTranslations).mockResolvedValue(((key: string) => key) as never);

    render(await BlogPage());

    expect(getTranslations).toHaveBeenCalledWith('blog');
    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'description' })).toBeInTheDocument();
  });
});
