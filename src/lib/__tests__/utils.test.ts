import { withViewTransition } from '../utils';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = jest.fn().mockReturnValue({ matches });
}

describe('withViewTransition', () => {
  afterEach(() => {
    delete (document as Partial<Document>).startViewTransition;
  });

  it('runs the update directly when View Transitions are unsupported', () => {
    const update = jest.fn();

    withViewTransition(update);

    expect(update).toHaveBeenCalledTimes(1);
  });

  it('runs the update directly when the user prefers reduced motion', () => {
    const startViewTransition = jest.fn();
    document.startViewTransition = startViewTransition;
    mockMatchMedia(true);
    const update = jest.fn();

    withViewTransition(update);

    expect(update).toHaveBeenCalledTimes(1);
    expect(startViewTransition).not.toHaveBeenCalled();
  });

  it('wraps the update in a view transition otherwise', () => {
    const startViewTransition = jest.fn();
    document.startViewTransition = startViewTransition;
    mockMatchMedia(false);
    const update = jest.fn();

    withViewTransition(update);

    expect(startViewTransition).toHaveBeenCalledWith(update);
    expect(update).not.toHaveBeenCalled();
  });
});
