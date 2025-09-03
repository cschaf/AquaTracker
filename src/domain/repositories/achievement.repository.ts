/**
 * @file Defines the repository interface for managing Achievement data.
 * @licence MIT
 */

/**
 * Represents the interface for a repository that handles the persistence of achievements.
 * This defines the contract that any storage implementation must adhere to for achievements.
 */
export interface AchievementRepository {
  /**
   * Retrieves a list of IDs for all achievements that the user has unlocked.
   * @returns A promise that resolves to an array of achievement IDs.
   */
  getUnlockedAchievementIds(): Promise<string[]>;

  /**
   * Saves the list of unlocked achievement IDs.
   * @param ids - An array of unlocked achievement IDs to save.
   * @returns A promise that resolves when the operation is complete.
   */
  saveUnlockedAchievementIds(ids: string[]): Promise<void>;
}
