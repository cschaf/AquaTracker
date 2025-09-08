import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetUnlockedAchievementsUseCase } from '../../../src/domain/usecases/get-unlocked-achievements.usecase';
import { mockAchievementRepository } from '../__mocks__/repositories/mock-achievement.repository';
import type { AchievementRepository } from '../../../src/domain/repositories';

describe('GetUnlockedAchievementsUseCase', () => {
  let useCase: GetUnlockedAchievementsUseCase;
  let mockRepository: AchievementRepository;

  beforeEach(() => {
    mockRepository = mockAchievementRepository();
    useCase = new GetUnlockedAchievementsUseCase(mockRepository);
  });

  it('should return the unlocked achievement IDs from the repository', async () => {
    // Arrange
    const expectedIds = ['first-log', 'hydrator'];
    (mockRepository.getUnlockedAchievementIds as ReturnType<typeof vi.fn>).mockResolvedValue(expectedIds);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockRepository.getUnlockedAchievementIds).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedIds);
  });
});
