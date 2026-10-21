import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Crossfade the DOM change with the View Transitions API, falling back to an instant update.
export function withViewTransition(update: () => void | Promise<void>) {
  if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    update();
    return;
  }
  document.startViewTransition(update);
}
