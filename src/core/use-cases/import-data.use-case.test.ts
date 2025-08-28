import { describe, it, expect, vi } from 'vitest';
import { ImportDataUseCase } from './import-data.use-case';
import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import type { GoalGateway } from '../gateways/goal.gateway';
import type { DailyGoal } from '../entities/goal';
import type { Log } from '../entities/water-intake';

const createMockWaterIntakeGateway = (): WaterIntakeGateway => ({
  getLogs: vi.fn(),
  saveLogs: vi.fn(),
});

const createMockGoalGateway = (): GoalGateway => ({
  getDailyGoal: vi.fn(),
  saveDailyGoal: vi.fn(),
});

// Mock FileReader
const mockFileReader = {
  readAsText: vi.fn(),
  onload: vi.fn(),
  onerror: vi.fn(),
};
vi.stubGlobal('FileReader', vi.fn(() => mockFileReader));

describe('ImportDataUseCase', () => {
  it('should successfully import valid data', async () => {
    // Arrange
    const waterIntakeGateway = createMockWaterIntakeGateway();
    const goalGateway = createMockGoalGateway();
    const useCase = new ImportDataUseCase(waterIntakeGateway, goalGateway);

    const goal: DailyGoal = 3000;
    const logs: Log[] = [{ date: '2023-01-01', entries: [] }];
    const fileContent = JSON.stringify({ goal, logs });
    const file = new File([fileContent], 'data.json', { type: 'application/json' });

    // Act
    const promise = useCase.execute(file);
    // Simulate successful file read
    mockFileReader.onload({ target: { result: fileContent } });
    const result = await promise;

    // Assert
    expect(result.success).toBe(true);
    expect(goalGateway.saveDailyGoal).toHaveBeenCalledWith(goal);
    expect(waterIntakeGateway.saveLogs).toHaveBeenCalledWith(logs);
  });

  it('should return an error for invalid JSON', async () => {
    // Arrange
    const waterIntakeGateway = createMockWaterIntakeGateway();
    const goalGateway = createMockGoalGateway();
    const useCase = new ImportDataUseCase(waterIntakeGateway, goalGateway);
    const file = new File(['invalid json'], 'data.json', { type: 'application/json' });

    // Act
    const promise = useCase.execute(file);
    mockFileReader.onload({ target: { result: 'invalid json' } });

    // Assert
    await expect(promise).resolves.toEqual({
      success: false,
      message: "Error reading or parsing the file. Please ensure it's a valid JSON file.",
    });
  });
});
