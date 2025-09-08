/**
 * @file Contains the use case for importing user data from a string.
 * @licence MIT
 */

import type { WaterIntakeRepository } from '../repositories/water-intake.repository';
import type { GoalRepository } from '../repositories/goal.repository';
import type { Log } from '../entities/water-intake.entity';
import type { DailyGoal } from '../entities/goal.entity';
import { DomainError } from '../errors/domain.error';

/**
 * Defines the expected structure of the imported data.
 */
interface ImportedData {
  goal: DailyGoal;
  logs: Log[];
}

/**
 * Implements the business logic for importing user data from a JSON string.
 */
export class ImportDataUseCase {
  private readonly waterIntakeRepository: WaterIntakeRepository;
  private readonly goalRepository: GoalRepository;

  /**
   * Creates an instance of the ImportDataUseCase.
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
   * Executes the use case to parse, validate, and save imported data.
   * @param fileContent - A string containing the JSON data to import.
   * @returns A promise that resolves when the operation is complete.
   * @throws {DomainError} If the data format is invalid or parsing fails.
   */
  async execute(fileContent: string): Promise<void> {
    try {
      const importedData = JSON.parse(fileContent) as ImportedData;

      // Basic validation to ensure the imported data has the expected structure.
      if (
        importedData &&
        typeof importedData.goal === 'number' &&
        Array.isArray(importedData.logs)
      ) {
        // This is a destructive action, so we perform it as a transaction-like operation.
        await this.goalRepository.saveDailyGoal(importedData.goal);
        await this.waterIntakeRepository.saveLogs(importedData.logs);
      } else {
        throw new DomainError('Invalid data format.');
      }
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      // Re-throw parsing or other unexpected errors as a DomainError.
      throw new DomainError('Error parsing file content. Please ensure it is valid JSON.');
    }
  }
}
