/**
 * @file Contains the localStorage implementation of the WaterIntakeRepository.
 * @licence MIT
 */

import { WaterIntakeRepository, Log } from '../../domain';
import { getItem, setItem } from '../storage/local.storage';

const WATER_TRACKER_DATA_KEY = 'waterTrackerData';

/**
 * A repository for managing water intake log data persistence using localStorage.
 */
export class LocalStorageWaterIntakeRepository implements WaterIntakeRepository {
  /**
   * Retrieves all water intake logs from localStorage.
   * @returns A promise that resolves to an array of Log objects. Returns an empty array if none are found.
   */
  async getLogs(): Promise<Log[]> {
    const logs = getItem<Log[]>(WATER_TRACKER_DATA_KEY);
    return logs || [];
  }

  /**
   * Saves the entire collection of water intake logs to localStorage.
   * @param logs - The array of Log objects to save.
   * @returns A promise that resolves when the operation is complete.
   */
  async saveLogs(logs: Log[]): Promise<void> {
    setItem(WATER_TRACKER_DATA_KEY, logs);
  }
}
