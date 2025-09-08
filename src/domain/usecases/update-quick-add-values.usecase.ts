/**
 * @file Contains the use case for updating the user's quick add values.
 * @licence MIT
 */

import type { QuickAddRepository } from '../repositories/quick-add.repository';
import type { QuickAddValues } from '../entities/quick-add-values.entity';
import { DomainError } from '../errors/domain.error';

/**
 * Implements the business logic for updating the user's defined quick add values.
 */
export class UpdateQuickAddValuesUseCase {
  private readonly quickAddRepository: QuickAddRepository;

  /**
   * Creates an instance of the UpdateQuickAddValuesUseCase.
   * @param quickAddRepository - The repository for quick add data.
   */
  constructor(quickAddRepository: QuickAddRepository) {
    this.quickAddRepository = quickAddRepository;
  }

  /**
   * Executes the use case to update the quick add values.
   * @param values - A tuple of three numbers to save.
   * @returns A promise that resolves when the operation is complete.
   * @throws {DomainError} If the values are invalid.
   */
  async execute(values: QuickAddValues): Promise<void> {
    if (!Array.isArray(values) || values.length !== 3) {
      throw new DomainError('Invalid quick add values format. Must be an array of three numbers.');
    }

    for (const value of values) {
      if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0 || value > 5000) {
        throw new DomainError('Quick add values must be positive integers not greater than 5000.');
      }
    }

    await this.quickAddRepository.saveQuickAddValues(values);
  }
}
