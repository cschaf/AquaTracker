import type { IReminderRepository } from '../repositories/reminder.repository';
import type { ReminderDto } from '../dtos';
import type { Reminder } from '../entities/reminder.entity';

export class GetAllRemindersUseCase {
  private readonly reminderRepository: IReminderRepository;

  constructor(reminderRepository: IReminderRepository) {
    this.reminderRepository = reminderRepository;
  }

  private toDto(reminder: Reminder): ReminderDto {
    return {
      id: reminder.id,
      title: reminder.title,
      time: reminder.time,
      createdAt: reminder.createdAt.toISOString(),
      isActive: reminder.isActive,
    };
  }

  async execute(): Promise<ReminderDto[]> {
    const reminders = await this.reminderRepository.findAll();
    return reminders.map(this.toDto);
  }
}
