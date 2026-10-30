import { render, screen } from '@testing-library/react';
import { getTranslations } from 'next-intl/server';
import NotFound from '../not-found';

jest.mock('next-intl/server', () => ({ getTranslations: jest.fn() }));

describe('NotFound', () => {
  it('explains the missing page and links back home', async () => {
    jest.mocked(getTranslations).mockResolvedValue(((key: string) => key) as never);

    render(await NotFound());

    expect(getTranslations).toHaveBeenCalledWith('not-found');
    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'home' })).toHaveAttribute('href', '/');
  });
});
