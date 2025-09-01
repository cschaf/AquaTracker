import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RecalculateAchievementsUseCase } from './recalculate-achievements.use-case';
import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import type { GoalGateway } from '../gateways/goal.gateway';
import type { AchievementGateway } from '../gateways/achievement.gateway';
import type { Log } from '../entities/water-intake';
import type { DailyGoal } from '../entities/goal';
import allAchievementsData from '../data/achievements.json';

const createMockWaterIntakeGateway = (initialLogs: Log[] = []): WaterIntakeGateway => ({
  getLogs: vi.fn().mockResolvedValue(initialLogs),
  saveLogs: vi.fn(),
});

const createMockGoalGateway = (dailyGoal: DailyGoal | null): GoalGateway => ({
  getDailyGoal: vi.fn().mockResolvedValue(dailyGoal),
  saveDailyGoal: vi.fn(),
});

const createMockAchievementGateway = (unlockedIds: string[] = []): AchievementGateway => ({
  getUnlockedAchievementIds: vi.fn().mockResolvedValue(unlockedIds),
  saveUnlockedAchievementIds: vi.fn(),
});

describe('RecalculateAchievementsUseCase', () => {
  const MOCK_DATE = '2024-01-02T12:00:00.000Z'; // A neutral timestamp (mid-day on a non-holiday)

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(MOCK_DATE));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return newly earned achievements', async () => {
    // Arrange
    const today = new Date().toISOString().split('T')[0];
    const logs: Log[] = [{ date: today, entries: [{ id: '1', amount: 100, timestamp: Date.now() }] }];
    const dailyGoal: DailyGoal = 2000;
    const oldUnlockedIds: string[] = [];

    const waterIntakeGateway = createMockWaterIntakeGateway(logs);
    const goalGateway = createMockGoalGateway(dailyGoal);
    const achievementGateway = createMockAchievementGateway(oldUnlockedIds);

    const useCase = new RecalculateAchievementsUseCase(
      waterIntakeGateway,
      goalGateway,
      achievementGateway
    );

    // Act
    const newlyEarned = await useCase.execute();

    // Assert
    const firstSipAchievement = allAchievementsData.find(a => a.id === 'first-day-logged');
    expect(newlyEarned).toEqual([firstSipAchievement]);
    expect(achievementGateway.saveUnlockedAchievementIds).toHaveBeenCalledWith(['first-day-logged']);
  });

  it('should return an empty array if no new achievements are earned', async () => {
    // Arrange
    const today = new Date().toISOString().split('T')[0];
    const logs: Log[] = [{ date: today, entries: [{ id: '1', amount: 100, timestamp: Date.now() }] }];
    const dailyGoal: DailyGoal = 2000;
    const oldUnlockedIds: string[] = ['first-day-logged'];

    const waterIntakeGateway = createMockWaterIntakeGateway(logs);
    const goalGateway = createMockGoalGateway(dailyGoal);
    const achievementGateway = createMockAchievementGateway(oldUnlockedIds);

    const useCase = new RecalculateAchievementsUseCase(
      waterIntakeGateway,
      goalGateway,
      achievementGateway
    );

    // Act
    const newlyEarned = await useCase.execute();

    // Assert
    expect(newlyEarned).toEqual([]);
    expect(achievementGateway.saveUnlockedAchievementIds).toHaveBeenCalledWith(['first-day-logged']);
  });
});
