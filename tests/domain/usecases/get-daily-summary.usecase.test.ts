import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetDailySummaryUseCase } from '../../../src/domain/usecases/get-daily-summary.usecase';
import { mockWaterIntakeRepository } from '../__mocks__/repositories/mock-water-intake.repository';
import type { WaterIntakeRepository } from '../../../src/domain/repositories';
import type { Log } from '../../../src/domain/entities';

describe('GetDailySummaryUseCase', () => {
  let useCase: GetDailySummaryUseCase;
  let mockRepository: WaterIntakeRepository;

  const todayStr = new Date().toISOString().split('T')[0];

  beforeEach(() => {
    mockRepository = mockWaterIntakeRepository();
    useCase = new GetDailySummaryUseCase(mockRepository);
  });

  it('should return the correct summary when a log for today exists', async () => {
    // Arrange
    const todayLog: Log = {
      date: todayStr,
      entries: [
        { id: '1', amount: 500, timestamp: Date.now() },
        { id: '2', amount: 250, timestamp: Date.now() },
      ],
    };
    (mockRepository.getLogs as ReturnType<typeof vi.fn>).mockResolvedValue([todayLog]);

    // Act
    const summary = await useCase.execute();

    // Assert
    expect(summary.total).toBe(750);
    expect(summary.entries).toHaveLength(2);
    expect(summary.entries).toEqual(todayLog.entries);
  });

  it('should return a zero summary when no log for today exists', async () => {
    // Arrange
    const yesterdayLog: Log = {
      date: '2023-01-01',
      entries: [{ id: '1', amount: 1000, timestamp: Date.now() }],
    };
    (mockRepository.getLogs as ReturnType<typeof vi.fn>).mockResolvedValue([yesterdayLog]);

    // Act
    const summary = await useCase.execute();

    // Assert
    expect(summary.total).toBe(0);
    expect(summary.entries).toHaveLength(0);
  });

  it('should return a zero summary when there are no logs at all', async () => {
    // Arrange
    (mockRepository.getLogs as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    // Act
    const summary = await useCase.execute();

    // Assert
    expect(summary.total).toBe(0);
    expect(summary.entries).toHaveLength(0);
  });
});
