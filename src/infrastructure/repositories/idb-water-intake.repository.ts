/**
 * @file Contains the IndexedDB implementation of the WaterIntakeRepository.
 * @licence MIT
 */

import type { WaterIntakeRepository } from '../../domain/repositories';
import type { Log } from '../../domain/entities';
import { get, set } from 'idb-keyval';

const WATER_TRACKER_DATA_KEY = 'waterTrackerData';

/**
 * A repository for managing water intake log data persistence using IndexedDB.
 */
export class IdbWaterIntakeRepository implements WaterIntakeRepository {
  /**
   * Retrieves all water intake logs from IndexedDB.
   * @returns A promise that resolves to an array of Log objects. Returns an empty array if none are found.
   */
  async getLogs(): Promise<Log[]> {
    const logs = await get<Log[]>(WATER_TRACKER_DATA_KEY);
    return logs || [];
  }

  /**
   * Saves the entire collection of water intake logs to IndexedDB.
   * @param logs - The array of Log objects to save.
   * @returns A promise that resolves when the operation is complete.
   */
  async saveLogs(logs: Log[]): Promise<void> {
    await set(WATER_TRACKER_DATA_KEY, logs);
  }
}
