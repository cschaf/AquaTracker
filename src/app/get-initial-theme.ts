import type { GeneralSettings } from '../core/entities/general-settings';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'general-settings';

export const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedData = window.localStorage.getItem(STORAGE_KEY);

    if (storedData) {
      try {
        const settings: GeneralSettings = JSON.parse(storedData);
        if (settings.theme && ['light', 'dark'].includes(settings.theme)) {
          return settings.theme;
        }
      } catch (error) {
        console.error('Error parsing general settings from localStorage', error);
      }
    }

    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }

  return 'light';
};
