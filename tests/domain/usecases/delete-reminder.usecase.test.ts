import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteReminderUseCase } from '../../../src/domain/usecases/delete-reminder.usecase';
import type { IReminderRepository } from '../../../src/domain/repositories/reminder.repository';

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
    );
  });

  it('should delete a reminder', async () => {
    (mockReminderRepository.delete as vi.Mock).mockResolvedValue(undefined);

    await deleteReminderUseCase.execute(reminderId);

    expect(mockReminderRepository.delete).toHaveBeenCalledWith(reminderId);
  });
});
