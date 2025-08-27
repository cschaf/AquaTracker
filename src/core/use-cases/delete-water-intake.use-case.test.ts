import { describe, it, expect, vi } from 'vitest';
import { DeleteWaterIntakeUseCase } from './delete-water-intake.use-case';
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

describe('DeleteWaterIntakeUseCase', () => {
  const today = new Date().toISOString().split('T')[0];
  const initialLogs: Log[] = [
    {
      date: today,
      entries: [
        { id: '1', amount: 500, timestamp: Date.now() },
        { id: '2', amount: 250, timestamp: Date.now() },
      ],
    },
  ];

  it('should remove a specific water intake entry from the log', async () => {
    // Arrange
    const mockGateway = createMockGateway(initialLogs);
    const useCase = new DeleteWaterIntakeUseCase(mockGateway);
    const entryIdToDelete = '1';

    // Act
    await useCase.execute(entryIdToDelete);

    // Assert
    expect(mockGateway.saveLogs).toHaveBeenCalledTimes(1);
    const savedLogs = (mockGateway.saveLogs as any).mock.calls[0][0];
    const todaysLog = savedLogs.find((log: Log) => log.date === today);
    expect(todaysLog.entries).toHaveLength(1);
    expect(todaysLog.entries[0].id).toBe('2');
  });

  it('should not change the logs if the entry ID does not exist', async () => {
    // Arrange
    const mockGateway = createMockGateway(initialLogs);
    const useCase = new DeleteWaterIntakeUseCase(mockGateway);
    const nonExistentEntryId = '99';

    // Act
    await useCase.execute(nonExistentEntryId);

    // Assert
    expect(mockGateway.saveLogs).toHaveBeenCalledTimes(1);
    const savedLogs = (mockGateway.saveLogs as any).mock.calls[0][0];
    expect(savedLogs).toEqual(initialLogs);
  });
});
