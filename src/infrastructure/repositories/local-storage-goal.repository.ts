/**
 * @file Contains the localStorage implementation of the GoalRepository.
 * @licence MIT
 */

import type { GoalRepository } from '../../domain/repositories';
import type { DailyGoal } from '../../domain/entities';
import { getItem, setItem } from '../storage/local.storage';

const WATER_TRACKER_GOAL_KEY = 'waterTrackerGoal';
const DEFAULT_GOAL = 2000;

/**
 * A repository for managing goal data persistence using localStorage.
 */
export class LocalStorageGoalRepository implements GoalRepository {
  /**
   * Retrieves the user's daily water intake goal from localStorage.
   * If no goal is set, it returns a default value.
   * @returns A promise that resolves to the daily goal in milliliters.
   */
  async getDailyGoal(): Promise<DailyGoal> {
    const savedGoal = getItem<DailyGoal>(WATER_TRACKER_GOAL_KEY);
    // Return the saved goal, or the default if it's null, undefined, or otherwise falsy (e.g. 0).
    return savedGoal || DEFAULT_GOAL;
  }

  /**
   * Saves the user's daily water intake goal to localStorage.
   * @param goal - The daily goal in milliliters to save.
   * @returns A promise that resolves when the operation is complete.
   */
  async saveDailyGoal(goal: DailyGoal): Promise<void> {
    setItem(WATER_TRACKER_GOAL_KEY, goal);
  }
}
