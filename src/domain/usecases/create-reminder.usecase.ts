import { IReminderRepository } from '../repositories/reminder.repository';
import { NotificationService } from '../../infrastructure/services/notification.service';
import { Reminder } from '../entities/reminder.entity';
import { CreateReminderDto, ReminderDto } from '../dtos';
import { generateRandomId } from '../utils/id.generator';

export class CreateReminderUseCase {
  constructor(
    private readonly reminderRepository: IReminderRepository,
    private readonly notificationService: typeof NotificationService
  ) {}

  async execute(dto: CreateReminderDto): Promise<ReminderDto> {
    // Validation is handled by the Reminder entity constructor
    const reminder = new Reminder({
        id: generateRandomId(),
        ...dto
    });

    await this.reminderRepository.save(reminder);
    await this.notificationService.scheduleNotification(reminder);

    return {
      id: reminder.id,
      title: reminder.title,
      time: reminder.time,
      createdAt: reminder.createdAt.toISOString(),
      isActive: reminder.isActive,
    };
  }
}
