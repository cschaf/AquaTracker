import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageGoalRepository } from '../../../src/infrastructure/repositories/local-storage-goal.repository';

const GOAL_KEY = 'waterTrackerGoal';
const DEFAULT_GOAL = 2000;

describe('LocalStorageGoalRepository', () => {
  let repository: LocalStorageGoalRepository;

  beforeEach(() => {
    repository = new LocalStorageGoalRepository();
    localStorage.clear();
  });

  describe('getDailyGoal', () => {
    it('should return the default goal if no goal is in localStorage', async () => {
      const goal = await repository.getDailyGoal();
      expect(goal).toBe(DEFAULT_GOAL);
    });

    it('should return the stored goal', async () => {
      const storedGoal = 3000;
      localStorage.setItem(GOAL_KEY, JSON.stringify(storedGoal));

      const goal = await repository.getDailyGoal();
      expect(goal).toBe(storedGoal);
    });
  });

  describe('saveDailyGoal', () => {
    it('should save the provided goal to localStorage', async () => {
      const goalToSave = 2500;
      await repository.saveDailyGoal(goalToSave);

      const storedRaw = localStorage.getItem(GOAL_KEY);
      expect(storedRaw).not.toBeNull();
      const storedGoal = JSON.parse(storedRaw!);
      expect(storedGoal).toBe(goalToSave);
    });
  });
});
