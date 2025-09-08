/**
 * @file Contains the localStorage implementation of the GeneralSettingsRepository.
 * @licence MIT
 */

import type { GeneralSettingsRepository } from '../../domain/repositories';
import type { GeneralSettings } from '../../domain/entities';
import { getItem, setItem } from '../storage/local.storage';

const STORAGE_KEY = 'general-settings';

/**
 * A repository for managing general settings data persistence using localStorage.
 */
export class LocalStorageGeneralSettingsRepository implements GeneralSettingsRepository {
  /**
   * Retrieves the user's general settings from localStorage.
   * @returns A promise that resolves to the GeneralSettings object, or null if not found.
   */
  async get(): Promise<GeneralSettings | null> {
    return getItem<GeneralSettings>(STORAGE_KEY);
  }

  /**
   * Saves the user's general settings to localStorage.
   * @param settings - The GeneralSettings object to save.
   * @returns A promise that resolves when the operation is complete.
   */
  async save(settings: GeneralSettings): Promise<void> {
    setItem(STORAGE_KEY, settings);
  }
}
