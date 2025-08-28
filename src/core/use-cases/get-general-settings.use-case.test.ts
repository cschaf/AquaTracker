import { describe, it, expect, vi } from 'vitest';
import { GetGeneralSettingsUseCase } from './get-general-settings.use-case';
import type { GeneralSettingsGateway } from '../gateways/general-settings.gateway';
import type { GeneralSettings } from '../entities/general-settings';

const createMockGateway = (): GeneralSettingsGateway => ({
  get: vi.fn(),
  save: vi.fn(),
});

describe('GetGeneralSettingsUseCase', () => {
  it('should return the general settings from the gateway', async () => {
    // Arrange
    const mockGateway = createMockGateway();
    const useCase = new GetGeneralSettingsUseCase(mockGateway);
    const settings: GeneralSettings = { theme: 'dark' };
    (mockGateway.get as vi.Mock).mockResolvedValue(settings);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockGateway.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual(settings);
  });

  it('should return null if no settings are found', async () => {
    // Arrange
    const mockGateway = createMockGateway();
    const useCase = new GetGeneralSettingsUseCase(mockGateway);
    (mockGateway.get as vi.Mock).mockResolvedValue(null);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockGateway.get).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });
});
