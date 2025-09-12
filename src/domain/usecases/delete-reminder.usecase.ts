import type { IReminderRepository } from '../repositories/reminder.repository';
import { NotificationService } from '../../infrastructure/services/notification.service';

export class DeleteReminderUseCase {
  private readonly reminderRepository: IReminderRepository;
  private readonly notificationService: typeof NotificationService;

  constructor(
    reminderRepository: IReminderRepository,
    notificationService: typeof NotificationService
  ) {
    this.reminderRepository = reminderRepository;
    this.notificationService = notificationService;
  }

  async execute(id: string): Promise<boolean> {
    try {
      await this.reminderRepository.delete(id);
      await this.notificationService.cancelNotification(id);
      return true;
    } catch (error) {
      console.error(`Failed to delete reminder ${id}:`, error);
      return false;
    }
  }
}
