import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateReminderUseCase } from '../../../src/domain/usecases/create-reminder.usecase';
import type { IReminderRepository } from '../../../src/domain/repositories/reminder.repository';
import { Reminder } from '../../../src/domain/entities/reminder.entity';
import type { CreateReminderDto } from '../../../src/domain/dtos';
import { DomainError } from '../../../src/domain/errors/domain.error';

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
    createReminderUseCase = new CreateReminderUseCase(mockReminderRepository);
  });

  it('should save a reminder', async () => {
    const dto: CreateReminderDto = { title: 'Drink Water', time: '10:00' };
    (mockReminderRepository.findAll as vi.Mock).mockResolvedValue([]);

    await createReminderUseCase.execute(dto);

    expect(mockReminderRepository.save).toHaveBeenCalledTimes(1);
    const savedReminder = (mockReminderRepository.save as vi.Mock).mock.calls[0][0];
    expect(savedReminder).toBeInstanceOf(Reminder);
    expect(savedReminder.title).toBe(dto.title);
    expect(savedReminder.time).toBe(dto.time);
  });

  it('should set a default title if no title is provided', async () => {
    const dto: CreateReminderDto = { time: '11:00' };
    (mockReminderRepository.findAll as vi.Mock).mockResolvedValue([]);

    await createReminderUseCase.execute(dto);

    expect(mockReminderRepository.save).toHaveBeenCalledTimes(1);
    const savedReminder = (mockReminderRepository.save as vi.Mock).mock.calls[0][0];
    expect(savedReminder).toBeInstanceOf(Reminder);
    expect(savedReminder.title).toBe('Reminder 1');
    expect(savedReminder.time).toBe(dto.time);
  });

  it('should throw an error if a reminder with the same time already exists', async () => {
    const existingReminder = new Reminder({
      id: '1',
      title: 'Existing',
      time: '10:00',
    });
    const dto: CreateReminderDto = { title: 'Drink Water', time: '10:00' };
    (mockReminderRepository.findAll as vi.Mock).mockResolvedValue([
      existingReminder,
    ]);

    await expect(createReminderUseCase.execute(dto)).rejects.toThrow(
      new DomainError('Reminder with this time already exists'),
    );

    expect(mockReminderRepository.save).not.toHaveBeenCalled();
  });
});
