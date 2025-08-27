import { describe, it, expect, vi } from 'vitest';
import { GetDailyGoalUseCase } from './get-daily-goal.use-case';
import type { GoalGateway } from '../gateways/goal.gateway';
import type { DailyGoal } from '../entities/goal';

const createMockGateway = (dailyGoal: DailyGoal): GoalGateway => {
  return {
    getDailyGoal: vi.fn().mockResolvedValue(dailyGoal),
    saveDailyGoal: vi.fn(),
  };
};

describe('GetDailyGoalUseCase', () => {
  it('should call the gateway to get the daily goal', async () => {
    // Arrange
    const dailyGoal = { amount: 2500 };
    const mockGateway = createMockGateway(dailyGoal);
    const useCase = new GetDailyGoalUseCase(mockGateway);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockGateway.getDailyGoal).toHaveBeenCalledTimes(1);
    expect(result).toEqual(dailyGoal);
  });
});
