import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetGeneralSettingsUseCase } from '../../../src/domain/usecases/get-general-settings.usecase';
import { mockGeneralSettingsRepository } from '../__mocks__/repositories/mock-general-settings.repository';
import type { GeneralSettingsRepository } from '../../../src/domain/repositories';
import type { GeneralSettings } from '../../../src/domain/entities';

describe('GetGeneralSettingsUseCase', () => {
  let useCase: GetGeneralSettingsUseCase;
  let mockRepository: GeneralSettingsRepository;

  beforeEach(() => {
    mockRepository = mockGeneralSettingsRepository();
    useCase = new GetGeneralSettingsUseCase(mockRepository);
  });

  it('should return the general settings from the repository', async () => {
    // Arrange
    const expectedSettings: GeneralSettings = { theme: 'dark' };
    (mockRepository.get as ReturnType<typeof vi.fn>).mockResolvedValue(expectedSettings);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockRepository.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedSettings);
  });

  it('should return null if the repository returns null', async () => {
    // Arrange
    (mockRepository.get as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toBeNull();
  });
});
