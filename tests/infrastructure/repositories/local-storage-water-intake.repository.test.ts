import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageWaterIntakeRepository } from '../../../src/infrastructure/repositories/local-storage-water-intake.repository';
import type { Log } from '../../../src/domain/entities';

const LOGS_KEY = 'waterTrackerData';

describe('LocalStorageWaterIntakeRepository', () => {
  let repository: LocalStorageWaterIntakeRepository;

  beforeEach(() => {
    repository = new LocalStorageWaterIntakeRepository();
    localStorage.clear();
  });

  describe('getLogs', () => {
    it('should return an empty array if no logs are in localStorage', async () => {
      const logs = await repository.getLogs();
      expect(logs).toEqual([]);
    });

    it('should return the stored logs array', async () => {
      const storedLogs: Log[] = [
        { date: '2023-01-01', entries: [{ id: '1', amount: 500, timestamp: 123 }] },
      ];
      localStorage.setItem(LOGS_KEY, JSON.stringify(storedLogs));

      const logs = await repository.getLogs();
      expect(logs).toEqual(storedLogs);
    });
  });

  describe('saveLogs', () => {
    it('should save the provided logs array to localStorage', async () => {
      const logsToSave: Log[] = [
        { date: '2023-01-02', entries: [{ id: '2', amount: 1000, timestamp: 456 }] },
      ];
      await repository.saveLogs(logsToSave);

      const storedRaw = localStorage.getItem(LOGS_KEY);
      const storedLogs = JSON.parse(storedRaw!);
      expect(storedLogs).toEqual(logsToSave);
    });
  });
});
