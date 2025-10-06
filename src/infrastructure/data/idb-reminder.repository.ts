import type { IReminderRepository } from '../../domain/repositories/reminder.repository';
import { Reminder } from '../../domain/entities/reminder.entity';
import { get, set } from 'idb-keyval';
import { syncService } from '../services/sync.service';
import { IdbTokenRepository } from './idb-token.repository';

const REMINDERS_KEY = 'reminders';

// A plain object representation of a Reminder for safe storage.
interface StoredReminder {
  id: string;
  title: string;
  time: string;
  createdAt: string; // Stored as an ISO string
  isActive: boolean;
  lastNotified: string | null; // Stored as an ISO string
}

export class IdbReminderRepository implements IReminderRepository {
  private tokenRepository: IdbTokenRepository;

  constructor() {
    this.tokenRepository = new IdbTokenRepository();
  }

  private async _getAllPlain(): Promise<StoredReminder[]> {
    return (await get<StoredReminder[]>(REMINDERS_KEY)) || [];
  }

  private _rehydrate(plainReminder: StoredReminder): Reminder {
    return new Reminder({
      ...plainReminder,
      createdAt: new Date(plainReminder.createdAt),
      lastNotified: plainReminder.lastNotified ? new Date(plainReminder.lastNotified) : undefined,
    });
  }

  async findAll(): Promise<Reminder[]> {
    const plainReminders = await this._getAllPlain();
    return plainReminders.map(this._rehydrate);
  }

  async findById(id: string): Promise<Reminder | null> {
    const plainReminders = await this._getAllPlain();
    const plainReminder = plainReminders.find((r) => r.id === id);
    return plainReminder ? this._rehydrate(plainReminder) : null;
  }

  async save(reminder: Reminder): Promise<void> {
    const plainReminders = await this._getAllPlain();
    const index = plainReminders.findIndex((r) => r.id === reminder.id);
    const operation = index > -1 ? 'update' : 'add';

    // Convert class instance to a plain object for storage
    const reminderToStore: StoredReminder = {
      id: reminder.id,
      title: reminder.title,
      time: reminder.time,
      isActive: reminder.isActive,
      createdAt: reminder.createdAt.toISOString(),
      lastNotified: reminder.lastNotified ? reminder.lastNotified.toISOString() : null,
    };

    if (index > -1) {
      plainReminders[index] = reminderToStore;
    } else {
      plainReminders.push(reminderToStore);
    }
    await set(REMINDERS_KEY, plainReminders);

    // After saving locally, trigger sync
    const fcmToken = await this.tokenRepository.get();
    if (fcmToken) {
      await syncService.syncReminder(operation, reminder, fcmToken);
    } else {
        console.warn('No FCM token found, skipping reminder sync.');
    }
  }

  async delete(id: string): Promise<void> {
    let plainReminders = await this._getAllPlain();
    const reminderToDelete = plainReminders.find(r => r.id === id);

    const updatedReminders = plainReminders.filter(r => r.id !== id);
    await set(REMINDERS_KEY, updatedReminders);

    // After deleting locally, trigger sync only if a reminder was actually found.
    if (reminderToDelete) {
        const fcmToken = await this.tokenRepository.get();
        if (fcmToken) {
            const rehydratedReminder = this._rehydrate(reminderToDelete);
            await syncService.syncReminder('delete', rehydratedReminder, fcmToken);
        } else {
            console.warn('No FCM token found, skipping reminder sync.');
        }
    }
  }

  async deleteAll(): Promise<void> {
    const plainReminders = await this._getAllPlain();
    await set(REMINDERS_KEY, []);

    // After deleting all locally, trigger sync for each
    const fcmToken = await this.tokenRepository.get();
    if (fcmToken) {
        for (const plainReminder of plainReminders) {
            const rehydratedReminder = this._rehydrate(plainReminder);
            await syncService.syncReminder('delete', rehydratedReminder, fcmToken);
        }
    } else {
        console.warn('No FCM token found, skipping reminder sync.');
    }
  }
}