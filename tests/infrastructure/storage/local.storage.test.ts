import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setItem, getItem, StorageError } from '../../../src/infrastructure/storage/local.storage';

describe('localStorage wrapper', () => {
  // Before each test, clear localStorage to ensure a clean slate
  beforeEach(() => {
    localStorage.clear();
    // Also clear any mocks on localStorage
    vi.restoreAllMocks();
  });

  describe('setItem', () => {
    it('should store a string value', () => {
      setItem('myKey', 'myValue');
      expect(localStorage.getItem('myKey')).toBe(JSON.stringify('myValue'));
    });

    it('should store an object value', () => {
      const myObject = { a: 1, b: 'test' };
      setItem('myObjectKey', myObject);
      expect(localStorage.getItem('myObjectKey')).toBe(JSON.stringify(myObject));
    });

    it('should throw a StorageError if localStorage fails', () => {
      // Mock console.error to prevent logging during this test
      const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock localStorage.setItem to throw an error
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QUOTA_EXCEEDED');
      });

      expect(() => setItem('anyKey', 'anyValue')).toThrow(StorageError);
      expect(() => setItem('anyKey', 'anyValue')).toThrow('Failed to set item with key "anyKey" in localStorage.');

      consoleMock.mockRestore();
    });
  });

  describe('getItem', () => {
    it('should retrieve a stored string value', () => {
      localStorage.setItem('myKey', JSON.stringify('myValue'));
      const value = getItem<string>('myKey');
      expect(value).toBe('myValue');
    });

    it('should retrieve a stored object value', () => {
      const myObject = { a: 1, b: 'test' };
      localStorage.setItem('myObjectKey', JSON.stringify(myObject));
      const value = getItem<{ a: number; b: string }>('myObjectKey');
      expect(value).toEqual(myObject);
    });

    it('should return null for a non-existent key', () => {
      const value = getItem('nonExistentKey');
      expect(value).toBeNull();
    });

    it('should return null if JSON parsing fails (corrupted data)', () => {
      // Mock console.error to prevent logging during this test
      const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => {});

      localStorage.setItem('corruptedKey', 'this is not valid json');
      const value = getItem('corruptedKey');
      expect(value).toBeNull();

      consoleMock.mockRestore();
    });
  });

  describe('StorageError', () => {
    it('should be an instance of Error', () => {
      const error = new StorageError('test');
      expect(error).toBeInstanceOf(Error);
    });

    it('should have the correct name', () => {
      const error = new StorageError('test');
      expect(error.name).toBe('StorageError');
    });
  });
});
