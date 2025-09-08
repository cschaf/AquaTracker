/**
 * @file Contains the use case for retrieving the user's daily goal.
 * @licence MIT
 */

import type { GoalRepository } from '../repositories/goal.repository';
import type { DailyGoal } from '../entities/goal.entity';

/**
 * Implements the business logic for fetching the user's daily water intake goal.
 */
export class GetDailyGoalUseCase {
  private readonly goalRepository: GoalRepository;

  /**
   * Creates an instance of the GetDailyGoalUseCase.
   * @param goalRepository - The repository for goal data.
   */
  constructor(goalRepository: GoalRepository) {
    this.goalRepository = goalRepository;
  }

  /**
   * Executes the use case to get the daily goal.
   * @returns A promise that resolves to the user's daily goal in milliliters.
   */
  async execute(): Promise<DailyGoal> {
    return this.goalRepository.getDailyGoal();
  }
}
