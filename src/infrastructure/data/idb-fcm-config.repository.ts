/**
 * @file Implements the IFcmConfigRepository interface using IndexedDB.
 * This class handles the storage and retrieval of user-provided Firebase
 * configuration in the browser's IndexedDB.
 */

import { openDB, IDBPDatabase } from 'idb';
import { FcmConfig } from '../../domain/entities/fcm-config.entity';
import { IFcmConfigRepository } from '../../domain/repositories/IFcmConfig.repository';

const DB_NAME = 'AquaTrackerDB';
const STORE_NAME = 'fcm-config';
const CONFIG_KEY = 'user-fcm-config';

export class IdbFcmConfigRepository implements IFcmConfigRepository {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }

  /**
   * Saves the FCM configuration to IndexedDB.
   * @param config - The FCM configuration object.
   */
  async save(config: FcmConfig): Promise<void> {
    const db = await this.dbPromise;
    await db.put(STORE_NAME, config, CONFIG_KEY);
  }

  /**
   * Retrieves the FCM configuration from IndexedDB.
   * @returns The FCM configuration object, or null if not found.
   */
  async get(): Promise<FcmConfig | null> {
    const db = await this.dbPromise;
    const config = await db.get(STORE_NAME, CONFIG_KEY);
    return config || null;
  }

  /**
   * Deletes the FCM configuration from IndexedDB.
   */
  async delete(): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(STORE_NAME, CONFIG_KEY);
  }
}