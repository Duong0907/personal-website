import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GoToTop } from '../back-to-top-button';

const scrollTo = jest.fn();

function scrollWindowTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true });
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

function setReducedMotion(reduce: boolean) {
  window.matchMedia = jest.fn().mockReturnValue({ matches: reduce }) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
  setReducedMotion(false);
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });
});

describe('GoToTop', () => {
  it('renders nothing before the user scrolls', () => {
    render(<GoToTop />);

    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument();
  });

  it('stays hidden at exactly 300px', () => {
    render(<GoToTop />);

    scrollWindowTo(300);

    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument();
  });

  it('shows the button after 300px', () => {
    render(<GoToTop />);

    scrollWindowTo(301);

    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument();
  });

  it('hides the button again when the user scrolls back up', () => {
    render(<GoToTop />);

    scrollWindowTo(500);
    scrollWindowTo(100);

    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument();
  });

  it('scrolls to the top smoothly on click', async () => {
    render(<GoToTop />);
    scrollWindowTo(500);

    await userEvent.click(screen.getByRole('button', { name: 'Back to top' }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('scrolls to the top without animation when reduced motion is preferred', async () => {
    setReducedMotion(true);
    render(<GoToTop />);
    scrollWindowTo(500);

    await userEvent.click(screen.getByRole('button', { name: 'Back to top' }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
  });

  it('removes the scroll listener on unmount', () => {
    const removeListener = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<GoToTop />);

    unmount();

    expect(removeListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
