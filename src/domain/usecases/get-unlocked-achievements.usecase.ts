/**
 * @file Contains the use case for retrieving the IDs of unlocked achievements.
 * @licence MIT
 */

import type { AchievementRepository } from '../repositories/achievement.repository';

/**
 * Implements the business logic for fetching the IDs of all achievements the user has unlocked.
 */
export class GetUnlockedAchievementsUseCase {
  private readonly achievementRepository: AchievementRepository;

  /**
   * Creates an instance of the GetUnlockedAchievementsUseCase.
   * @param achievementRepository - The repository for achievement data.
   */
  constructor(achievementRepository: AchievementRepository) {
    this.achievementRepository = achievementRepository;
  }

  /**
   * Executes the use case to get the unlocked achievement IDs.
   * @returns A promise that resolves to an array of unlocked achievement ID strings.
   */
  async execute(): Promise<string[]> {
    return this.achievementRepository.getUnlockedAchievementIds();
  }
}
