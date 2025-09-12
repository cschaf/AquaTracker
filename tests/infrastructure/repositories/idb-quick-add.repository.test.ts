import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdbQuickAddRepository } from '../../../src/infrastructure/repositories/idb-quick-add.repository';
import { get, set } from 'idb-keyval';
import type { QuickAddValues } from '../../../src/domain/entities';

vi.mock('idb-keyval', () => ({
  get: vi.fn(),
  set: vi.fn(),
}));

const QUICK_ADD_KEY = 'quickAddValues';
const DEFAULT_VALUES: QuickAddValues = [250, 500, 1000];

describe('IdbQuickAddRepository', () => {
  let repository: IdbQuickAddRepository;

  beforeEach(() => {
    repository = new IdbQuickAddRepository();
    vi.clearAllMocks();
  });

  describe('getQuickAddValues', () => {
    it('should return the default values if nothing is in IndexedDB', async () => {
      (get as vi.Mock).mockResolvedValue(undefined);
      const values = await repository.getQuickAddValues();
      expect(get).toHaveBeenCalledWith(QUICK_ADD_KEY);
      expect(values).toEqual(DEFAULT_VALUES);
    });

    it('should return the stored values from IndexedDB', async () => {
      const storedValues: QuickAddValues = [100, 200, 300];
      (get as vi.Mock).mockResolvedValue(storedValues);

      const values = await repository.getQuickAddValues();
      expect(get).toHaveBeenCalledWith(QUICK_ADD_KEY);
      expect(values).toEqual(storedValues);
    });

    it('should return default values if stored data is not an array', async () => {
      (get as vi.Mock).mockResolvedValue({ a: 1 });
      const values = await repository.getQuickAddValues();
      expect(get).toHaveBeenCalledWith(QUICK_ADD_KEY);
      expect(values).toEqual(DEFAULT_VALUES);
    });

    it('should return default values if stored array is not of length 3', async () => {
      (get as vi.Mock).mockResolvedValue([100, 200]);
      const values = await repository.getQuickAddValues();
      expect(get).toHaveBeenCalledWith(QUICK_ADD_KEY);
      expect(values).toEqual(DEFAULT_VALUES);
    });
  });

  describe('saveQuickAddValues', () => {
    it('should save the provided values to IndexedDB', async () => {
      const valuesToSave: QuickAddValues = [150, 300, 450];
      (set as vi.Mock).mockResolvedValue(undefined);

      await repository.saveQuickAddValues(valuesToSave);

      expect(set).toHaveBeenCalledWith(QUICK_ADD_KEY, valuesToSave);
    });
  });
});
