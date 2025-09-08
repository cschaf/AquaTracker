/**
 * @file Contains the use case for retrieving the user's general settings.
 * @licence MIT
 */

import type { GeneralSettingsRepository } from '../repositories/general-settings.repository';
import type { GeneralSettings } from '../entities/general-settings.entity';

/**
 * Implements the business logic for fetching the user's general application settings.
 */
export class GetGeneralSettingsUseCase {
  private readonly generalSettingsRepository: GeneralSettingsRepository;

  /**
   * Creates an instance of the GetGeneralSettingsUseCase.
   * @param generalSettingsRepository - The repository for general settings data.
   */
  constructor(generalSettingsRepository: GeneralSettingsRepository) {
    this.generalSettingsRepository = generalSettingsRepository;
  }

  /**
   * Executes the use case to get the general settings.
   * @returns A promise that resolves to the GeneralSettings object, or null if not found.
   */
  async execute(): Promise<GeneralSettings | null> {
    return this.generalSettingsRepository.get();
  }
}
