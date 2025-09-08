import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateWaterIntakeUseCase } from '../../../src/domain/usecases/update-water-intake.usecase';
import { mockWaterIntakeRepository } from '../__mocks__/repositories/mock-water-intake.repository';
import type { WaterIntakeRepository } from '../../../src/domain/repositories';
import type { Log, Entry } from '../../../src/domain/entities';
import { DomainError } from '../../../src/domain/errors';

describe('UpdateWaterIntakeUseCase', () => {
  let useCase: UpdateWaterIntakeUseCase;
  let mockRepository: WaterIntakeRepository;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const todayEntry: Entry = { id: 'today-1', amount: 500, timestamp: Date.now() };
  const yesterdayEntry: Entry = { id: 'yesterday-1', amount: 1000, timestamp: Date.now() };

  const initialLogs: Log[] = [
    { date: todayStr, entries: [todayEntry] },
    { date: yesterdayStr, entries: [yesterdayEntry] },
  ];

  beforeEach(() => {
    const logsCopy = JSON.parse(JSON.stringify(initialLogs));
    mockRepository = mockWaterIntakeRepository();
    (mockRepository.getLogs as ReturnType<typeof vi.fn>).mockResolvedValue(logsCopy);
    useCase = new UpdateWaterIntakeUseCase(mockRepository);
  });

  it("should update a specific entry from today's log", async () => {
    const newAmount = 750;
    await useCase.execute('today-1', newAmount);

    const savedLogs = (mockRepository.saveLogs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    const todayLog = savedLogs.find(log => log.date === todayStr);
    expect(todayLog?.entries[0].amount).toBe(newAmount);
  });

  it('should not update an entry from a different day', async () => {
    const newAmount = 1500;
    await useCase.execute('yesterday-1', newAmount);

    const savedLogs = (mockRepository.saveLogs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    const yesterdayLog = savedLogs.find(log => log.date === yesterdayStr);
    expect(yesterdayLog?.entries[0].amount).toBe(1000); // Should be unchanged
  });

  it('should throw a DomainError for a non-positive amount', async () => {
    await expect(useCase.execute('today-1', 0)).rejects.toThrow('Intake amount must be a positive number.');
    await expect(useCase.execute('today-1', -100)).rejects.toThrow('Intake amount must be a positive number.');
    expect(mockRepository.saveLogs).not.toHaveBeenCalled();
  });

  it('should not change logs if the entry ID does not exist in today\'s log', async () => {
    await useCase.execute('non-existent-id', 100);
    const savedLogs = (mockRepository.saveLogs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(savedLogs).toEqual(initialLogs);
  });
});
