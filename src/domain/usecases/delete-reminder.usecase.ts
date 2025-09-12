import { IReminderRepository } from '../repositories/reminder.repository';
import { NotificationService } from '../../infrastructure/services/notification.service';

export class DeleteReminderUseCase {
  constructor(
    private readonly reminderRepository: IReminderRepository,
    private readonly notificationService: typeof NotificationService
  ) {}

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
