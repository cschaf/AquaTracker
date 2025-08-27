import { describe, it, expect, vi } from 'vitest';
import { UpdateWaterIntakeUseCase } from './update-water-intake.use-case';
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

describe('UpdateWaterIntakeUseCase', () => {
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

  it('should update the amount of a specific water intake entry', async () => {
    // Arrange
    const mockGateway = createMockGateway(initialLogs);
    const useCase = new UpdateWaterIntakeUseCase(mockGateway);
    const entryIdToUpdate = '1';
    const newAmount = 750;

    // Act
    await useCase.execute(entryIdToUpdate, newAmount);

    // Assert
    expect(mockGateway.saveLogs).toHaveBeenCalledTimes(1);
    const savedLogs = (mockGateway.saveLogs as any).mock.calls[0][0];
    const todaysLog = savedLogs.find(log => log.date === today);
    const updatedEntry = todaysLog.entries.find(entry => entry.id === entryIdToUpdate);
    expect(updatedEntry.amount).toBe(newAmount);
  });

  it('should not change the logs if the entry ID does not exist', async () => {
    // Arrange
    const mockGateway = createMockGateway(initialLogs);
    const useCase = new UpdateWaterIntakeUseCase(mockGateway);
    const nonExistentEntryId = '99';
    const newAmount = 1000;

    // Act
    await useCase.execute(nonExistentEntryId, newAmount);

    // Assert
    expect(mockGateway.saveLogs).toHaveBeenCalledTimes(1);
    const savedLogs = (mockGateway.saveLogs as any).mock.calls[0][0];
    expect(savedLogs).toEqual(initialLogs);
  });
});
