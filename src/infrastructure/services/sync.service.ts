/**
 * @file Manages synchronization between the client and the Cloudflare Worker.
 * This service handles API calls for registering the FCM token and syncing
 * reminder data. It also includes an offline queue for failed sync operations.
 */
import { openDB, IDBPDatabase } from 'idb';
import { Reminder } from '../../domain/entities/reminder.entity';
import { FcmConfig } from '../../domain/entities/fcm-config.entity';

const WORKER_BASE_URL = 'https://aquatracker-worker.your-worker-subdomain.workers.dev'; // Replace with your actual worker URL
const QUEUE_DB_NAME = 'AquaTrackerSyncQueueDB';
const QUEUE_STORE_NAME = 'sync-queue';

interface QueuedOperation {
  id: number;
  payload: SyncPayload;
  timestamp: number;
}

type SyncPayload =
  | { type: 'sync-reminder'; data: { operation: 'add' | 'update' | 'delete'; reminder: Reminder, fcmToken: string } }
  | { type: 'register-token'; data: { fcmToken: string; timezone: string; fcmConfig: FcmConfig } };

class SyncService {
  private queueDbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.queueDbPromise = openDB(QUEUE_DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(QUEUE_STORE_NAME)) {
          db.createObjectStore(QUEUE_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      },
    });

    // Try to process the queue when the app loads
    this.processQueue();
    // And listen for when the app comes back online
    window.addEventListener('online', this.processQueue);
  }

  private async addToQueue(payload: SyncPayload): Promise<void> {
    const db = await this.queueDbPromise;
    await db.add(QUEUE_STORE_NAME, { payload, timestamp: Date.now() });
    console.log('Operation added to sync queue.');
  }

  private async processQueue(): Promise<void> {
    if (!navigator.onLine) {
        console.log('Offline. Queue processing paused.');
        return;
    }

    const db = await this.queueDbPromise;
    const operations = await db.getAll(QUEUE_STORE_NAME);

    if (operations.length === 0) return;

    console.log(`Processing ${operations.length} items from the sync queue.`);

    for (const op of operations) {
      const { id, payload } = op;
      let success = false;

      try {
        if (payload.type === 'register-token') {
          success = await this.performRegisterToken(payload.data);
        } else if (payload.type === 'sync-reminder') {
          success = await this.performSyncReminder(payload.data);
        }

        if (success) {
          await db.delete(QUEUE_STORE_NAME, id);
          console.log('Queued operation successful and removed.');
        } else {
            console.warn('Queued operation failed. Will retry later.');
        }
      } catch (error) {
        console.error('Error processing queued item:', error);
      }
    }
  }

  private async performRegisterToken(data: { fcmToken: string; timezone: string; fcmConfig: FcmConfig }): Promise<boolean> {
    const response = await fetch(`${WORKER_BASE_URL}/api/register-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.ok;
  }

  private async performSyncReminder(data: { operation: 'add' | 'update' | 'delete'; reminder: Reminder; fcmToken: string }): Promise<boolean> {
    const response = await fetch(`${WORKER_BASE_URL}/api/sync-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.ok;
  }

  async registerToken(fcmToken: string, fcmConfig: FcmConfig): Promise<void> {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const payload: SyncPayload = { type: 'register-token', data: { fcmToken, timezone, fcmConfig } };

    try {
        const success = await this.performRegisterToken(payload.data);
        if (!success) throw new Error('Failed to register token');
    } catch (error) {
        console.error('Failed to register token, adding to queue.', error);
        await this.addToQueue(payload);
    }
  }

  async syncReminder(operation: 'add' | 'update' | 'delete', reminder: Reminder, fcmToken: string): Promise<void> {
    const payload: SyncPayload = { type: 'sync-reminder', data: { operation, reminder, fcmToken } };

    try {
        const success = await this.performSyncReminder(payload.data);
        if (!success) throw new Error('Failed to sync reminder');
    } catch (error) {
        console.error(`Failed to ${operation} reminder, adding to queue.`, error);
        await this.addToQueue(payload);
    }
  }
}

export const syncService = new SyncService();