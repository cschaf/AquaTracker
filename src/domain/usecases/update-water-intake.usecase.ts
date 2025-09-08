/**
 * @file Contains the use case for updating a water intake entry.
 * @licence MIT
 */

import type { WaterIntakeRepository } from '../repositories/water-intake.repository';
import { DomainError } from '../errors/domain.error';

/**
 * Implements the business logic for updating an existing water intake entry.
 */
export class UpdateWaterIntakeUseCase {
  private readonly waterIntakeRepository: WaterIntakeRepository;

  /**
   * Creates an instance of the UpdateWaterIntakeUseCase.
   * @param waterIntakeRepository - The repository for water intake data.
   */
  constructor(waterIntakeRepository: WaterIntakeRepository) {
    this.waterIntakeRepository = waterIntakeRepository;
  }

  /**
   * Executes the use case to update a water intake entry's amount.
   * @param entryId - The ID of the entry to update.
   * @param newAmount - The new amount for the entry, in milliliters.
   * @returns A promise that resolves when the operation is complete.
   * @throws {DomainError} If the new amount is invalid.
   */
  async execute(entryId: string, newAmount: number): Promise<void> {
    if (newAmount <= 0) {
      throw new DomainError('Intake amount must be a positive number.');
    }

    const logs = await this.waterIntakeRepository.getLogs();

    // This logic seems to only allow updating entries from the current day.
    // Preserving original logic as per instructions.
    const todayStr = new Date().toISOString().split('T')[0];

    const updatedLogs = logs.map(log => {
      if (log.date === todayStr) {
        return {
          ...log,
          entries: log.entries.map(entry =>
            entry.id === entryId ? { ...entry, amount: newAmount } : entry,
          ),
        };
      }
      return log;
    });

    await this.waterIntakeRepository.saveLogs(updatedLogs);
  }
}
