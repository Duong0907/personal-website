import { act, render, screen } from '@testing-library/react';
import { useInView } from '../use-in-view';

type ObserverCallback = (entries: Array<Pick<IntersectionObserverEntry, 'isIntersecting'>>) => void;

let fireIntersection: ObserverCallback;
const observe = jest.fn();
const disconnect = jest.fn();
const constructorSpy = jest.fn();

beforeEach(() => {
  window.IntersectionObserver = jest.fn((callback: ObserverCallback, options?: IntersectionObserverInit) => {
    fireIntersection = callback;
    constructorSpy(options);

    return {
      observe,
      disconnect,
      unobserve: jest.fn(),
      takeRecords: jest.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
    };
  }) as unknown as typeof IntersectionObserver;
});

function Probe({ threshold }: { threshold?: number }) {
  const { ref, isVisible } = useInView<HTMLDivElement>(threshold);

  return (
    <div ref={ref} data-testid="probe">
      {isVisible ? 'visible' : 'hidden'}
    </div>
  );
}

describe('useInView', () => {
  it('starts hidden and observes the element', () => {
    render(<Probe />);

    expect(screen.getByTestId('probe')).toHaveTextContent('hidden');
    expect(observe).toHaveBeenCalledWith(screen.getByTestId('probe'));
  });

  it('uses a default threshold of 0.15', () => {
    render(<Probe />);

    expect(constructorSpy).toHaveBeenCalledWith({ threshold: 0.15 });
  });

  it('passes a custom threshold to the observer', () => {
    render(<Probe threshold={0.5} />);

    expect(constructorSpy).toHaveBeenCalledWith({ threshold: 0.5 });
  });

  it('becomes visible and stops observing on the first intersection', () => {
    render(<Probe />);

    act(() => fireIntersection([{ isIntersecting: true }]));

    expect(screen.getByTestId('probe')).toHaveTextContent('visible');
    expect(disconnect).toHaveBeenCalled();
  });

  it('stays hidden while the element is not intersecting', () => {
    render(<Probe />);

    act(() => fireIntersection([{ isIntersecting: false }]));

    expect(screen.getByTestId('probe')).toHaveTextContent('hidden');
    expect(disconnect).not.toHaveBeenCalled();
  });

  it('stays visible after the element leaves the viewport', () => {
    render(<Probe />);

    act(() => fireIntersection([{ isIntersecting: true }]));
    act(() => fireIntersection([{ isIntersecting: false }]));

    expect(screen.getByTestId('probe')).toHaveTextContent('visible');
  });

  it('disconnects on unmount', () => {
    const { unmount } = render(<Probe />);

    unmount();

    expect(disconnect).toHaveBeenCalled();
  });
});
