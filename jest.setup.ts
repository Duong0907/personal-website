import '@testing-library/jest-dom';

// jsdom lacks these browser APIs. vaul and base-ui call them on mount.
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
  }

  if (!window.ResizeObserver) {
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }

  if (typeof PointerEvent === 'undefined') {
    window.PointerEvent = MouseEvent as unknown as typeof PointerEvent;
  }

  // user-event fires real pointer events. vaul's pointerdown handler captures the
  // pointer and reads the computed transform; jsdom has neither.
  Element.prototype.setPointerCapture ??= () => {};
  Element.prototype.releasePointerCapture ??= () => {};
  Element.prototype.hasPointerCapture ??= () => false;

  const getComputedStyle = window.getComputedStyle.bind(window);
  window.getComputedStyle = (element, pseudoElement) => {
    const style = getComputedStyle(element, pseudoElement);

    // Browsers report 'none' when no transform applies.
    if (!style.transform) {
      Object.defineProperty(style, 'transform', { value: 'none' });
    }

    return style;
  };
}
