import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeleteWaterIntakeUseCase } from '../../../src/domain/usecases/delete-water-intake.usecase';
import { mockWaterIntakeRepository } from '../__mocks__/repositories/mock-water-intake.repository';
import type { WaterIntakeRepository } from '../../../src/domain/repositories';
import type { Log, Entry } from '../../../src/domain/entities';

describe('DeleteWaterIntakeUseCase', () => {
  let useCase: DeleteWaterIntakeUseCase;
  let mockRepository: WaterIntakeRepository;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const todayEntry1: Entry = { id: 'today-1', amount: 500, timestamp: Date.now() };
  const todayEntry2: Entry = { id: 'today-2', amount: 250, timestamp: Date.now() };
  const yesterdayEntry: Entry = { id: 'yesterday-1', amount: 1000, timestamp: Date.now() };

  const initialLogs: Log[] = [
    { date: todayStr, entries: [todayEntry1, todayEntry2] },
    { date: yesterdayStr, entries: [yesterdayEntry] },
  ];

  beforeEach(() => {
    // Deep copy logs for each test to ensure isolation
    const logsCopy = JSON.parse(JSON.stringify(initialLogs));
    mockRepository = mockWaterIntakeRepository();
    (mockRepository.getLogs as ReturnType<typeof vi.fn>).mockResolvedValue(logsCopy);
    useCase = new DeleteWaterIntakeUseCase(mockRepository);
  });

  it('should delete a specific entry from today\'s log', async () => {
    // Act
    await useCase.execute('today-1');

    // Assert
    expect(mockRepository.saveLogs).toHaveBeenCalledTimes(1);
    const savedLogs = (mockRepository.saveLogs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    const todayLog = savedLogs.find(log => log.date === todayStr);

    expect(todayLog?.entries).toHaveLength(1);
    expect(todayLog?.entries[0].id).toBe('today-2');
  });

  it("should remove today's log entirely if it becomes empty after deletion", async () => {
    // Arrange: modify the initial logs for this specific test case
    const singleEntryTodayLog: Log[] = [{ date: todayStr, entries: [todayEntry1] }];
    (mockRepository.getLogs as ReturnType<typeof vi.fn>).mockResolvedValue(singleEntryTodayLog);

    // Act
    await useCase.execute('today-1');

    // Assert
    const savedLogs = (mockRepository.saveLogs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    const todayLog = savedLogs.find(log => log.date === todayStr);

    expect(todayLog).toBeUndefined();
    expect(savedLogs).toHaveLength(0);
  });

  it('should not delete an entry if its ID matches but its date is not today', async () => {
    // Act
    await useCase.execute('yesterday-1');

    // Assert
    const savedLogs = (mockRepository.saveLogs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    const yesterdayLog = savedLogs.find(log => log.date === yesterdayStr);

    expect(yesterdayLog?.entries).toHaveLength(1);
    expect(yesterdayLog?.entries[0].id).toBe('yesterday-1');
  });

  it('should not change logs if the entry ID does not exist', async () => {
    // Act
    await useCase.execute('non-existent-id');

    // Assert
    const savedLogs = (mockRepository.saveLogs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(savedLogs).toEqual(initialLogs);
  });
});
