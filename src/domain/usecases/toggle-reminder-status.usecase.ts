import type { IReminderRepository } from '../repositories/reminder.repository';
import { NotificationService } from '../../infrastructure/services/notification.service';
import type { ReminderDto } from '../dtos';

export class ToggleReminderStatusUseCase {
  private readonly reminderRepository: IReminderRepository;
  private readonly notificationService: typeof NotificationService;

  constructor(
    reminderRepository: IReminderRepository,
    notificationService: typeof NotificationService
  ) {
    this.reminderRepository = reminderRepository;
    this.notificationService = notificationService;
  }

  async execute(id: string): Promise<ReminderDto> {
    const reminder = await this.reminderRepository.findById(id);

    if (!reminder) {
      throw new Error('Reminder not found');
    }

    if (reminder.isActive) {
      reminder.deactivate();
      this.notificationService.cancelNotification(reminder.id);
    } else {
      reminder.activate();
      this.notificationService.scheduleNotification({
        id: reminder.id,
        title: reminder.title,
        time: reminder.time,
        body: `It's time for your ${reminder.time} reminder to drink water!`,
      });
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
