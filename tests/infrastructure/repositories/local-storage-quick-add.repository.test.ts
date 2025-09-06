import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageQuickAddRepository } from '../../../src/infrastructure/repositories/local-storage-quick-add.repository';

const QUICK_ADD_KEY = 'quickAddValues';
const DEFAULT_VALUES = [250, 500, 1000];

describe('LocalStorageQuickAddRepository', () => {
  let repository: LocalStorageQuickAddRepository;

  beforeEach(() => {
    repository = new LocalStorageQuickAddRepository();
    localStorage.clear();
  });

  describe('getQuickAddValues', () => {
    it('should return the default values if nothing is in localStorage', async () => {
      const values = await repository.getQuickAddValues();
      expect(values).toEqual(DEFAULT_VALUES);
    });

    it('should return the stored values', async () => {
      const storedValues = [100, 200, 300];
      localStorage.setItem(QUICK_ADD_KEY, JSON.stringify(storedValues));

      const values = await repository.getQuickAddValues();
      expect(values).toEqual(storedValues);
    });

    it('should return default values if stored data is not an array', async () => {
      localStorage.setItem(QUICK_ADD_KEY, JSON.stringify({ a: 1 }));
      const values = await repository.getQuickAddValues();
      expect(values).toEqual(DEFAULT_VALUES);
    });

    it('should return default values if stored array is not of length 3', async () => {
      localStorage.setItem(QUICK_ADD_KEY, JSON.stringify([100, 200]));
      const values = await repository.getQuickAddValues();
      expect(values).toEqual(DEFAULT_VALUES);
    });
  });

  describe('saveQuickAddValues', () => {
    it('should save the provided values to localStorage', async () => {
      const valuesToSave: [number, number, number] = [150, 300, 450];
      await repository.saveQuickAddValues(valuesToSave);

      const storedRaw = localStorage.getItem(QUICK_ADD_KEY);
      const storedValues = JSON.parse(storedRaw!);
      expect(storedValues).toEqual(valuesToSave);
    });
  });
});
