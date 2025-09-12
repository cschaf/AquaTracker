import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateReminderUseCase } from '../../../src/domain/usecases/create-reminder.usecase';
import { IReminderRepository } from '../../../src/domain/repositories/reminder.repository';
import { NotificationService } from '../../../src/infrastructure/services/notification.service';
import { Reminder } from '../../../src/domain/entities/reminder.entity';
import { CreateReminderDto } from '../../../src/domain/dtos';

// Mock dependencies
vi.mock('../../../src/infrastructure/services/notification.service');

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

    // Check that repository's save was called
    expect(mockReminderRepository.save).toHaveBeenCalledTimes(1);
    const savedReminder = (mockReminderRepository.save as vi.Mock).mock.calls[0][0];
    expect(savedReminder).toBeInstanceOf(Reminder);
    expect(savedReminder.title).toBe(dto.title);
    expect(savedReminder.time).toBe(dto.time);

    // Check that notification was scheduled
    expect(NotificationService.scheduleNotification).toHaveBeenCalledTimes(1);
    expect(NotificationService.scheduleNotification).toHaveBeenCalledWith(savedReminder);

    // Check the returned DTO
    expect(result.title).toBe(dto.title);
    expect(result.id).toBeDefined();
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
