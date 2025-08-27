import { describe, it, expect, vi } from 'vitest';
import { GetUnlockedAchievementsUseCase } from './get-unlocked-achievements.use-case';
import type { AchievementGateway } from '../gateways/achievement.gateway';

const createMockGateway = (unlockedIds: string[]): AchievementGateway => {
  return {
    getUnlockedAchievementIds: vi.fn().mockResolvedValue(unlockedIds),
    saveUnlockedAchievementIds: vi.fn(),
  };
};

describe('GetUnlockedAchievementsUseCase', () => {
  it('should return the unlocked achievement IDs from the gateway', async () => {
    // Arrange
    const unlockedIds = ['first-intake', 'consistency-king'];
    const mockGateway = createMockGateway(unlockedIds);
    const useCase = new GetUnlockedAchievementsUseCase(mockGateway);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockGateway.getUnlockedAchievementIds).toHaveBeenCalledTimes(1);
    expect(result).toEqual(unlockedIds);
  });
});
