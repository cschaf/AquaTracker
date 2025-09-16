import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetAllRemindersUseCase } from '../../../src/domain/usecases/get-all-reminders.usecase';
import { IReminderRepository } from '../../../src/domain/repositories/reminder.repository';
import { Reminder } from '../../../src/domain/entities/reminder.entity';

const mockReminderRepository: IReminderRepository = {
  save: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  delete: vi.fn(),
  deleteAll: vi.fn(),
};

describe('GetAllRemindersUseCase', () => {
  let getAllRemindersUseCase: GetAllRemindersUseCase;
  const reminder1 = new Reminder({ id: '1', title: 'Test 1', time: '10:00' });
  const reminder2 = new Reminder({ id: '2', title: 'Test 2', time: '12:00' });

  beforeEach(() => {
    vi.clearAllMocks();
    getAllRemindersUseCase = new GetAllRemindersUseCase(mockReminderRepository);
  });

  it('should return a list of reminder DTOs', async () => {
    // Arrange
    const reminders = [reminder1, reminder2];
    (mockReminderRepository.findAll as vi.Mock).mockResolvedValue(reminders);

    // Act
    const result = await getAllRemindersUseCase.execute();

    // Assert
    expect(mockReminderRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(reminder1.id);
    expect(result[1].title).toBe(reminder2.title);
    expect(result[0].createdAt).toBe(reminder1.createdAt.toISOString());
  });

  it('should return an empty array if no reminders exist', async () => {
    (mockReminderRepository.findAll as vi.Mock).mockResolvedValue([]);
    const result = await getAllRemindersUseCase.execute();
    expect(result).toEqual([]);
  });
});
