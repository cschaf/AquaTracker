import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateReminderUseCase } from '../../../src/domain/usecases/update-reminder.usecase';
import type { IReminderRepository } from '../../../src/domain/repositories/reminder.repository';
import { Reminder } from '../../../src/domain/entities/reminder.entity';
import type { UpdateReminderDto } from '../../../src/domain/dtos';
import { DomainError } from '../../../src/domain/errors/domain.error';

const mockReminderRepository: IReminderRepository = {
  save: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  delete: vi.fn(),
  deleteAll: vi.fn(),
};

describe('UpdateReminderUseCase', () => {
  let updateReminderUseCase: UpdateReminderUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    updateReminderUseCase = new UpdateReminderUseCase(mockReminderRepository);
  });

  it('should update a reminder title', async () => {
    const reminder = new Reminder({ id: '1', title: 'Old Title', time: '10:00' });
    (mockReminderRepository.findById as vi.Mock).mockResolvedValue(reminder);
    const dto: UpdateReminderDto = { id: '1', title: 'New Title' };

    await updateReminderUseCase.execute(dto);

    expect(mockReminderRepository.save).toHaveBeenCalledTimes(1);
    const savedReminder = (mockReminderRepository.save as vi.Mock).mock.calls[0][0];
    expect(savedReminder.title).toBe('New Title');
  });

  it('should update a reminder time', async () => {
    const reminder = new Reminder({ id: '1', title: 'Title', time: '10:00' });
    (mockReminderRepository.findById as vi.Mock).mockResolvedValue(reminder);
    (mockReminderRepository.findAll as vi.Mock).mockResolvedValue([]);
    const dto: UpdateReminderDto = { id: '1', time: '11:00' };

    await updateReminderUseCase.execute(dto);

    expect(mockReminderRepository.save).toHaveBeenCalledTimes(1);
    const savedReminder = (mockReminderRepository.save as vi.Mock).mock.calls[0][0];
    expect(savedReminder.time).toBe('11:00');
  });

  it('should update both title and time', async () => {
    const reminder = new Reminder({ id: '1', title: 'Old Title', time: '10:00' });
    (mockReminderRepository.findById as vi.Mock).mockResolvedValue(reminder);
    (mockReminderRepository.findAll as vi.Mock).mockResolvedValue([]);
    const dto: UpdateReminderDto = { id: '1', title: 'New Title', time: '11:00' };

    await updateReminderUseCase.execute(dto);

    expect(mockReminderRepository.save).toHaveBeenCalledTimes(1);
    const savedReminder = (mockReminderRepository.save as vi.Mock).mock.calls[0][0];
    expect(savedReminder.title).toBe('New Title');
    expect(savedReminder.time).toBe('11:00');
  });

  it('should throw an error if reminder not found', async () => {
    (mockReminderRepository.findById as vi.Mock).mockResolvedValue(null);
    const dto: UpdateReminderDto = { id: '1', title: 'New Title' };

    await expect(updateReminderUseCase.execute(dto)).rejects.toThrow(
      new DomainError('Reminder not found'),
    );
  });

  it('should throw an error if time conflicts with another reminder', async () => {
    const reminder = new Reminder({ id: '1', title: 'Title', time: '10:00' });
    const existingReminder = new Reminder({ id: '2', title: 'Existing', time: '11:00' });
    (mockReminderRepository.findById as vi.Mock).mockResolvedValue(reminder);
    (mockReminderRepository.findAll as vi.Mock).mockResolvedValue([existingReminder]);
    const dto: UpdateReminderDto = { id: '1', time: '11:00' };

    await expect(updateReminderUseCase.execute(dto)).rejects.toThrow(
      new DomainError('A reminder with this time already exists.'),
    );
  });

  it('should not change reminder if no new data is provided', async () => {
    const reminder = new Reminder({ id: '1', title: 'Title', time: '10:00' });
    (mockReminderRepository.findById as vi.Mock).mockResolvedValue(reminder);
    const dto: UpdateReminderDto = { id: '1' };

    await updateReminderUseCase.execute(dto);

    expect(mockReminderRepository.save).toHaveBeenCalledTimes(1);
    const savedReminder = (mockReminderRepository.save as vi.Mock).mock.calls[0][0];
    expect(savedReminder.title).toBe('Title');
    expect(savedReminder.time).toBe('10:00');
  });
});
