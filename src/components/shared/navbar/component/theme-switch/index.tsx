import { flushSync } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { withViewTransition } from '@/lib/utils';
import { THEME } from './constant';
import { useCurrentTheme } from '@/features/theme/hooks';
import DarkModeIcon from '@material-design-icons/svg/filled/dark_mode.svg';
import LightModeIcon from '@material-design-icons/svg/outlined/light_mode.svg';

export function ThemeSwitch() {
  const { isDarkTheme, setTheme } = useCurrentTheme();
  const t = useTranslations('navbar');

  const handleChangeTheme = (checked: Boolean) => {
    // flushSync applies the theme class inside the transition callback
    withViewTransition(() => flushSync(() => setTheme(checked ? THEME.DARK : THEME.LIGHT)));
  };

  return (
    <Switch
      checked={isDarkTheme}
      onCheckedChange={handleChangeTheme}
      aria-label={t('darkMode')}
      size="xl"
      iconOn={<DarkModeIcon className="size-5" />}
      iconOff={<LightModeIcon className="size-5" />}
      className="data-checked:bg-highlight"
    />
  );
}
