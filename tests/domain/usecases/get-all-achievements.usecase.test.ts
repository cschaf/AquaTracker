import { describe, it, expect } from 'vitest';
import { GetAllAchievementsUseCase } from '../../../src/domain/usecases/get-all-achievements.usecase';
import allAchievementsData from '../../../src/domain/data/achievements.json';

describe('GetAllAchievementsUseCase', () => {
  it('should return all achievements from the data source', async () => {
    // Arrange
    const useCase = new GetAllAchievementsUseCase();

    // Act
    const achievements = await useCase.execute();

    // Assert
    expect(achievements).toBeInstanceOf(Array);
    expect(achievements).toHaveLength(allAchievementsData.length);
    expect(achievements).toEqual(allAchievementsData);
  });
});
