/**
 * @file Contains the localStorage implementation of the QuickAddRepository.
 * @licence MIT
 */

import { QuickAddRepository, QuickAddValues } from '../../domain';
import { getItem, setItem } from '../storage/local.storage';

const QUICK_ADD_VALUES_KEY = 'quickAddValues';
const DEFAULT_QUICK_ADD_VALUES: QuickAddValues = [250, 500, 1000];

/**
 * A repository for managing quick add values data persistence using localStorage.
 */
export class LocalStorageQuickAddRepository implements QuickAddRepository {
  /**
   * Retrieves the user's defined quick add values from localStorage.
   * If no values are set, it returns a default array.
   * @returns A promise that resolves to a tuple of three numbers.
   */
  async getQuickAddValues(): Promise<QuickAddValues> {
    const savedValues = getItem<QuickAddValues>(QUICK_ADD_VALUES_KEY);
    // Basic validation to ensure the retrieved data matches the expected type.
    if (savedValues && Array.isArray(savedValues) && savedValues.length === 3) {
      return savedValues;
    }
    return DEFAULT_QUICK_ADD_VALUES;
  }

  /**
   * Saves the user's defined quick add values to localStorage.
   * @param values - A tuple of three numbers to save.
   * @returns A promise that resolves when the operation is complete.
   */
  async saveQuickAddValues(values: QuickAddValues): Promise<void> {
    setItem(QUICK_ADD_VALUES_KEY, values);
  }
}
