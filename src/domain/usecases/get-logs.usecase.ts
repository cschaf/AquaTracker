/**
 * @file Contains the use case for retrieving all water intake logs.
 * @licence MIT
 */

import type { WaterIntakeRepository } from '../repositories/water-intake.repository';
import type { Log } from '../entities/water-intake.entity';

/**
 * Implements the business logic for fetching the complete history of water intake logs.
 */
export class GetLogsUseCase {
  private readonly waterIntakeRepository: WaterIntakeRepository;

  /**
   * Creates an instance of the GetLogsUseCase.
   * @param waterIntakeRepository - The repository for water intake data.
   */
  constructor(waterIntakeRepository: WaterIntakeRepository) {
    this.waterIntakeRepository = waterIntakeRepository;
  }

  /**
   * Executes the use case to get all logs.
   * @returns A promise that resolves to an array of all Log objects.
   */
  async execute(): Promise<Log[]> {
    return this.waterIntakeRepository.getLogs();
  }
}
