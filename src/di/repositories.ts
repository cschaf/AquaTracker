/**
 * @file Instantiates and exports all repository implementations.
 * @licence MIT
 */

import { IdbWaterIntakeRepository } from '../infrastructure/repositories/idb-water-intake.repository';
import { IdbGoalRepository } from '../infrastructure/repositories/idb-goal.repository';
import { IdbQuickAddRepository } from '../infrastructure/repositories/idb-quick-add.repository';
import { IdbGeneralSettingsRepository } from '../infrastructure/repositories/idb-general-settings.repository';
import { IdbAchievementRepository } from '../infrastructure/repositories/idb-achievement.repository';
import { IdbReminderRepository } from '../infrastructure/repositories/idb-reminder.repository';
import { IdbUiStateRepository } from '../infrastructure/repositories/idb-ui-state.repository';

/**
 * A container for singleton instances of all repositories.
 */
export const achievementRepository = new IdbAchievementRepository();
export const generalSettingsRepository = new IdbGeneralSettingsRepository();
export const goalRepository = new IdbGoalRepository();
export const quickAddRepository = new IdbQuickAddRepository();
export const waterIntakeRepository = new IdbWaterIntakeRepository();
export const reminderRepository = new IdbReminderRepository();
export const uiStateRepository = new IdbUiStateRepository();
