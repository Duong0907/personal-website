import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { THEME } from './constant';
import { useCurrentTheme } from '@/features/theme/hooks';

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
      iconOn={<Icon size="sm" variant="filled" name="dark_mode" />}
      iconOff={<Icon size="sm" name="light_mode" />}
      className="data-checked:bg-highlight"
    />
  );
}
