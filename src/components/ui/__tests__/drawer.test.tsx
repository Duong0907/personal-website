import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../drawer';

function TestDrawer() {
  return (
    <Drawer direction="top">
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader data-testid="header">
          <DrawerTitle>Title</DrawerTitle>
          <DrawerDescription>Description</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter data-testid="footer">
          <DrawerClose>Done</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

describe('Drawer', () => {
  it('is closed by default', () => {
    render(<TestDrawer />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens from the trigger with the requested direction', async () => {
    render(<TestDrawer />);

    await userEvent.click(screen.getByRole('button', { name: 'Open' }));

    const drawer = await screen.findByRole('dialog');

    expect(drawer).toHaveAttribute('data-slot', 'drawer-content');
    expect(drawer).toHaveAttribute('data-vaul-drawer-direction', 'top');
    expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'drawer-title');
    expect(screen.getByText('Description')).toHaveAttribute('data-slot', 'drawer-description');
    expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'drawer-header');
    expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'drawer-footer');
  });

  it('closes from DrawerClose', async () => {
    render(<TestDrawer />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');

    await userEvent.click(screen.getByRole('button', { name: 'Done' }));

    // Radix Presence keeps the node mounted until an animationend event, which jsdom never fires.
    await waitFor(() => expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('data-state', 'closed'));
  });
});
