import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToggleReminderStatusUseCase } from '../../../src/domain/usecases/toggle-reminder-status.usecase';
import type { IReminderRepository } from '../../../src/domain/repositories/reminder.repository';
import { Reminder } from '../../../src/domain/entities/reminder.entity';

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
    );
    activeReminder = new Reminder({ id: reminderId, title: 'Test', time: '10:00', isActive: true });
    inactiveReminder = new Reminder({ id: reminderId, title: 'Test', time: '10:00', isActive: false });
  });

  it('should deactivate an active reminder', async () => {
    (mockReminderRepository.findById as vi.Mock).mockResolvedValue(activeReminder);

    await toggleReminderStatusUseCase.execute(reminderId);

    expect(mockReminderRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ isActive: false })
    );
  });

  it('should activate an inactive reminder', async () => {
    (mockReminderRepository.findById as vi.Mock).mockResolvedValue(inactiveReminder);

    await toggleReminderStatusUseCase.execute(reminderId);

    expect(mockReminderRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ isActive: true })
    );
  });
});
