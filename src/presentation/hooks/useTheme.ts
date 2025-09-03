/**
 * @file Custom hook for accessing the theme context.
 * @licence MIT
 */

// Note: This import path will be valid after `theme-provider` is moved.
import { useThemeContext } from '../theme/theme-provider';

/**
 * A hook to access the theme context.
 * Provides the current theme and a function to toggle it.
 * @returns The theme context value.
 */
export function useTheme() {
  return useThemeContext();
}
