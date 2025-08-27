import { describe, it, expect } from 'vitest';
import { GetAllAchievementsUseCase } from './get-all-achievements.use-case';
import allAchievementsData from '../data/achievements.json';

describe('GetAllAchievementsUseCase', () => {
  it('should return all achievements from the data source', async () => {
    // Arrange
    const useCase = new GetAllAchievementsUseCase();

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual(allAchievementsData);
  });
});
