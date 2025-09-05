import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateGeneralSettingsUseCase } from '../../../src/domain/usecases/update-general-settings.usecase';
import { mockGeneralSettingsRepository } from '../__mocks__/repositories/mock-general-settings.repository';
import type { GeneralSettingsRepository } from '../../../src/domain/repositories';
import type { GeneralSettings } from '../../../src/domain/entities';
import { DomainError } from '../../../src/domain/errors';

describe('UpdateGeneralSettingsUseCase', () => {
  let useCase: UpdateGeneralSettingsUseCase;
  let mockRepository: GeneralSettingsRepository;

  beforeEach(() => {
    mockRepository = mockGeneralSettingsRepository();
    useCase = new UpdateGeneralSettingsUseCase(mockRepository);
  });

  it('should save valid settings', async () => {
    // Arrange
    const newSettings: GeneralSettings = { theme: 'dark' };

    // Act
    await useCase.execute(newSettings);

    // Assert
    expect(mockRepository.save).toHaveBeenCalledWith(newSettings);
  });

  it('should throw a DomainError for an invalid theme', async () => {
    // Arrange
    const invalidSettings = { theme: 'invalid-theme' } as GeneralSettings;

    // Act & Assert
    await expect(useCase.execute(invalidSettings)).rejects.toThrow(DomainError);
    await expect(useCase.execute(invalidSettings)).rejects.toThrow('Invalid settings provided.');
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('should throw a DomainError for null settings', async () => {
    // Act & Assert
    await expect(useCase.execute(null as any)).rejects.toThrow(DomainError);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
