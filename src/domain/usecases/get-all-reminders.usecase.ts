import { IReminderRepository } from '../repositories/reminder.repository';
import { ReminderDto } from '../dtos';
import { Reminder } from '../entities/reminder.entity';

export class GetAllRemindersUseCase {
  constructor(private readonly reminderRepository: IReminderRepository) {}

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
