import type { IReminderRepository } from '../repositories/reminder.repository';
import { NotificationService } from '../../infrastructure/services/notification.service';
import { Reminder } from '../entities/reminder.entity';
import type { CreateReminderDto, ReminderDto } from '../dtos';
import { generateRandomId } from '../utils/id.generator';

export class CreateReminderUseCase {
  private readonly reminderRepository: IReminderRepository;
  private readonly notificationService: typeof NotificationService;

  constructor(
    reminderRepository: IReminderRepository,
    notificationService: typeof NotificationService
  ) {
    this.reminderRepository = reminderRepository;
    this.notificationService = notificationService;
  }

  async execute(dto: CreateReminderDto): Promise<ReminderDto> {
    const reminder = new Reminder({
        id: generateRandomId(),
        ...dto
    });

    await this.reminderRepository.save(reminder);

    this.notificationService.scheduleNotification({
      id: reminder.id,
      title: reminder.title,
      time: reminder.time,
      body: `It's time for your ${reminder.time} reminder to drink water!`,
    });

    return {
      id: reminder.id,
      title: reminder.title,
      time: reminder.time,
      createdAt: reminder.createdAt.toISOString(),
      isActive: reminder.isActive,
    };
  }
}
