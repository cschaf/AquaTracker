import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AddWaterIntakeUseCase } from '../../../src/domain/usecases/add-water-intake.usecase';
import { mockWaterIntakeRepository } from '../__mocks__/repositories/mock-water-intake.repository';
import type { WaterIntakeRepository } from '../../../src/domain/repositories';
import type { Log } from '../../../src/domain/entities';

// Mock the ID generator to have predictable IDs
vi.mock('../../../src/domain/utils/id.generator', () => ({
  generateRandomId: () => 'test-id',
}));

describe('AddWaterIntakeUseCase', () => {
  let useCase: AddWaterIntakeUseCase;
  let mockRepository: WaterIntakeRepository;

  const todayStr = new Date().toISOString().split('T')[0];

  beforeEach(() => {
    mockRepository = mockWaterIntakeRepository();
    useCase = new AddWaterIntakeUseCase(mockRepository);
  });

  it('should add a new entry to an existing log for today', async () => {
    // Arrange
    const initialLogs: Log[] = [
      { date: todayStr, entries: [{ id: '1', amount: 500, timestamp: Date.now() }] },
    ];
    (mockRepository.getLogs as ReturnType<typeof vi.fn>).mockResolvedValue(initialLogs);

    // Act
    await useCase.execute(250);

    // Assert
    expect(mockRepository.saveLogs).toHaveBeenCalledTimes(1);
    const savedLogs = (mockRepository.saveLogs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(savedLogs[0].entries).toHaveLength(2);
    expect(savedLogs[0].entries[1].amount).toBe(250);
    expect(savedLogs[0].entries[1].id).toContain('test-id');
  });

  it('should create a new log for today if one does not exist', async () => {
    // Arrange
    (mockRepository.getLogs as ReturnType<typeof vi.fn>).mockResolvedValue([]); // No initial logs

    // Act
    await useCase.execute(500);

    // Assert
    expect(mockRepository.saveLogs).toHaveBeenCalledTimes(1);
    const savedLogs = (mockRepository.saveLogs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(savedLogs).toHaveLength(1);
    expect(savedLogs[0].date).toBe(todayStr);
    expect(savedLogs[0].entries[0].amount).toBe(500);
  });

  it('should not affect logs from other days', async () => {
    // Arrange
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const initialLogs: Log[] = [
      { date: yesterday, entries: [{ id: '1', amount: 1000, timestamp: Date.now() }] },
    ];
    (mockRepository.getLogs as ReturnType<typeof vi.fn>).mockResolvedValue(initialLogs);

    // Act
    await useCase.execute(200);

    // Assert
    const savedLogs = (mockRepository.saveLogs as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(savedLogs).toHaveLength(2);
    expect(savedLogs.find(log => log.date === yesterday)?.entries.length).toBe(1);
  });
});
