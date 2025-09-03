/**
 * @file Defines the type mapping for all events used in the event bus.
 * @licence MIT
 */

import type { Achievement, GeneralSettings } from '../../../domain';

/**
 * A map of all possible events and their corresponding payload types.
 */
export interface EventMap {
  achievementUnlocked: Achievement[];
  intakeDataChanged: undefined;
  dataSync: { status: string; operation: string };
  settingsChanged: GeneralSettings;
  quickAddValuesChanged: undefined;
}
