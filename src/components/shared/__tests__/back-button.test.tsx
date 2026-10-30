import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockRouter } from '../../../../test/i18n-navigation-mock';
import { BackButton } from '../back-button';

jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

describe('BackButton', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('goes back in history when clicked', async () => {
    jest.spyOn(window.history, 'length', 'get').mockReturnValue(2);
    render(<BackButton />);

    await userEvent.click(screen.getByRole('button', { name: 'back' }));

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it('goes to the projects page when there is no history', async () => {
    jest.spyOn(window.history, 'length', 'get').mockReturnValue(1);
    render(<BackButton />);

    await userEvent.click(screen.getByRole('button', { name: 'back' }));

    expect(mockRouter.push).toHaveBeenCalledWith('/projects');
    expect(mockRouter.back).not.toHaveBeenCalled();
  });
});
