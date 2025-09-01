// /src/app/event.types.ts
/* eslint-disable @typescript-eslint/consistent-type-definitions */

/**
 * Defines the events used in the application.
 * Using a type instead of an interface for better compatibility with mitt.
 */
import type { Achievement } from '../core/entities/achievement';

import type { GeneralSettings } from '../core/entities/general-settings';

export type ApplicationEvents = {
  intakeDataChanged: void;
  goalUpdated: void;
  settingsChanged: GeneralSettings;
  achievementUnlocked: Achievement[];
  dataSync: { status: 'success'; operation: 'import' | 'export' };
  quickAddValuesChanged: void;
};
