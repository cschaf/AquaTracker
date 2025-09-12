import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdbWaterIntakeRepository } from '../../../src/infrastructure/repositories/idb-water-intake.repository';
import type { Log } from '../../../src/domain/entities';
import { get, set } from 'idb-keyval';

vi.mock('idb-keyval', () => ({
  get: vi.fn(),
  set: vi.fn(),
}));

const LOGS_KEY = 'waterTrackerData';

describe('IdbWaterIntakeRepository', () => {
  let repository: IdbWaterIntakeRepository;

  beforeEach(() => {
    repository = new IdbWaterIntakeRepository();
    vi.clearAllMocks();
  });

  describe('getLogs', () => {
    it('should return an empty array if no logs are in IndexedDB', async () => {
      (get as vi.Mock).mockResolvedValue(undefined);
      const logs = await repository.getLogs();
      expect(get).toHaveBeenCalledWith(LOGS_KEY);
      expect(logs).toEqual([]);
    });

    it('should return the stored logs array from IndexedDB', async () => {
      const storedLogs: Log[] = [
        { date: '2023-01-01', entries: [{ id: '1', amount: 500, timestamp: 123 }] },
      ];
      (get as vi.Mock).mockResolvedValue(storedLogs);

      const logs = await repository.getLogs();
      expect(get).toHaveBeenCalledWith(LOGS_KEY);
      expect(logs).toEqual(storedLogs);
    });
  });

  describe('saveLogs', () => {
    it('should save the provided logs array to IndexedDB', async () => {
      const logsToSave: Log[] = [
        { date: '2023-01-02', entries: [{ id: '2', amount: 1000, timestamp: 456 }] },
      ];
      (set as vi.Mock).mockResolvedValue(undefined);

      await repository.saveLogs(logsToSave);

      expect(set).toHaveBeenCalledWith(LOGS_KEY, logsToSave);
    });
  });
});
