/**
 * @file Contains the use case for retrieving the user's quick add values.
 * @licence MIT
 */

import type { QuickAddRepository } from '../repositories/quick-add.repository';
import type { QuickAddValues } from '../entities/quick-add-values.entity';

/**
 * Implements the business logic for fetching the user's defined quick add values.
 */
export class GetQuickAddValuesUseCase {
  private readonly quickAddRepository: QuickAddRepository;

  /**
   * Creates an instance of the GetQuickAddValuesUseCase.
   * @param quickAddRepository - The repository for quick add data.
   */
  constructor(quickAddRepository: QuickAddRepository) {
    this.quickAddRepository = quickAddRepository;
  }

  /**
   * Executes the use case to get the quick add values.
   * @returns A promise that resolves to a tuple of three numbers.
   */
  async execute(): Promise<QuickAddValues> {
    return this.quickAddRepository.getQuickAddValues();
  }
}
