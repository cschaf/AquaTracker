/**
 * @file Defines the repository interface for managing GeneralSettings data.
 * @licence MIT
 */

import type { GeneralSettings } from '../entities/general-settings.entity';

/**
 * Represents the interface for a repository that handles the persistence of general settings.
 */
export interface GeneralSettingsRepository {
  /**
   * Retrieves the user's general settings.
   * @returns A promise that resolves to the GeneralSettings object, or null if no settings are found.
   */
  get(): Promise<GeneralSettings | null>;

  /**
   * Saves the user's general settings.
   * @param settings - The GeneralSettings object to save.
   * @returns A promise that resolves when the operation is complete.
   */
  save(settings: GeneralSettings): Promise<void>;
}
