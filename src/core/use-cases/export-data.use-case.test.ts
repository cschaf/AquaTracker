/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ExportDataUseCase } from './export-data.use-case';
import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import type { GoalGateway } from '../gateways/goal.gateway';
import type { Log } from '../entities/water-intake';
import type { DailyGoal } from '../entities/goal';

const createMockWaterIntakeGateway = (initialLogs: Log[] = []): WaterIntakeGateway => ({
  getLogs: vi.fn().mockResolvedValue(initialLogs),
  saveLogs: vi.fn(),
});

const createMockGoalGateway = (dailyGoal: DailyGoal | null): GoalGateway => ({
  getDailyGoal: vi.fn().mockResolvedValue(dailyGoal),
  saveDailyGoal: vi.fn(),
});

describe('ExportDataUseCase', () => {
  const mockLink = {
    href: '',
    download: '',
    click: vi.fn(),
  };

  beforeEach(() => {
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create and click a download link with the correct data', async () => {
    // Arrange
    const logs: Log[] = [{ date: '2023-01-01', entries: [] }];
    const goal: DailyGoal = { amount: 2000 };
    const waterIntakeGateway = createMockWaterIntakeGateway(logs);
    const goalGateway = createMockGoalGateway(goal);
    const useCase = new ExportDataUseCase(waterIntakeGateway, goalGateway);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result.success).toBe(true);
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.download).toBe('aquatracker_data.json');
    expect(mockLink.href).toContain('data:text/json;charset=utf-8,');
    expect(mockLink.click).toHaveBeenCalledTimes(1);
  });

  it('should return success false if there is no data to export', async () => {
    // Arrange
    const waterIntakeGateway = createMockWaterIntakeGateway([]);
    const goalGateway = createMockGoalGateway(null);
    const useCase = new ExportDataUseCase(waterIntakeGateway, goalGateway);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe('No data to export.');
  });
});
