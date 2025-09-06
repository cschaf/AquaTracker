import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetDailyGoalUseCase } from '../../../src/domain/usecases/get-daily-goal.usecase';
import { mockGoalRepository } from '../__mocks__/repositories/mock-goal.repository';
import type { GoalRepository } from '../../../src/domain/repositories';

describe('GetDailyGoalUseCase', () => {
  let useCase: GetDailyGoalUseCase;
  let mockRepository: GoalRepository;

  beforeEach(() => {
    mockRepository = mockGoalRepository();
    useCase = new GetDailyGoalUseCase(mockRepository);
  });

  it('should return the daily goal from the repository', async () => {
    // Arrange
    const expectedGoal = 2500;
    (mockRepository.getDailyGoal as ReturnType<typeof vi.fn>).mockResolvedValue(expectedGoal);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockRepository.getDailyGoal).toHaveBeenCalledTimes(1);
    expect(result).toBe(expectedGoal);
  });
});
