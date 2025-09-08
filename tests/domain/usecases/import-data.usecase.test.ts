import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ImportDataUseCase } from '../../../src/domain/usecases/import-data.usecase';
import { mockWaterIntakeRepository } from '../__mocks__/repositories/mock-water-intake.repository';
import { mockGoalRepository } from '../__mocks__/repositories/mock-goal.repository';
import type { WaterIntakeRepository, GoalRepository } from '../../../src/domain/repositories';
import { DomainError } from '../../../src/domain/errors';

describe('ImportDataUseCase', () => {
  let useCase: ImportDataUseCase;
  let mockWaterRepo: WaterIntakeRepository;
  let mockGoalRepo: GoalRepository;

  beforeEach(() => {
    mockWaterRepo = mockWaterIntakeRepository();
    mockGoalRepo = mockGoalRepository();
    useCase = new ImportDataUseCase(mockWaterRepo, mockGoalRepo);
  });

  it('should import valid data successfully', async () => {
    // Arrange
    const validData = {
      goal: 2500,
      logs: [{ date: '2023-01-01', entries: [{ id: '1', amount: 500, timestamp: 123 }] }],
    };
    const fileContent = JSON.stringify(validData);

    // Act
    await useCase.execute(fileContent);

    // Assert
    expect(mockGoalRepo.saveDailyGoal).toHaveBeenCalledWith(validData.goal);
    expect(mockWaterRepo.saveLogs).toHaveBeenCalledWith(validData.logs);
  });

  it('should throw a DomainError for invalid JSON', async () => {
    // Arrange
    const invalidJson = '{"goal": 2500, "logs": [}';

    // Act & Assert
    await expect(useCase.execute(invalidJson)).rejects.toThrow(DomainError);
    await expect(useCase.execute(invalidJson)).rejects.toThrow('Error parsing file content. Please ensure it is valid JSON.');
  });

  it('should throw a DomainError for data with a missing goal', async () => {
    // Arrange
    const invalidData = {
      logs: [{ date: '2023-01-01', entries: [] }],
    };
    const fileContent = JSON.stringify(invalidData);

    // Act & Assert
    await expect(useCase.execute(fileContent)).rejects.toThrow(DomainError);
    await expect(useCase.execute(fileContent)).rejects.toThrow('Invalid data format.');
  });

  it('should throw a DomainError for data with missing logs', async () => {
    // Arrange
    const invalidData = {
      goal: 3000,
    };
    const fileContent = JSON.stringify(invalidData);

    // Act & Assert
    await expect(useCase.execute(fileContent)).rejects.toThrow(DomainError);
     await expect(useCase.execute(fileContent)).rejects.toThrow('Invalid data format.');
  });
});
