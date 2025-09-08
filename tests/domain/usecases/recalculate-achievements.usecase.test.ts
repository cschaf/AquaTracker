import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RecalculateAchievementsUseCase } from '../../../src/domain/usecases/recalculate-achievements.usecase';
import { mockWaterIntakeRepository } from '../__mocks__/repositories/mock-water-intake.repository';
import { mockGoalRepository } from '../__mocks__/repositories/mock-goal.repository';
import { mockAchievementRepository } from '../__mocks__/repositories/mock-achievement.repository';
import type { WaterIntakeRepository, GoalRepository, AchievementRepository } from '../../../src/domain/repositories';
import type { Achievement } from '../../../src/domain/entities';
import * as achievementChecker from '../../../src/domain/utils/achievement.checker';

// Mock the achievement checker utility
vi.mock('../../../src/domain/utils/achievement.checker');

describe('RecalculateAchievementsUseCase', () => {
  let useCase: RecalculateAchievementsUseCase;
  let mockWaterRepo: WaterIntakeRepository;
  let mockGoalRepo: GoalRepository;
  let mockAchievementRepo: AchievementRepository;

  const achievement1: Achievement = { id: 'a1', name: 'A1', description: 'D1', icon: 'I1', trigger: { type: 'log_count', days: 1 } };
  const achievement2: Achievement = { id: 'a2', name: 'A2', description: 'D2', icon: 'I2', trigger: { type: 'log_count', days: 2 } };

  beforeEach(() => {
    mockWaterRepo = mockWaterIntakeRepository();
    mockGoalRepo = mockGoalRepository();
    mockAchievementRepo = mockAchievementRepository();
    useCase = new RecalculateAchievementsUseCase(mockWaterRepo, mockGoalRepo, mockAchievementRepo);

    vi.resetAllMocks();
  });

  it('should return newly earned achievements and save all met achievements', async () => {
    // Arrange
    (mockAchievementRepo.getUnlockedAchievementIds as ReturnType<typeof vi.fn>).mockResolvedValue(['a1']);
    (vi.spyOn(achievementChecker, 'calculateMetAchievements') as any).mockReturnValue([achievement1, achievement2]);

    // Act
    const newlyEarned = await useCase.execute();

    // Assert
    expect(mockAchievementRepo.saveUnlockedAchievementIds).toHaveBeenCalledWith(['a1', 'a2']);
    expect(newlyEarned).toEqual([achievement2]);
    expect(newlyEarned).toHaveLength(1);
  });

  it('should return an empty array if no new achievements are earned', async () => {
    // Arrange
    (mockAchievementRepo.getUnlockedAchievementIds as ReturnType<typeof vi.fn>).mockResolvedValue(['a1', 'a2']);
    (vi.spyOn(achievementChecker, 'calculateMetAchievements') as any).mockReturnValue([achievement1, achievement2]);

    // Act
    const newlyEarned = await useCase.execute();

    // Assert
    expect(mockAchievementRepo.saveUnlockedAchievementIds).toHaveBeenCalledWith(['a1', 'a2']);
    expect(newlyEarned).toEqual([]);
    expect(newlyEarned).toHaveLength(0);
  });

  it('should handle the case where there are no previously unlocked achievements', async () => {
    // Arrange
    (mockAchievementRepo.getUnlockedAchievementIds as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (vi.spyOn(achievementChecker, 'calculateMetAchievements') as any).mockReturnValue([achievement1]);

    // Act
    const newlyEarned = await useCase.execute();

    // Assert
    expect(mockAchievementRepo.saveUnlockedAchievementIds).toHaveBeenCalledWith(['a1']);
    expect(newlyEarned).toEqual([achievement1]);
    expect(newlyEarned).toHaveLength(1);
  });

  it('should return an empty array if no achievements are met at all', async () => {
    // Arrange
    (mockAchievementRepo.getUnlockedAchievementIds as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (vi.spyOn(achievementChecker, 'calculateMetAchievements') as any).mockReturnValue([]);

    // Act
    const newlyEarned = await useCase.execute();

    // Assert
    expect(mockAchievementRepo.saveUnlockedAchievementIds).toHaveBeenCalledWith([]);
    expect(newlyEarned).toEqual([]);
    expect(newlyEarned).toHaveLength(0);
  });
});
