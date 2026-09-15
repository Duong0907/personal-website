import { Switch } from '@/components/ui/switch';
import { THEME } from './constant';
import { useCurrentTheme } from '@/features/theme/hooks';
import DarkModeIcon from '@material-design-icons/svg/filled/dark_mode.svg';
import LightModeIcon from '@material-design-icons/svg/outlined/light_mode.svg';

export function ThemeSwitch() {
  const { isDarkTheme, setTheme } = useCurrentTheme();

  const handleChangeTheme = (checked: Boolean) => {
    setTheme(checked ? THEME.DARK : THEME.LIGHT);
  };

  return (
    <Switch
      checked={isDarkTheme}
      onCheckedChange={handleChangeTheme}
      size="xl"
      iconOn={<DarkModeIcon className="size-5" />}
      iconOff={<LightModeIcon className="size-5" />}
      className="data-checked:bg-highlight"
    />
  );
}
