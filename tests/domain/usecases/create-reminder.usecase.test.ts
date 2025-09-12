import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateReminderUseCase } from '../../../src/domain/usecases/create-reminder.usecase';
import type { IReminderRepository } from '../../../src/domain/repositories/reminder.repository';
import { NotificationService } from '../../../src/infrastructure/services/notification.service';
import { Reminder } from '../../../src/domain/entities/reminder.entity';
import type { CreateReminderDto } from '../../../src/domain/dtos';

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

describe('CreateReminderUseCase', () => {
  let createReminderUseCase: CreateReminderUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    createReminderUseCase = new CreateReminderUseCase(
      mockReminderRepository,
      NotificationService
    );
  });

  it('should save a reminder and post a schedule message to the service worker', async () => {
    const dto: CreateReminderDto = { title: 'Drink Water', time: '10:00' };

    await createReminderUseCase.execute(dto);

    expect(mockReminderRepository.save).toHaveBeenCalledTimes(1);
    const savedReminder = (mockReminderRepository.save as vi.Mock).mock.calls[0][0];

    expect(mockPostMessage).toHaveBeenCalledTimes(1);
    expect(mockPostMessage).toHaveBeenCalledWith({
        type: 'SCHEDULE_REMINDER',
        payload: {
            id: savedReminder.id,
            title: dto.title,
            time: dto.time,
            body: `It's time for your ${dto.time} reminder to drink water!`
        }
    });
  });
});
