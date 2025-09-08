import { vi } from 'vitest';
import { GeneralSettingsRepository } from '../../../../src/domain/repositories';
export const mockGeneralSettingsRepository = (): GeneralSettingsRepository => ({
  get: vi.fn().mockResolvedValue({ theme: 'light', notifications: true }),
  save: vi.fn().mockResolvedValue(undefined),
});
