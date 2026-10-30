import { render, screen } from '@testing-library/react';
import { getLocale, getTranslations } from 'next-intl/server';
import { EnglishOnlyNotice } from '..';

jest.mock('next-intl/server', () => ({ getLocale: jest.fn(), getTranslations: jest.fn() }));

beforeEach(() => {
  jest.mocked(getTranslations).mockResolvedValue(((key: string) => key) as never);
});

describe('EnglishOnlyNotice', () => {
  it('tells Vietnamese readers the content is in English', async () => {
    jest.mocked(getLocale).mockResolvedValue('vi');

    render(await EnglishOnlyNotice());

    expect(getTranslations).toHaveBeenCalledWith('notion');
    expect(screen.getByText('englishOnly')).toBeInTheDocument();
  });

  it('renders nothing in English', async () => {
    jest.mocked(getLocale).mockResolvedValue('en');

    expect(await EnglishOnlyNotice()).toBeNull();
  });
});
