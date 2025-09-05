import { vi } from 'vitest';
import { GoalRepository } from '../../../../src/domain/repositories';
export const mockGoalRepository = (): GoalRepository => ({
  getDailyGoal: vi.fn().mockResolvedValue(2000),
  saveDailyGoal: vi.fn().mockResolvedValue(undefined),
});
