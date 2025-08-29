import { useTheme } from '../../hooks/useTheme';
import { Button } from './Button';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </Button>
  );
}
