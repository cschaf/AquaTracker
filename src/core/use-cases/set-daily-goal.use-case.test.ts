import { describe, it, expect, vi } from 'vitest';
import { SetDailyGoalUseCase } from './set-daily-goal.use-case';
import type { GoalGateway } from '../gateways/goal.gateway';
import type { DailyGoal } from '../entities/goal';

const createMockGateway = (): GoalGateway => {
  return {
    getDailyGoal: vi.fn(),
    saveDailyGoal: vi.fn(),
  };
};

describe('SetDailyGoalUseCase', () => {
  it('should call the gateway to save the daily goal', async () => {
    // Arrange
    const mockGateway = createMockGateway();
    const useCase = new SetDailyGoalUseCase(mockGateway);
    const newGoal: DailyGoal = 3000;

    // Act
    await useCase.execute(newGoal);

    // Assert
    expect(mockGateway.saveDailyGoal).toHaveBeenCalledTimes(1);
    expect(mockGateway.saveDailyGoal).toHaveBeenCalledWith(newGoal);
  });
});
