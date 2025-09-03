import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGeneralSettings } from '../hooks/useGeneralSettings';
import { getInitialTheme } from './get-initial-theme';
import { eventBus } from '../shared/event-bus/event-bus';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings } = useGeneralSettings();
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    if (settings?.theme && settings.theme !== theme) {
      setTheme(settings.theme);
    }
  // We only want this to run when the settings are first loaded.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    const handleSettingsChanged = (newSettings: { theme: Theme }) => {
      if (newSettings.theme !== theme) {
        setTheme(newSettings.theme);
      }
    };

    eventBus.on('settingsChanged', handleSettingsChanged);

    return () => {
      eventBus.off('settingsChanged', handleSettingsChanged);
    };
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (settings) {
      updateSettings({ ...settings, theme: newTheme });
    } else {
      updateSettings({ theme: newTheme});
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
