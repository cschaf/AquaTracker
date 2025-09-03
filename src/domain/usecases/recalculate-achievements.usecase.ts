/**
 * @file Contains the use case for recalculating user achievements.
 * @licence MIT
 */

import type { WaterIntakeRepository } from '../repositories/water-intake.repository';
import type { GoalRepository } from '../repositories/goal.repository';
import type { AchievementRepository } from '../repositories/achievement.repository';
import type { Achievement } from '../entities/achievement.entity';
import allAchievementsData from '../data/achievements.json';
import { calculateMetAchievements } from '../utils/achievement.checker';

/**
 * Implements the business logic for checking for and saving all earned achievements.
 * It returns only the achievements that have been newly earned in this cycle.
 */
export class RecalculateAchievementsUseCase {
  private readonly waterIntakeRepository: WaterIntakeRepository;
  private readonly goalRepository: GoalRepository;
  private readonly achievementRepository: AchievementRepository;

  /**
   * Creates an instance of the RecalculateAchievementsUseCase.
   * @param waterIntakeRepository - The repository for water intake data.
   * @param goalRepository - The repository for goal data.
   * @param achievementRepository - The repository for achievement data.
   */
  constructor(
    waterIntakeRepository: WaterIntakeRepository,
    goalRepository: GoalRepository,
    achievementRepository: AchievementRepository,
  ) {
    this.waterIntakeRepository = waterIntakeRepository;
    this.goalRepository = goalRepository;
    this.achievementRepository = achievementRepository;
  }

  /**
   * Executes the use case to recalculate achievements.
   * 1. Fetches all required data (logs, goal, previously unlocked achievements).
   * 2. Calculates all achievements that are currently met.
   * 3. Saves the full list of met achievement IDs.
   * 4. Compares the new list with the old list to determine which are newly earned.
   * @returns A promise that resolves to an array of newly earned Achievement objects.
   */
  async execute(): Promise<Achievement[]> {
    const [logs, dailyGoal, oldUnlockedIds] = await Promise.all([
      this.waterIntakeRepository.getLogs(),
      this.goalRepository.getDailyGoal(),
      this.achievementRepository.getUnlockedAchievementIds(),
    ]);

    const allAchievements = allAchievementsData as Achievement[];

    const allMetAchievements = calculateMetAchievements(logs, dailyGoal, allAchievements);
    const allMetAchievementIds = allMetAchievements.map(a => a.id);

    // Save the new complete list, overwriting the old one
    await this.achievementRepository.saveUnlockedAchievementIds(allMetAchievementIds);

    // Now, determine which achievements are newly earned to show the modal
    const oldUnlockedIdSet = new Set(oldUnlockedIds);
    const newlyEarnedAchievements = allMetAchievements.filter(
      (achievement) => !oldUnlockedIdSet.has(achievement.id),
    );

    return newlyEarnedAchievements;
  }
}
