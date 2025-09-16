/**
 * @file Contains the IndexedDB implementation of the GoalRepository.
 * @licence MIT
 */

import type { GoalRepository } from '../../domain/repositories';
import type { DailyGoal } from '../../domain/entities';
import { get, set } from 'idb-keyval';

const GOAL_DATA_KEY = 'goalData';
const DEFAULT_GOAL = 2000;

/**
 * A repository for managing goal data persistence using IndexedDB.
 */
export class IdbGoalRepository implements GoalRepository {
  /**
   * Retrieves the user's daily water intake goal from IndexedDB.
   * If no goal is set, it returns a default value.
   * @returns A promise that resolves to the daily goal in milliliters.
   */
  async getDailyGoal(): Promise<DailyGoal> {
    const savedGoal = await get<DailyGoal>(GOAL_DATA_KEY);
    return savedGoal || DEFAULT_GOAL;
  }

  /**
   * Saves the user's daily water intake goal to IndexedDB.
   * @param goal - The daily goal in milliliters to save.
   * @returns A promise that resolves when the operation is complete.
   */
  async saveDailyGoal(goal: DailyGoal): Promise<void> {
    await set(GOAL_DATA_KEY, goal);
  }
}
