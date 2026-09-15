'use client';

import { useEffect, useState } from 'react';
import ArrowUpwardIcon from '@material-design-icons/svg/outlined/arrow_upward.svg';
import { Button } from '../ui/button';

const SHOW_AFTER_PX = 300;

export function GoToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })}
      aria-label="Back to top"
      variant="clear"
      className="fixed bottom-6 right-6 z-50 rounded-full border border-foreground shadow-md hover:bg-foreground hover:text-background transition-colors"
    >
      <ArrowUpwardIcon className="size-6" />
    </Button>
  );
}
