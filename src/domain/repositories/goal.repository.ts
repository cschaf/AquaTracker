/**
 * @file Defines the repository interface for managing Goal data.
 * @licence MIT
 */

import type { DailyGoal } from '../entities/goal.entity';

/**
 * Represents the interface for a repository that handles the persistence of the user's daily goal.
 */
export interface GoalRepository {
  /**
   * Retrieves the user's daily water intake goal.
   * @returns A promise that resolves to the daily goal in milliliters.
   */
  getDailyGoal(): Promise<DailyGoal>;

  /**
   * Saves the user's daily water intake goal.
   * @param goal - The daily goal in milliliters to save.
   * @returns A promise that resolves when the operation is complete.
   */
  saveDailyGoal(goal: DailyGoal): Promise<void>;
}
