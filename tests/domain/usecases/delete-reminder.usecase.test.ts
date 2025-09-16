import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteReminderUseCase } from '../../../src/domain/usecases/delete-reminder.usecase';
import type { IReminderRepository } from '../../../src/domain/repositories/reminder.repository';
import { NotificationService } from '../../../src/infrastructure/services/notification.service';

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

describe('DeleteReminderUseCase', () => {
  let deleteReminderUseCase: DeleteReminderUseCase;
  const reminderId = 'reminder-123';

  beforeEach(() => {
    vi.clearAllMocks();
    deleteReminderUseCase = new DeleteReminderUseCase(
      mockReminderRepository,
      NotificationService
    );
  });

  it('should delete a reminder and post a cancel message to the service worker', async () => {
    (mockReminderRepository.delete as vi.Mock).mockResolvedValue(undefined);

    await deleteReminderUseCase.execute(reminderId);

    expect(mockReminderRepository.delete).toHaveBeenCalledWith(reminderId);
    expect(mockPostMessage).toHaveBeenCalledWith({
        type: 'CANCEL_REMINDER',
        payload: { id: reminderId }
    });
  });
});
