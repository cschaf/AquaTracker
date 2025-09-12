import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateReminderUseCase } from '../../../src/domain/usecases/create-reminder.usecase';
import type { IReminderRepository } from '../../../src/domain/repositories/reminder.repository';
import { NotificationService } from '../../../src/infrastructure/services/notification.service';
import { Reminder } from '../../../src/domain/entities/reminder.entity';
import type { CreateReminderDto } from '../../../src/domain/dtos';

// Mock the entire service
vi.mock('../../../src/infrastructure/services/notification.service', () => ({
  NotificationService: {
    scheduleNotification: vi.fn(),
    cancelNotification: vi.fn(),
    requestPermission: vi.fn(),
    getPermission: vi.fn(),
  },
}));

const mockReminderRepository: IReminderRepository = {
  save: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  delete: vi.fn(),
  deleteAll: vi.fn(),
};

describe('CreateReminderUseCase', () => {
  let createReminderUseCase: CreateReminderUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    createReminderUseCase = new CreateReminderUseCase(
      mockReminderRepository,
      NotificationService
    );
  });

  it('should create and save a new reminder, then schedule a notification', async () => {
    const dto: CreateReminderDto = { title: 'Drink Water', time: '10:00' };

    const result = await createReminderUseCase.execute(dto);

    expect(mockReminderRepository.save).toHaveBeenCalledTimes(1);
    const savedReminder = (mockReminderRepository.save as vi.Mock).mock.calls[0][0];
    expect(savedReminder).toBeInstanceOf(Reminder);

    expect(NotificationService.scheduleNotification).toHaveBeenCalledTimes(1);
    expect(NotificationService.scheduleNotification).toHaveBeenCalledWith({
        id: savedReminder.id,
        title: dto.title,
        time: dto.time,
        body: `It's time for your ${dto.time} reminder to drink water!`
    });

    expect(result.title).toBe(dto.title);
  });

  it('should throw an error for invalid time format', async () => {
    const dto: CreateReminderDto = { title: 'Invalid Time', time: '99:99' };
    await expect(createReminderUseCase.execute(dto)).rejects.toThrow('Invalid time format. Expected HH:MM');
  });

  it('should throw an error for empty title', async () => {
    const dto: CreateReminderDto = { title: '', time: '12:00' };
    await expect(createReminderUseCase.execute(dto)).rejects.toThrow('Title cannot be empty');
  });
});
