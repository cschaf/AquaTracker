import { useState, useEffect, useCallback } from 'react';
import { useUseCases } from '../../app/use-case-provider';
import type { Theme } from '../../core/entities/general-settings';

export const useTheme = () => {
  const { getGeneralSettings, updateGeneralSettings } = useUseCases();
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getGeneralSettings.execute();
      if (settings) {
        setTheme(settings.theme);
      }
    };
    fetchSettings();
  }, [getGeneralSettings]);

  const updateTheme = useCallback(async (newTheme: Theme) => {
    setTheme(newTheme);
    await updateGeneralSettings.execute({ theme: newTheme });
  }, [updateGeneralSettings]);

  useEffect(() => {
    const root = window.document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (theme === 'dark' || (theme === 'system' && systemPrefersDark)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return { theme, setTheme: updateTheme };
};
