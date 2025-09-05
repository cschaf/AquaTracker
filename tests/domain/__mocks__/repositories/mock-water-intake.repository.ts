import { vi } from 'vitest';
import { WaterIntakeRepository } from '../../../../src/domain/repositories';

export const mockWaterIntakeRepository = (): WaterIntakeRepository => ({
  getLogs: vi.fn().mockResolvedValue([]),
  saveLogs: vi.fn().mockResolvedValue(undefined),
});
