import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToggleReminderStatusUseCase } from '../../../src/domain/usecases/toggle-reminder-status.usecase';
import { IReminderRepository } from '../../../src/domain/repositories/reminder.repository';
import { NotificationService } from '../../../src/infrastructure/services/notification.service';
import { Reminder } from '../../../src/domain/entities/reminder.entity';

// Mock dependencies
vi.mock('../../../src/infrastructure/services/notification.service');

const mockReminderRepository: IReminderRepository = {
  save: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  delete: vi.fn(),
  deleteAll: vi.fn(),
};

describe('ToggleReminderStatusUseCase', () => {
  let toggleReminderStatusUseCase: ToggleReminderStatusUseCase;
  const reminderId = 'reminder-123';
  let activeReminder: Reminder;
  let inactiveReminder: Reminder;

  beforeEach(() => {
    vi.clearAllMocks();
    toggleReminderStatusUseCase = new ToggleReminderStatusUseCase(
      mockReminderRepository,
      NotificationService
    );
    activeReminder = new Reminder({ id: reminderId, title: 'Test', time: '10:00', isActive: true });
    inactiveReminder = new Reminder({ id: reminderId, title: 'Test', time: '10:00', isActive: false });
  });

  it('should deactivate an active reminder and cancel its notification', async () => {
    (mockReminderRepository.findById as vi.Mock).mockResolvedValue(activeReminder);

    const result = await toggleReminderStatusUseCase.execute(reminderId);

    expect(mockReminderRepository.findById).toHaveBeenCalledWith(reminderId);
    expect(mockReminderRepository.save).toHaveBeenCalledTimes(1);
    const savedReminder = (mockReminderRepository.save as vi.Mock).mock.calls[0][0];
    expect(savedReminder.isActive).toBe(false);

    expect(NotificationService.cancelNotification).toHaveBeenCalledWith(reminderId);
    expect(NotificationService.scheduleNotification).not.toHaveBeenCalled();

    expect(result.isActive).toBe(false);
  });

  it('should activate an inactive reminder and schedule its notification', async () => {
    (mockReminderRepository.findById as vi.Mock).mockResolvedValue(inactiveReminder);

    const result = await toggleReminderStatusUseCase.execute(reminderId);

    expect(mockReminderRepository.findById).toHaveBeenCalledWith(reminderId);
    expect(mockReminderRepository.save).toHaveBeenCalledTimes(1);
    const savedReminder = (mockReminderRepository.save as vi.Mock).mock.calls[0][0];
    expect(savedReminder.isActive).toBe(true);

    expect(NotificationService.scheduleNotification).toHaveBeenCalledWith(savedReminder);
    expect(NotificationService.cancelNotification).not.toHaveBeenCalled();

    expect(result.isActive).toBe(true);
  });

  it('should throw an error if the reminder is not found', async () => {
    (mockReminderRepository.findById as vi.Mock).mockResolvedValue(null);
    await expect(toggleReminderStatusUseCase.execute(reminderId)).rejects.toThrow('Reminder not found');
  });
});
