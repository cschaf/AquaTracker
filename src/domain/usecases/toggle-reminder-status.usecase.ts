import { IReminderRepository } from '../repositories/reminder.repository';
import { NotificationService } from '../../infrastructure/services/notification.service';
import { ReminderDto } from '../dtos';

export class ToggleReminderStatusUseCase {
  constructor(
    private readonly reminderRepository: IReminderRepository,
    private readonly notificationService: typeof NotificationService
  ) {}

  async execute(id: string): Promise<ReminderDto> {
    const reminder = await this.reminderRepository.findById(id);

    if (!reminder) {
      throw new Error('Reminder not found');
    }

    if (reminder.isActive) {
      reminder.deactivate();
      await this.notificationService.cancelNotification(reminder.id);
    } else {
      reminder.activate();
      await this.notificationService.scheduleNotification(reminder);
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
