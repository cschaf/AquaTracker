import { useTheme } from '../hooks/useTheme';
import { Button } from './Button';

interface ThemeSwitcherProps {
  onChange: () => void;
}

export function ThemeSwitcher({ onChange }: ThemeSwitcherProps) {
  const { theme } = useTheme();

  return (
    <Button onClick={onChange}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </Button>
  );
}
