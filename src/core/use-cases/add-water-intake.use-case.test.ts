import { describe, it, expect, vi } from 'vitest';
import { AddWaterIntakeUseCase } from './add-water-intake.use-case';
import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import type { Log } from '../entities/water-intake';

const createMockGateway = (initialLogs: Log[] = []): WaterIntakeGateway => {
  let logs: Log[] = [...initialLogs];
  return {
    getLogs: vi.fn().mockResolvedValue(logs),
    saveLogs: vi.fn().mockImplementation(async (updatedLogs: Log[]) => {
      logs = updatedLogs;
    }),
  };
};

describe('AddWaterIntakeUseCase', () => {
  it('should add a new entry to an existing log for today', async () => {
    // Arrange
    const today = new Date().toISOString().split('T')[0];
    const mockGateway = createMockGateway([
      { date: today, entries: [{ id: '1', amount: 500, timestamp: Date.now() }] }
    ]);
    const useCase = new AddWaterIntakeUseCase(mockGateway);

    // Act
    await useCase.execute(250);

    // Assert
    expect(mockGateway.saveLogs).toHaveBeenCalledTimes(1);
    const savedLogs = (mockGateway.saveLogs as any).mock.calls[0][0];
    expect(savedLogs[0].entries).toHaveLength(2);
    expect(savedLogs[0].entries[1].amount).toBe(250);
  });

  it('should create a new log for today if one does not exist', async () => {
    // Arrange
    const mockGateway = createMockGateway([]); // No initial logs
    const useCase = new AddWaterIntakeUseCase(mockGateway);

    // Act
    await useCase.execute(500);

    // Assert
    expect(mockGateway.saveLogs).toHaveBeenCalledTimes(1);
    const savedLogs = (mockGateway.saveLogs as any).mock.calls[0][0];
    expect(savedLogs).toHaveLength(1);
    expect(savedLogs[0].entries[0].amount).toBe(500);
  });
});
