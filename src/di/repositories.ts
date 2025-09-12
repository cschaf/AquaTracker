/**
 * @file Instantiates and exports all repository implementations.
 * @licence MIT
 */

import {
  LocalStorageAchievementRepository,
  LocalStorageGeneralSettingsRepository,
  LocalStorageGoalRepository,
  LocalStorageQuickAddRepository,
  LocalStorageReminderRepository,
  LocalStorageWaterIntakeRepository,
} from '../infrastructure/repositories';

/**
 * A container for singleton instances of all repositories.
 */
export const achievementRepository = new LocalStorageAchievementRepository();
export const generalSettingsRepository = new LocalStorageGeneralSettingsRepository();
export const goalRepository = new LocalStorageGoalRepository();
export const quickAddRepository = new LocalStorageQuickAddRepository();
export const waterIntakeRepository = new LocalStorageWaterIntakeRepository();
export const reminderRepository = new LocalStorageReminderRepository();
