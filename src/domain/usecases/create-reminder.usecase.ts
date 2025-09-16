import type { IReminderRepository } from '../repositories/reminder.repository';
import { Reminder } from '../entities/reminder.entity';
import type { CreateReminderDto, ReminderDto } from '../dtos';
import { generateRandomId } from '../utils/id.generator';

export class CreateReminderUseCase {
  private readonly reminderRepository: IReminderRepository;

  constructor(
    reminderRepository: IReminderRepository,
  ) {
    this.reminderRepository = reminderRepository;
  }

  async execute(dto: CreateReminderDto): Promise<ReminderDto> {
    const reminder = new Reminder({
        id: generateRandomId(),
        ...dto
    });

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
