import { vi } from 'vitest';
import { AchievementRepository } from '../../../../src/domain/repositories';

export const mockAchievementRepository = (): AchievementRepository => ({
  getUnlockedAchievementIds: vi.fn().mockResolvedValue([]),
  saveUnlockedAchievementIds: vi.fn().mockResolvedValue(undefined),
});
