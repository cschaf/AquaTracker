import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdbAchievementRepository } from '../../../src/infrastructure/repositories/idb-achievement.repository';
import { get, set } from 'idb-keyval';

vi.mock('idb-keyval', () => ({
  get: vi.fn(),
  set: vi.fn(),
}));

const ACHIEVEMENTS_KEY = 'achievements';

describe('IdbAchievementRepository', () => {
  let repository: IdbAchievementRepository;

  beforeEach(() => {
    repository = new IdbAchievementRepository();
    vi.clearAllMocks();
  });

  describe('getUnlockedAchievementIds', () => {
    it('should return an empty array if no data is in IndexedDB', async () => {
      (get as vi.Mock).mockResolvedValue(undefined);
      const ids = await repository.getUnlockedAchievementIds();
      expect(get).toHaveBeenCalledWith(ACHIEVEMENTS_KEY);
      expect(ids).toEqual([]);
    });

    it('should return the stored array of IDs from IndexedDB', async () => {
      const storedIds = ['a1', 'a2'];
      (get as vi.Mock).mockResolvedValue(storedIds);

      const ids = await repository.getUnlockedAchievementIds();
      expect(get).toHaveBeenCalledWith(ACHIEVEMENTS_KEY);
      expect(ids).toEqual(storedIds);
    });
  });

  describe('saveUnlockedAchievementIds', () => {
    it('should save the provided IDs to IndexedDB', async () => {
      const idsToSave = ['a1', 'a2', 'a3'];
      (set as vi.Mock).mockResolvedValue(undefined);

      await repository.saveUnlockedAchievementIds(idsToSave);

      expect(set).toHaveBeenCalledWith(ACHIEVEMENTS_KEY, idsToSave);
    });
  });
});
