import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockRouter } from '../../../../test/i18n-navigation-mock';
import { BackButton } from '../back-button';

describe('BackButton', () => {
  it('goes back in history when clicked', async () => {
    render(<BackButton />);

    await userEvent.click(screen.getByRole('button'));

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });
});
