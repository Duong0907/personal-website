import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavDialog } from '..';

jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

async function openDrawer() {
  await userEvent.click(screen.getByRole('button'));

  return screen.findByRole('dialog');
}

function expectDrawerToClose() {
  // Radix Presence keeps the node until animationend, which jsdom never fires.
  return waitFor(() => expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('data-state', 'closed'));
}

describe('NavDialog', () => {
  it('is closed by default', () => {
    render(<NavDialog />);

    expect(screen.queryByRole('link', { name: 'home' })).not.toBeInTheDocument();
  });

  it('shows the page links after the menu button is clicked', async () => {
    render(<NavDialog />);

    await openDrawer();

    expect(screen.getByRole('link', { name: 'home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'projects' })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: 'aboutMe' })).toHaveAttribute('href', '/about');
    expect(screen.queryByRole('link', { name: 'blog' })).not.toBeInTheDocument();
  });

  it('closes when a page link is clicked', async () => {
    render(<NavDialog />);
    await openDrawer();

    await userEvent.click(screen.getByRole('link', { name: 'projects' }));

    await expectDrawerToClose();
  });

  it('closes when the logo is clicked', async () => {
    render(<NavDialog />);
    await openDrawer();

    await userEvent.click(screen.getByRole('link', { name: 'DUONG PHAN' }));

    await expectDrawerToClose();
  });
});
