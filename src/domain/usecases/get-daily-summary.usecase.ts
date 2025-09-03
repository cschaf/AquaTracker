/**
 * @file Contains the use case for retrieving a summary of today's water intake.
 * @licence MIT
 */

import type { WaterIntakeRepository } from '../repositories/water-intake.repository';
import type { Log } from '../entities/water-intake.entity';

/**
 * Represents the summary of water intake for the current day.
 */
export interface DailySummary {
  /**
   * The total amount of water consumed today, in milliliters.
   */
  total: number;
  /**
   * The list of individual intake entries for today.
   */
  entries: Log['entries'];
}

/**
 * Implements the business logic for calculating and fetching the daily water intake summary.
 */
export class GetDailySummaryUseCase {
  private readonly waterIntakeRepository: WaterIntakeRepository;

  /**
   * Creates an instance of the GetDailySummaryUseCase.
   * @param waterIntakeRepository - The repository for water intake data.
   */
  constructor(waterIntakeRepository: WaterIntakeRepository) {
    this.waterIntakeRepository = waterIntakeRepository;
  }

  /**
   * Executes the use case to get the summary for the current day.
   * @returns A promise that resolves to a DailySummary object.
   */
  async execute(): Promise<DailySummary> {
    const logs = await this.waterIntakeRepository.getLogs();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = logs.find(log => log.date === todayStr);

    if (!todayLog) {
      return { total: 0, entries: [] };
    }

    const dailyTotal = todayLog.entries.reduce((sum, entry) => sum + entry.amount, 0);

    return { total: dailyTotal, entries: todayLog.entries };
  }
}
