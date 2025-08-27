import { describe, it, expect, vi } from 'vitest';
import { GetLogsUseCase } from './get-logs.use-case';
import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import type { Log } from '../entities/water-intake';

const createMockGateway = (initialLogs: Log[] = []): WaterIntakeGateway => {
  return {
    getLogs: vi.fn().mockResolvedValue(initialLogs),
    saveLogs: vi.fn(),
  };
};

describe('GetLogsUseCase', () => {
  const initialLogs: Log[] = [
    {
      date: '2023-01-01',
      entries: [
        { id: '1', amount: 500, timestamp: Date.now() },
      ],
    },
    {
      date: '2023-01-02',
      entries: [
        { id: '2', amount: 1000, timestamp: Date.now() },
      ],
    }
  ];

  it('should return all logs from the gateway', async () => {
    // Arrange
    const mockGateway = createMockGateway(initialLogs);
    const useCase = new GetLogsUseCase(mockGateway);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockGateway.getLogs).toHaveBeenCalledTimes(1);
    expect(result).toEqual(initialLogs);
  });
});
