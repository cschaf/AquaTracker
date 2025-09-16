import type { IReminderRepository } from '../repositories/reminder.repository';

export class DeleteReminderUseCase {
  private readonly reminderRepository: IReminderRepository;

  constructor(
    reminderRepository: IReminderRepository,
  ) {
    this.reminderRepository = reminderRepository;
  }

  async execute(id: string): Promise<boolean> {
    try {
      await this.reminderRepository.delete(id);
      return true;
    } catch (error) {
      console.error(`Failed to delete reminder ${id}:`, error);
      return false;
    }
  }
}
