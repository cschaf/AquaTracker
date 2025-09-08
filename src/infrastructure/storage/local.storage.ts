/**
 * @file A safe wrapper for the browser's localStorage API.
 * @licence MIT
 */

/**
 * A generic error class for storage-related failures.
 */
export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Safely sets an item in localStorage.
 * Handles potential errors like disabled storage or quota exceeded.
 * @param key - The key for the storage item.
 * @param value - The value to be stored (will be JSON.stringified).
 * @throws {StorageError} If the value cannot be set.
 */
export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to set item in localStorage', e);
    throw new StorageError(`Failed to set item with key "${key}" in localStorage.`);
  }
}

/**
 * Safely gets an item from localStorage.
 * Handles potential errors like disabled storage or corrupted data.
 * @param key - The key of the item to retrieve.
 * @returns The parsed value, or null if the key is not found or an error occurs.
 */
export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (e) {
    console.error('Failed to get or parse item from localStorage', e);
    // In case of error (e.g., parsing failed), it's safer to return null
    // as if the data doesn't exist.
    return null;
  }
}
