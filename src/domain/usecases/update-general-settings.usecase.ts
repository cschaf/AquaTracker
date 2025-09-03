/**
 * @file Contains the use case for updating the user's general settings.
 * @licence MIT
 */

import type { GeneralSettingsRepository } from '../repositories/general-settings.repository';
import type { GeneralSettings } from '../entities/general-settings.entity';
import { DomainError } from '../errors/domain.error';

/**
 * Implements the business logic for updating the user's general application settings.
 */
export class UpdateGeneralSettingsUseCase {
  private readonly generalSettingsRepository: GeneralSettingsRepository;

  /**
   * Creates an instance of the UpdateGeneralSettingsUseCase.
   * @param generalSettingsRepository - The repository for general settings data.
   */
  constructor(generalSettingsRepository: GeneralSettingsRepository) {
    this.generalSettingsRepository = generalSettingsRepository;
  }

  /**
   * Executes the use case to update the general settings.
   * @param settings - The GeneralSettings object to save.
   * @returns A promise that resolves when the operation is complete.
   * @throws {DomainError} If the provided settings are invalid.
   */
  async execute(settings: GeneralSettings): Promise<void> {
    // Basic validation
    if (!settings || (settings.theme !== 'light' && settings.theme !== 'dark')) {
      throw new DomainError('Invalid settings provided.');
    }
    await this.generalSettingsRepository.save(settings);
  }
}
