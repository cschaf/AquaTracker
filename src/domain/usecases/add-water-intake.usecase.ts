/**
 * @file Contains the use case for adding a new water intake entry.
 * @licence MIT
 */

import type { Entry, Log } from '../entities/water-intake.entity';
import type { WaterIntakeRepository } from '../repositories/water-intake.repository';
import { generateRandomId } from '../utils/id.generator';

/**
 * Implements the business logic for adding a new water intake entry.
 */
export class AddWaterIntakeUseCase {
  /**
   * The repository for accessing water intake data.
   * @private
   */
  private readonly waterIntakeRepository: WaterIntakeRepository;

  /**
   * Creates an instance of the AddWaterIntakeUseCase.
   * @param waterIntakeRepository - The repository for water intake data.
   */
  constructor(waterIntakeRepository: WaterIntakeRepository) {
    this.waterIntakeRepository = waterIntakeRepository;
  }

  /**
   * Executes the use case to add a new water intake entry.
   * @param amount - The amount of water to add, in milliliters.
   * @returns A promise that resolves when the operation is complete.
   */
  async execute(amount: number): Promise<void> {
    const logs = await this.waterIntakeRepository.getLogs();
    const todayStr = new Date().toISOString().split('T')[0];
    const now = Date.now();

    const newEntry: Entry = {
      id: `${now}-${generateRandomId()}`,
      amount,
      timestamp: now,
    };

    const todayLogIndex = logs.findIndex(log => log.date === todayStr);

    let updatedLogs: Log[];

    if (todayLogIndex > -1) {
      // Add to existing log for today
      updatedLogs = logs.map((log, index) => {
        if (index === todayLogIndex) {
          return { ...log, entries: [...log.entries, newEntry] };
        }
        return log;
      });
    } else {
      // Create a new log for today
      const newLog: Log = { date: todayStr, entries: [newEntry] };
      updatedLogs = [...logs, newLog];
    }

    await this.waterIntakeRepository.saveLogs(updatedLogs);
  }
}
