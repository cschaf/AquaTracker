import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SetDailyGoalUseCase } from '../../../src/domain/usecases/set-daily-goal.usecase';
import { mockGoalRepository } from '../__mocks__/repositories/mock-goal.repository';
import type { GoalRepository } from '../../../src/domain/repositories';
import { DomainError } from '../../../src/domain/errors';

describe('SetDailyGoalUseCase', () => {
  let useCase: SetDailyGoalUseCase;
  let mockRepository: GoalRepository;

  beforeEach(() => {
    mockRepository = mockGoalRepository();
    useCase = new SetDailyGoalUseCase(mockRepository);
  });

  it('should save a valid positive goal', async () => {
    // Arrange
    const newGoal = 2500;

    // Act
    await useCase.execute(newGoal);

    // Assert
    expect(mockRepository.saveDailyGoal).toHaveBeenCalledWith(newGoal);
  });

  it('should throw a DomainError for a zero goal', async () => {
    // Arrange
    const newGoal = 0;

    // Act & Assert
    await expect(useCase.execute(newGoal)).rejects.toThrow(DomainError);
    await expect(useCase.execute(newGoal)).rejects.toThrow('Goal must be a positive number.');
    expect(mockRepository.saveDailyGoal).not.toHaveBeenCalled();
  });

  it('should throw a DomainError for a negative goal', async () => {
    // Arrange
    const newGoal = -100;

    // Act & Assert
    await expect(useCase.execute(newGoal)).rejects.toThrow(DomainError);
    await expect(useCase.execute(newGoal)).rejects.toThrow('Goal must be a positive number.');
    expect(mockRepository.saveDailyGoal).not.toHaveBeenCalled();
  });
});
