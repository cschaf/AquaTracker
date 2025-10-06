/**
 * @file Implements the ITokenRepository interface using IndexedDB.
 * This class handles the storage and retrieval of the user's active FCM token.
 */

import { openDB, IDBPDatabase } from 'idb';
import { ITokenRepository } from '../../domain/repositories/IToken.repository';

const DB_NAME = 'AquaTrackerDB';
const STORE_NAME = 'fcm-token-store';
const TOKEN_KEY = 'user-fcm-token';

export class IdbTokenRepository implements ITokenRepository {
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
   * Saves the FCM token to IndexedDB.
   * @param token - The FCM token string.
   */
  async save(token: string): Promise<void> {
    const db = await this.dbPromise;
    await db.put(STORE_NAME, token, TOKEN_KEY);
  }

  /**
   * Retrieves the FCM token from IndexedDB.
   * @returns The FCM token string, or null if not found.
   */
  async get(): Promise<string | null> {
    const db = await this.dbPromise;
    const token = await db.get(STORE_NAME, TOKEN_KEY);
    return token || null;
  }

  /**
   * Deletes the FCM token from IndexedDB.
   */
  async delete(): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(STORE_NAME, TOKEN_KEY);
  }
}