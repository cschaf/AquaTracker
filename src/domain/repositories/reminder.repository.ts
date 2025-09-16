import type { Reminder } from '../entities/reminder.entity';

/**
 * Represents the interface for a repository that handles the persistence of reminders.
 */
export interface IReminderRepository {
  /**
   * Saves a reminder. If the reminder already exists, it should be updated.
   * @param reminder - The Reminder object to save.
   * @returns A promise that resolves when the operation is complete.
   */
  save(reminder: Reminder): Promise<void>;

  /**
   * Retrieves all reminders.
   * @returns A promise that resolves to an array of Reminder objects.
   */
  findAll(): Promise<Reminder[]>;

  /**
   * Finds a reminder by its ID.
   * @param id - The ID of the reminder to find.
   * @returns A promise that resolves to the Reminder object or null if not found.
   */
  findById(id: string): Promise<Reminder | null>;

  /**
   * Deletes a reminder by its ID.
   * @param id - The ID of the reminder to delete.
   * @returns A promise that resolves when the operation is complete.
   */
  delete(id: string): Promise<void>;

  /**
   * Deletes all reminders.
   * @returns A promise that resolves when the operation is complete.
   */
  deleteAll(): Promise<void>;
}
