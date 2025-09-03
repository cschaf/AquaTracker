/**
 * @file Defines the repository interface for managing Water Intake data.
 * @licence MIT
 */

import type { Log } from '../entities/water-intake.entity';

/**
 * Represents the interface for a repository that handles the persistence of water intake logs.
 */
export interface WaterIntakeRepository {
  /**
   * Retrieves all water intake logs.
   * @returns A promise that resolves to an array of Log objects.
   */
  getLogs(): Promise<Log[]>;

  /**
   * Saves the entire collection of water intake logs.
   * @param logs - The array of Log objects to save.
   * @returns A promise that resolves when the operation is complete.
   */
  saveLogs(logs: Log[]): Promise<void>;
}
