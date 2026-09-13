import { THEME } from '@/components/shared/navbar/component/theme-switch/constant';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const useCurrentTheme = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // useEffect to avoid hydration error
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDarkTheme(resolvedTheme === THEME.DARK);
  }, [setIsDarkTheme, resolvedTheme]);

  return { isDarkTheme, theme: resolvedTheme, setTheme };
};
