import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorPage from '../error';

jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

describe('Error', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('logs the error and retries on click', async () => {
    const error = new Error('Notion is down');
    const retry = jest.fn();

    render(<ErrorPage error={error} retry={retry} />);

    expect(console.error).toHaveBeenCalledWith(error);

    await userEvent.click(screen.getByRole('button', { name: 'retry' }));

    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('links back home', () => {
    render(<ErrorPage error={new Error('x')} retry={jest.fn()} />);

    expect(screen.getByRole('link', { name: 'home' })).toHaveAttribute('href', '/');
  });
});
