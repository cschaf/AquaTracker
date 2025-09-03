/**
 * @file Contains the localStorage implementation of the AchievementRepository.
 * @licence MIT
 */

import { AchievementRepository } from '../../domain/repositories';
import { getItem, setItem } from '../storage/local.storage';

const UNLOCKED_ACHIEVEMENTS_KEY = 'unlockedAchievements';

/**
 * A repository for managing achievement data persistence using the browser's localStorage.
 */
export class LocalStorageAchievementRepository implements AchievementRepository {
  /**
   * Retrieves a list of IDs for all unlocked achievements from localStorage.
   * @returns A promise that resolves to an array of achievement IDs. Returns an empty array if none are found or on error.
   */
  async getUnlockedAchievementIds(): Promise<string[]> {
    // The getItem wrapper handles parsing and errors, returning null if not found or invalid.
    const ids = getItem<string[]>(UNLOCKED_ACHIEVEMENTS_KEY);
    return ids || [];
  }

  /**
   * Saves the list of unlocked achievement IDs to localStorage.
   * @param ids - An array of unlocked achievement IDs to save.
   * @returns A promise that resolves when the operation is complete.
   */
  async saveUnlockedAchievementIds(ids: string[]): Promise<void> {
    // The setItem wrapper handles stringifying and errors.
    setItem(UNLOCKED_ACHIEVEMENTS_KEY, ids);
  }
}
