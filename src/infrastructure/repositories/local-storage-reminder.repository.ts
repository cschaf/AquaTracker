import { IReminderRepository } from '../../domain/repositories/reminder.repository';
import { Reminder } from '../../domain/entities/reminder.entity';
import { getItem, setItem } from '../storage/local.storage';

const REMINDERS_KEY = 'aquatracker_reminders';

// This is the shape of the object as it is stored in JSON.
// The `createdAt` property is a string after JSON serialization.
type StoredReminder = Omit<Reminder, 'activate' | 'deactivate' | 'updateTitle' | 'updateTime' | 'createdAt'> & {
    createdAt: string;
};


export class LocalStorageReminderRepository implements IReminderRepository {

  /**
   * Reads all plain objects from localStorage.
   */
  private _getAllPlain(): StoredReminder[] {
    return getItem<StoredReminder[]>(REMINDERS_KEY) || [];
  }

  /**
   * Converts a plain stored object back into a Reminder class instance.
   */
  private _rehydrate(plainReminder: StoredReminder): Reminder {
    return new Reminder({
        ...plainReminder,
        createdAt: new Date(plainReminder.createdAt),
    });
  }

  async findAll(): Promise<Reminder[]> {
    const plainReminders = this._getAllPlain();
    return plainReminders.map(this._rehydrate);
  }

  async findById(id: string): Promise<Reminder | null> {
    const plainReminders = this._getAllPlain();
    const plainReminder = plainReminders.find(r => r.id === id);
    return plainReminder ? this._rehydrate(plainReminder) : null;
  }

  async save(reminder: Reminder): Promise<void> {
    const plainReminders = this._getAllPlain();
    const index = plainReminders.findIndex(r => r.id === reminder.id);

    // Convert the Reminder instance to a plain object for storage
    const reminderToStore = {
        ...reminder,
        createdAt: reminder.createdAt.toISOString(),
    };

    if (index > -1) {
      plainReminders[index] = reminderToStore;
    } else {
      plainReminders.push(reminderToStore);
    }
    setItem(REMINDERS_KEY, plainReminders);
  }

  async delete(id: string): Promise<void> {
    let plainReminders = this._getAllPlain();
    plainReminders = plainReminders.filter(r => r.id !== id);
    setItem(REMINDERS_KEY, plainReminders);
  }

  async deleteAll(): Promise<void> {
    setItem(REMINDERS_KEY, []);
  }
}
