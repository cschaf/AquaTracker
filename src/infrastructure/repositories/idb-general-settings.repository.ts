/**
 * @file Contains the IndexedDB implementation of the GeneralSettingsRepository.
 * @licence MIT
 */

import type { GeneralSettingsRepository } from '../../domain/repositories';
import type { GeneralSettings } from '../../domain/entities';
import { get, set } from 'idb-keyval';

const STORAGE_KEY = 'generalSettings';

/**
 * A repository for managing general settings data persistence using IndexedDB.
 */
export class IdbGeneralSettingsRepository implements GeneralSettingsRepository {
  /**
   * Retrieves the user's general settings from IndexedDB.
   * @returns A promise that resolves to the GeneralSettings object, or null if not found.
   */
  async get(): Promise<GeneralSettings | null> {
    const settings = await get<GeneralSettings>(STORAGE_KEY);
    return settings || null;
  }

  /**
   * Saves the user's general settings to IndexedDB.
   * @param settings - The GeneralSettings object to save.
   * @returns A promise that resolves when the operation is complete.
   */
  async save(settings: GeneralSettings): Promise<void> {
    await set(STORAGE_KEY, settings);
  }
}
