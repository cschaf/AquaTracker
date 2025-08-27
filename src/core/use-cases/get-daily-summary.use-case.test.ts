import { describe, it, expect, vi } from 'vitest';
import { GetDailySummaryUseCase } from './get-daily-summary.use-case';
import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import type { Log } from '../entities/water-intake';

const createMockGateway = (initialLogs: Log[] = []): WaterIntakeGateway => {
  return {
    getLogs: vi.fn().mockResolvedValue(initialLogs),
    saveLogs: vi.fn(),
  };
};

describe('GetDailySummaryUseCase', () => {
  const today = new Date().toISOString().split('T')[0];
  const initialLogs: Log[] = [
    {
      date: today,
      entries: [
        { id: '1', amount: 500, timestamp: Date.now() },
        { id: '2', amount: 250, timestamp: Date.now() },
      ],
    },
    {
      date: '2023-01-01',
      entries: [
        { id: '3', amount: 1000, timestamp: Date.now() },
      ],
    }
  ];

  it('should return the total and entries for today', async () => {
    // Arrange
    const mockGateway = createMockGateway(initialLogs);
    const useCase = new GetDailySummaryUseCase(mockGateway);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result.total).toBe(750);
    expect(result.entries).toHaveLength(2);
  });

  it('should return 0 total and empty entries if there is no log for today', async () => {
    // Arrange
    const mockGateway = createMockGateway([]);
    const useCase = new GetDailySummaryUseCase(mockGateway);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result.total).toBe(0);
    expect(result.entries).toHaveLength(0);
  });
});
