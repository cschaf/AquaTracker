import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetLogsUseCase } from '../../../src/domain/usecases/get-logs.usecase';
import { mockWaterIntakeRepository } from '../__mocks__/repositories/mock-water-intake.repository';
import type { WaterIntakeRepository } from '../../../src/domain/repositories';
import type { Log } from '../../../src/domain/entities';

describe('GetLogsUseCase', () => {
  let useCase: GetLogsUseCase;
  let mockRepository: WaterIntakeRepository;

  beforeEach(() => {
    mockRepository = mockWaterIntakeRepository();
    useCase = new GetLogsUseCase(mockRepository);
  });

  it('should return the logs from the repository', async () => {
    // Arrange
    const expectedLogs: Log[] = [
      { date: '2023-01-01', entries: [{ id: '1', amount: 500, timestamp: Date.now() }] },
    ];
    (mockRepository.getLogs as ReturnType<typeof vi.fn>).mockResolvedValue(expectedLogs);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockRepository.getLogs).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedLogs);
  });
});
