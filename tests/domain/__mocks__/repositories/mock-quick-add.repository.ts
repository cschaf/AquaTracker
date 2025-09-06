import { vi } from 'vitest';
import { QuickAddRepository } from '../../../../src/domain/repositories';
export const mockQuickAddRepository = (): QuickAddRepository => ({
  getQuickAddValues: vi.fn().mockResolvedValue([250, 500, 1000]),
  saveQuickAddValues: vi.fn().mockResolvedValue(undefined),
});
