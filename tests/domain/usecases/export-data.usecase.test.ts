import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExportDataUseCase } from '../../../src/domain/usecases/export-data.usecase';
import { mockWaterIntakeRepository } from '../__mocks__/repositories/mock-water-intake.repository';
import { mockGoalRepository } from '../__mocks__/repositories/mock-goal.repository';
import type { WaterIntakeRepository, GoalRepository } from '../../../src/domain/repositories';
import type { Log, DailyGoal } from '../../../src/domain/entities';
import { DomainError } from '../../../src/domain/errors';

describe('ExportDataUseCase', () => {
  let useCase: ExportDataUseCase;
  let mockWaterRepo: WaterIntakeRepository;
  let mockGoalRepo: GoalRepository;

  const testLogs: Log[] = [{ date: '2023-01-01', entries: [{ id: '1', amount: 500, timestamp: Date.now() }] }];
  const testGoal: DailyGoal = 2000;

  beforeEach(() => {
    mockWaterRepo = mockWaterIntakeRepository();
    mockGoalRepo = mockGoalRepository();
    useCase = new ExportDataUseCase(mockWaterRepo, mockGoalRepo);
  });

  it('should export data successfully when logs exist', async () => {
    // Arrange
    (mockWaterRepo.getLogs as ReturnType<typeof vi.fn>).mockResolvedValue(testLogs);
    (mockGoalRepo.getDailyGoal as ReturnType<typeof vi.fn>).mockResolvedValue(testGoal);

    // Act
    const result = await useCase.execute();

    // Assert
    const expectedData = {
      goal: testGoal,
      logs: testLogs,
    };
    expect(result).toBe(JSON.stringify(expectedData, null, 2));
  });

  it('should throw a DomainError if there is no data to export', async () => {
    // Arrange
    (mockWaterRepo.getLogs as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (mockGoalRepo.getDailyGoal as ReturnType<typeof vi.fn>).mockResolvedValue(testGoal);

    // Act & Assert
    await expect(useCase.execute()).rejects.toThrow(DomainError);
    await expect(useCase.execute()).rejects.toThrow('No data to export.');
  });
});
