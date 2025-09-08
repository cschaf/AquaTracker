/**
 * @file Contains the use case for setting the user's daily goal.
 * @licence MIT
 */

import type { GoalRepository } from '../repositories/goal.repository';
import type { DailyGoal } from '../entities/goal.entity';
import { DomainError } from '../errors/domain.error';

/**
 * Implements the business logic for setting the user's daily water intake goal.
 */
export class SetDailyGoalUseCase {
  private readonly goalRepository: GoalRepository;

  /**
   * Creates an instance of the SetDailyGoalUseCase.
   * @param goalRepository - The repository for goal data.
   */
  constructor(goalRepository: GoalRepository) {
    this.goalRepository = goalRepository;
  }

  /**
   * Executes the use case to set the daily goal.
   * @param goal - The daily goal to set, in milliliters.
   * @returns A promise that resolves when the operation is complete.
   * @throws {DomainError} If the goal is not a positive number.
   */
  async execute(goal: DailyGoal): Promise<void> {
    if (goal <= 0) {
      throw new DomainError('Goal must be a positive number.');
    }
    await this.goalRepository.saveDailyGoal(goal);
  }
}
