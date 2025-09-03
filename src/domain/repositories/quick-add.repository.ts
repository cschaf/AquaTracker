/**
 * @file Defines the repository interface for managing Quick Add values.
 * @licence MIT
 */

import type { QuickAddValues } from '../entities/quick-add-values.entity';

/**
 * Represents the interface for a repository that handles the persistence of quick add values.
 */
export interface QuickAddRepository {
  /**
   * Retrieves the user's defined quick add values.
   * @returns A promise that resolves to a tuple of three numbers.
   */
  getQuickAddValues(): Promise<QuickAddValues>;

  /**
   * Saves the user's defined quick add values.
   * @param values - A tuple of three numbers to save.
   * @returns A promise that resolves when the operation is complete.
   */
  saveQuickAddValues(values: QuickAddValues): Promise<void>;
}
