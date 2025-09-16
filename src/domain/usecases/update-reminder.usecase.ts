import type { IReminderRepository } from '../repositories/reminder.repository';
import { DomainError } from '../errors/domain.error';
import type { ReminderDto, UpdateReminderDto } from '../dtos';

export class UpdateReminderUseCase {
  constructor(private readonly reminderRepository: IReminderRepository) {}

  async execute(dto: UpdateReminderDto): Promise<ReminderDto> {
    const reminder = await this.reminderRepository.findById(dto.id);

    if (!reminder) {
      throw new DomainError('Reminder not found');
    }

    if (dto.time) {
      const allReminders = await this.reminderRepository.findAll();
      const reminderExists = allReminders.some(
        (r) => r.time === dto.time && r.id !== dto.id,
      );

      if (reminderExists) {
        throw new DomainError('A reminder with this time already exists.');
      }
      reminder.updateTime(dto.time);
    }

    if (dto.title) {
      reminder.updateTitle(dto.title);
    }

    await this.reminderRepository.save(reminder);

    return {
      id: reminder.id,
      title: reminder.title,
      time: reminder.time,
      createdAt: reminder.createdAt.toISOString(),
      isActive: reminder.isActive,
    };
  }
}
