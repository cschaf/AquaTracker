import type { WaterIntakeGateway } from '../../core/gateways/water-intake.gateway';
import type { Log } from '../../core/entities/water-intake';

const WATER_TRACKER_DATA_KEY = 'waterTrackerData';

export class LocalStorageWaterIntakeGateway implements WaterIntakeGateway {
  async getLogs(): Promise<Log[]> {
    try {
      const savedLogs = localStorage.getItem(WATER_TRACKER_DATA_KEY);
      return savedLogs ? JSON.parse(savedLogs) : [];
    } catch (error) {
      console.error('Failed to parse water tracker data from localStorage', error);
      return [];
    }
  }

  async saveLogs(logs: Log[]): Promise<void> {
    localStorage.setItem(WATER_TRACKER_DATA_KEY, JSON.stringify(logs));
  }
}
