import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteReminderUseCase } from '../../../src/domain/usecases/delete-reminder.usecase';
import { IReminderRepository } from '../../../src/domain/repositories/reminder.repository';
import { NotificationService } from '../../../src/infrastructure/services/notification.service';

// Mock dependencies
vi.mock('../../../src/infrastructure/services/notification.service');

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
    // Arrange
    (mockReminderRepository.delete as vi.Mock).mockResolvedValue(undefined);
    (NotificationService.cancelNotification as vi.Mock).mockResolvedValue(undefined);

    // Act
    const result = await deleteReminderUseCase.execute(reminderId);

    // Assert
    expect(mockReminderRepository.delete).toHaveBeenCalledWith(reminderId);
    expect(NotificationService.cancelNotification).toHaveBeenCalledWith(reminderId);
    expect(result).toBe(true);
  });

  it('should return false if deleting from repository fails', async () => {
    (mockReminderRepository.delete as vi.Mock).mockRejectedValue(new Error('Delete failed'));

    const result = await deleteReminderUseCase.execute(reminderId);

    expect(result).toBe(false);
    // Notification should not be cancelled if repo fails
    expect(NotificationService.cancelNotification).not.toHaveBeenCalled();
  });
});
