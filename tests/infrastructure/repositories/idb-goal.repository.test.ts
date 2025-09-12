import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdbGoalRepository } from '../../../src/infrastructure/repositories/idb-goal.repository';
import { get, set } from 'idb-keyval';

vi.mock('idb-keyval', () => ({
  get: vi.fn(),
  set: vi.fn(),
}));

const GOAL_KEY = 'goalData';
const DEFAULT_GOAL = 2000;

describe('IdbGoalRepository', () => {
  let repository: IdbGoalRepository;

  beforeEach(() => {
    repository = new IdbGoalRepository();
    vi.clearAllMocks();
  });

  describe('getDailyGoal', () => {
    it('should return the default goal if no goal is in IndexedDB', async () => {
      (get as vi.Mock).mockResolvedValue(undefined);
      const goal = await repository.getDailyGoal();
      expect(get).toHaveBeenCalledWith(GOAL_KEY);
      expect(goal).toBe(DEFAULT_GOAL);
    });

    it('should return the stored goal from IndexedDB', async () => {
      const storedGoal = 3000;
      (get as vi.Mock).mockResolvedValue(storedGoal);

      const goal = await repository.getDailyGoal();
      expect(get).toHaveBeenCalledWith(GOAL_KEY);
      expect(goal).toBe(storedGoal);
    });
  });

  describe('saveDailyGoal', () => {
    it('should save the provided goal to IndexedDB', async () => {
      const goalToSave = 2500;
      (set as vi.Mock).mockResolvedValue(undefined);

      await repository.saveDailyGoal(goalToSave);

      expect(set).toHaveBeenCalledWith(GOAL_KEY, goalToSave);
    });
  });
});
