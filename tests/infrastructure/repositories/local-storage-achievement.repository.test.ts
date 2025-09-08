import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageAchievementRepository } from '../../../src/infrastructure/repositories/local-storage-achievement.repository';

const UNLOCKED_ACHIEVEMENTS_KEY = 'unlockedAchievements';

describe('LocalStorageAchievementRepository', () => {
  let repository: LocalStorageAchievementRepository;

  beforeEach(() => {
    repository = new LocalStorageAchievementRepository();
    localStorage.clear();
  });

  describe('getUnlockedAchievementIds', () => {
    it('should return an empty array if no data is in localStorage', async () => {
      const ids = await repository.getUnlockedAchievementIds();
      expect(ids).toEqual([]);
    });

    it('should return the stored array of IDs', async () => {
      const storedIds = ['a1', 'a2'];
      localStorage.setItem(UNLOCKED_ACHIEVEMENTS_KEY, JSON.stringify(storedIds));

      const ids = await repository.getUnlockedAchievementIds();
      expect(ids).toEqual(storedIds);
    });
  });

  describe('saveUnlockedAchievementIds', () => {
    it('should save the provided IDs to localStorage', async () => {
      const idsToSave = ['a1', 'a2', 'a3'];
      await repository.saveUnlockedAchievementIds(idsToSave);

      const storedRaw = localStorage.getItem(UNLOCKED_ACHIEVEMENTS_KEY);
      expect(storedRaw).not.toBeNull();
      const storedIds = JSON.parse(storedRaw!);
      expect(storedIds).toEqual(idsToSave);
    });
  });
});
