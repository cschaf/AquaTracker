import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteReminderUseCase } from '../../../src/domain/usecases/delete-reminder.usecase';
import type { IReminderRepository } from '../../../src/domain/repositories/reminder.repository';
import { NotificationService } from '../../../src/infrastructure/services/notification.service';

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

  it('should delete a reminder and cancel its notification', async () => {
    (mockReminderRepository.delete as vi.Mock).mockResolvedValue(undefined);

    const result = await deleteReminderUseCase.execute(reminderId);

    expect(mockReminderRepository.delete).toHaveBeenCalledWith(reminderId);
    expect(NotificationService.cancelNotification).toHaveBeenCalledWith(reminderId);
    expect(result).toBe(true);
  });

  it('should return false if deleting from repository fails', async () => {
    (mockReminderRepository.delete as vi.Mock).mockRejectedValue(new Error('Delete failed'));

    const result = await deleteReminderUseCase.execute(reminderId);

    expect(result).toBe(false);
    expect(NotificationService.cancelNotification).not.toHaveBeenCalled();
  });
});
