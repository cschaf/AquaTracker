/**
 * @file Contains the use case for deleting a water intake entry.
 * @licence MIT
 */

import type { Log } from '../entities/water-intake.entity';
import type { WaterIntakeRepository } from '../repositories/water-intake.repository';

/**
 * Implements the business logic for deleting a specific water intake entry.
 */
export class DeleteWaterIntakeUseCase {
  /**
   * The repository for accessing water intake data.
   * @private
   */
  private readonly waterIntakeRepository: WaterIntakeRepository;

  /**
   * Creates an instance of the DeleteWaterIntakeUseCase.
   * @param waterIntakeRepository - The repository for water intake data.
   */
  constructor(waterIntakeRepository: WaterIntakeRepository) {
    this.waterIntakeRepository = waterIntakeRepository;
  }

  /**
   * Executes the use case to delete a water intake entry by its ID.
   * @param entryId - The unique ID of the entry to delete.
   * @returns A promise that resolves when the operation is complete.
   */
  async execute(entryId: string): Promise<void> {
    const logs = await this.waterIntakeRepository.getLogs();

    // This logic seems to only allow deleting entries from the current day.
    // Preserving original logic as per instructions.
    const todayStr = new Date().toISOString().split('T')[0];

    const updatedLogs = logs
      .map(log => {
        // Find the log for today and filter out the entry to be deleted.
        if (log.date === todayStr) {
          const updatedEntries = log.entries.filter(entry => entry.id !== entryId);

          // If the log for today has no more entries after deletion, remove the entire log object.
          if (updatedEntries.length === 0) {
            return null;
          }
          return { ...log, entries: updatedEntries };
        }
        return log;
      })
      .filter((log): log is Log => log !== null); // Use a type guard to remove nulls from the array.

    await this.waterIntakeRepository.saveLogs(updatedLogs);
  }
}
