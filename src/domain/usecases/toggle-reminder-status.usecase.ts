import type { IReminderRepository } from '../repositories/reminder.repository';
import type { ReminderDto } from '../dtos';

export class ToggleReminderStatusUseCase {
  private readonly reminderRepository: IReminderRepository;

  constructor(
    reminderRepository: IReminderRepository,
  ) {
    this.reminderRepository = reminderRepository;
  }

  async execute(id: string): Promise<ReminderDto> {
    const reminder = await this.reminderRepository.findById(id);

    if (!reminder) {
      throw new Error('Reminder not found');
    }

    if (reminder.isActive) {
      reminder.deactivate();
    } else {
      reminder.activate();
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
