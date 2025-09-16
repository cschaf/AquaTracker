import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateReminderUseCase } from '../../../src/domain/usecases/create-reminder.usecase';
import type { IReminderRepository } from '../../../src/domain/repositories/reminder.repository';
import { Reminder } from '../../../src/domain/entities/reminder.entity';
import type { CreateReminderDto } from '../../../src/domain/dtos';

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
    );
  });

  it('should save a reminder', async () => {
    const dto: CreateReminderDto = { title: 'Drink Water', time: '10:00' };

    await createReminderUseCase.execute(dto);

    expect(mockReminderRepository.save).toHaveBeenCalledTimes(1);
    const savedReminder = (mockReminderRepository.save as vi.Mock).mock.calls[0][0];
    expect(savedReminder).toBeInstanceOf(Reminder);
    expect(savedReminder.title).toBe(dto.title);
    expect(savedReminder.time).toBe(dto.time);
  });
});
