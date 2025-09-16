/**
 * @file Contains the IndexedDB implementation of the AchievementRepository.
 * @licence MIT
 */

import type { AchievementRepository } from '../../domain/repositories';
import { get, set } from 'idb-keyval';

const ACHIEVEMENTS_KEY = 'achievements';

/**
 * A repository for managing achievement data persistence using IndexedDB.
 */
export class IdbAchievementRepository implements AchievementRepository {
  /**
   * Retrieves a list of IDs for all unlocked achievements from IndexedDB.
   * @returns A promise that resolves to an array of achievement IDs. Returns an empty array if none are found or on error.
   */
  async getUnlockedAchievementIds(): Promise<string[]> {
    const ids = await get<string[]>(ACHIEVEMENTS_KEY);
    return ids || [];
  }

  /**
   * Saves the list of unlocked achievement IDs to IndexedDB.
   * @param ids - An array of unlocked achievement IDs to save.
   * @returns A promise that resolves when the operation is complete.
   */
  async saveUnlockedAchievementIds(ids: string[]): Promise<void> {
    await set(ACHIEVEMENTS_KEY, ids);
  }
}
