import type { IReminderRepository } from '../repositories/reminder.repository';
import { Reminder } from '../entities/reminder.entity';
import type { CreateReminderDto, ReminderDto } from '../dtos';
import { generateRandomId } from '../utils/id.generator';
import { DomainError } from '../errors/domain.error';

export class CreateReminderUseCase {
  private readonly reminderRepository: IReminderRepository;

  constructor(reminderRepository: IReminderRepository) {
    this.reminderRepository = reminderRepository;
  }

  async execute(dto: CreateReminderDto): Promise<ReminderDto> {
    const allReminders = await this.reminderRepository.findAll();

    const reminderExists = allReminders.some(
      (reminder) => reminder.time === dto.time,
    );

    if (reminderExists) {
      throw new DomainError('Reminder with this time already exists');
    }

    const title = dto.title || `Reminder ${allReminders.length + 1}`;

    const reminder = new Reminder({
      id: generateRandomId(),
      ...dto,
      title,
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
