/**
 * @file Contains the use case for exporting user data.
 * @licence MIT
 */

import type { WaterIntakeRepository } from '../repositories/water-intake.repository';
import type { GoalRepository } from '../repositories/goal.repository';
import { DomainError } from '../errors/domain.error';

/**
 * The structure of the data that will be exported.
 */
export interface ExportData {
  goal: number;
  logs: unknown[]; // Using unknown[] for logs for flexibility in the export format.
}

/**
 * Implements the business logic for exporting all user data into a JSON string.
 */
export class ExportDataUseCase {
  private readonly waterIntakeRepository: WaterIntakeRepository;
  private readonly goalRepository: GoalRepository;

  /**
   * Creates an instance of the ExportDataUseCase.
   * @param waterIntakeRepository - The repository for water intake data.
   * @param goalRepository - The repository for goal data.
   */
  constructor(
    waterIntakeRepository: WaterIntakeRepository,
    goalRepository: GoalRepository,
  ) {
    this.waterIntakeRepository = waterIntakeRepository;
    this.goalRepository = goalRepository;
  }

  /**
   * Executes the use case to gather all user data for export.
   * @returns A promise that resolves to a JSON string of the user's data.
   * @throws {DomainError} If there is no data to export.
   */
  async execute(): Promise<string> {
    const [logs, goal] = await Promise.all([
      this.waterIntakeRepository.getLogs(),
      this.goalRepository.getDailyGoal(),
    ]);

    if (!logs || logs.length === 0) {
      throw new DomainError('No data to export.');
    }

    const exportData: ExportData = {
      goal,
      logs,
    };

    return JSON.stringify(exportData, null, 2);
  }
}
