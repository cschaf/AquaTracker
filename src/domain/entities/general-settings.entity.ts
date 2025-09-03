/**
 * @file Defines the GeneralSettings entity.
 * @licence MIT
 */

/**
 * Represents the general user-configurable settings for the application.
 */
export interface GeneralSettings {
  /**
   * The active color theme for the application's UI.
   * 'light' - The light color scheme.
   * 'dark' - The dark color scheme.
   */
  theme: 'light' | 'dark';
}
