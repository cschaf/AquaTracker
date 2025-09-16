import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToggleReminderStatusUseCase } from '../../../src/domain/usecases/toggle-reminder-status.usecase';
import type { IReminderRepository } from '../../../src/domain/repositories/reminder.repository';
import { NotificationService } from '../../../src/infrastructure/services/notification.service';
import { Reminder } from '../../../src/domain/entities/reminder.entity';

const mockPostMessage = vi.fn();
Object.defineProperty(navigator, 'serviceWorker', {
    value: {
        controller: {
            postMessage: mockPostMessage,
        },
    },
    writable: true,
});

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

  it('should deactivate an active reminder and post a cancel message', async () => {
    (mockReminderRepository.findById as vi.Mock).mockResolvedValue(activeReminder);

    await toggleReminderStatusUseCase.execute(reminderId);

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'CANCEL_REMINDER',
      payload: { id: reminderId }
    });
  });

  it('should activate an inactive reminder and post a schedule message', async () => {
    (mockReminderRepository.findById as vi.Mock).mockResolvedValue(inactiveReminder);

    await toggleReminderStatusUseCase.execute(reminderId);

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'SCHEDULE_REMINDER',
      payload: {
        id: inactiveReminder.id,
        title: inactiveReminder.title,
        time: inactiveReminder.time,
        body: `It's time for your ${inactiveReminder.time} reminder to drink water!`
      }
    });
  });
});
