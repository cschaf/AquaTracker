import { describe, it, expect, vi } from 'vitest';
import { UpdateGeneralSettingsUseCase } from './update-general-settings.use-case';
import type { GeneralSettingsGateway } from '../gateways/general-settings.gateway';
import type { GeneralSettings } from '../entities/general-settings';

const createMockGateway = (): GeneralSettingsGateway => ({
  get: vi.fn(),
  save: vi.fn(),
});

describe('UpdateGeneralSettingsUseCase', () => {
  it('should save the general settings via the gateway', async () => {
    // Arrange
    const mockGateway = createMockGateway();
    const useCase = new UpdateGeneralSettingsUseCase(mockGateway);
    const settings: GeneralSettings = { theme: 'dark' };

    // Act
    await useCase.execute(settings);

    // Assert
    expect(mockGateway.save).toHaveBeenCalledTimes(1);
    expect(mockGateway.save).toHaveBeenCalledWith(settings);
  });
});
