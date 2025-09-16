/**
 * @file Instantiates and exports all use case classes.
 * @licence MIT
 */

import {
  AddWaterIntakeUseCase,
  DeleteWaterIntakeUseCase,
  ExportDataUseCase,
  GetAllAchievementsUseCase,
  GetDailyGoalUseCase,
  GetDailySummaryUseCase,
  GetGeneralSettingsUseCase,
  GetLogsUseCase,
  GetQuickAddValuesUseCase,
  GetUnlockedAchievementsUseCase,
  ImportDataUseCase,
  RecalculateAchievementsUseCase,
  SetDailyGoalUseCase,
  UpdateGeneralSettingsUseCase,
  UpdateQuickAddValuesUseCase,
  UpdateWaterIntakeUseCase,
  CreateReminderUseCase,
  GetAllRemindersUseCase,
  DeleteReminderUseCase,
  ToggleReminderStatusUseCase,
} from '../domain/usecases';

import {
  achievementRepository,
  generalSettingsRepository,
  goalRepository,
  quickAddRepository,
  reminderRepository,
  waterIntakeRepository,
} from './repositories';

/**
 * A container for singleton instances of all use cases,
 * with their dependencies (repositories) injected.
 */
export const useCases = {
  addWaterIntake: new AddWaterIntakeUseCase(waterIntakeRepository),
  deleteWaterIntake: new DeleteWaterIntakeUseCase(waterIntakeRepository),
  updateWaterIntake: new UpdateWaterIntakeUseCase(waterIntakeRepository),
  getDailySummary: new GetDailySummaryUseCase(waterIntakeRepository),
  getLogs: new GetLogsUseCase(waterIntakeRepository),

  getDailyGoal: new GetDailyGoalUseCase(goalRepository),
  setDailyGoal: new SetDailyGoalUseCase(goalRepository),

  getQuickAddValues: new GetQuickAddValuesUseCase(quickAddRepository),
  updateQuickAddValues: new UpdateQuickAddValuesUseCase(quickAddRepository),

  getAllAchievements: new GetAllAchievementsUseCase(),
  getUnlockedAchievements: new GetUnlockedAchievementsUseCase(achievementRepository),
  recalculateAchievements: new RecalculateAchievementsUseCase(
    waterIntakeRepository,
    goalRepository,
    achievementRepository,
  ),

  getGeneralSettings: new GetGeneralSettingsUseCase(generalSettingsRepository),
  updateGeneralSettings: new UpdateGeneralSettingsUseCase(generalSettingsRepository),

  exportData: new ExportDataUseCase(waterIntakeRepository, goalRepository),
  importData: new ImportDataUseCase(waterIntakeRepository, goalRepository),

  // Reminder Use Cases
  createReminder: new CreateReminderUseCase(reminderRepository),
  getAllReminders: new GetAllRemindersUseCase(reminderRepository),
  deleteReminder: new DeleteReminderUseCase(reminderRepository),
  toggleReminderStatus: new ToggleReminderStatusUseCase(
    reminderRepository,
  ),
};

export type UseCases = typeof useCases;
