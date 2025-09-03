/**
 * @file Determines the initial theme for the application.
 * @licence MIT
 */

import type { GeneralSettings } from '../../domain/entities';

/**
 * Determines the initial theme based on saved settings, localStorage, or OS preference.
 * @returns 'light' or 'dark'
 */
export const getInitialTheme = (): GeneralSettings['theme'] => {
  // This is a reconstruction of the likely logic.
  // 1. Check for a saved theme in localStorage.
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  // 2. Check for the OS preference.
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  // 3. Default to light.
  return 'light';
};
