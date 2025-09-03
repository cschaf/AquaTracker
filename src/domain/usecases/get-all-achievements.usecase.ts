/**
 * @file Contains the use case for retrieving all available achievements.
 * @licence MIT
 */

import type { Achievement } from '../entities/achievement.entity';
import allAchievementsData from '../data/achievements.json';

/**
 * Implements the business logic for fetching the complete list of all possible achievements.
 */
export class GetAllAchievementsUseCase {
  /**
   * Executes the use case to get all achievements.
   * In a real app, this might involve a repository, but for static data this is sufficient.
   * The data is read from a local JSON file within the domain layer.
   *
   * @returns A promise that resolves to an array of all Achievement objects.
   */
  execute(): Promise<Achievement[]> {
    // The type assertion is considered safe as we trust the static data file.
    return Promise.resolve(allAchievementsData as Achievement[]);
  }
}
