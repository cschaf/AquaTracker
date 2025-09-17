import type { IReminderRepository } from '../../domain/repositories/reminder.repository';
import { Reminder } from '../../domain/entities/reminder.entity';
import { get, set } from 'idb-keyval';

const REMINDERS_KEY = 'reminders';

// A plain object representation of a Reminder for safe storage.
interface StoredReminder {
  id: string;
  title: string;
  time: string;
  createdAt: string; // Stored as an ISO string
  isActive: boolean;
}

export class IdbReminderRepository implements IReminderRepository {
  private async _getAllPlain(): Promise<StoredReminder[]> {
    return (await get<StoredReminder[]>(REMINDERS_KEY)) || [];
  }

  private _rehydrate(plainReminder: StoredReminder): Reminder {
    return new Reminder({
        ...plainReminder,
        createdAt: new Date(plainReminder.createdAt),
    });
  }

  async findAll(): Promise<Reminder[]> {
    const plainReminders = await this._getAllPlain();
    return plainReminders.map(this._rehydrate);
  }

  async findById(id: string): Promise<Reminder | null> {
    const plainReminders = await this._getAllPlain();
    const plainReminder = plainReminders.find(r => r.id === id);
    return plainReminder ? this._rehydrate(plainReminder) : null;
  }

  async save(reminder: Reminder): Promise<void> {
    const plainReminders = await this._getAllPlain();
    const index = plainReminders.findIndex(r => r.id === reminder.id);

    // Convert class instance to a plain object for storage
    const reminderToStore: StoredReminder = {
        id: reminder.id,
        title: reminder.title,
        time: reminder.time,
        isActive: reminder.isActive,
        createdAt: reminder.createdAt.toISOString(),
    };

    if (index > -1) {
      plainReminders[index] = reminderToStore;
    } else {
      plainReminders.push(reminderToStore);
    }
    await set(REMINDERS_KEY, plainReminders);
  }

  async delete(id: string): Promise<void> {
    let plainReminders = await this._getAllPlain();
    plainReminders = plainReminders.filter(r => r.id !== id);
    await set(REMINDERS_KEY, plainReminders);
  }

  async deleteAll(): Promise<void> {
    await set(REMINDERS_KEY, []);
  }
}
